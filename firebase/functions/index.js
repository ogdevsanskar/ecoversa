const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const _ = require('lodash');
const moment = require('moment');

// Initialize Firebase Admin SDK
admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));

// Database references
const db = admin.firestore();
const rtdb = admin.database();

// ===== CLOUD FUNCTIONS =====

/**
 * Cloud Function to process IoT data and trigger rewards
 * Triggered when new sensor data is added to Realtime Database
 */
exports.processIoTData = functions.database.ref('/sensor-data/{pushId}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.val();
    const pushId = context.params.pushId;
    
    try {
      console.log('Processing IoT data:', data);
      
      // Store in Firestore for analytics
      await db.collection('sensor-data').add({
        ...data,
        id: pushId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        processed: true,
        anomaly_checked: false
      });
      
      // Check for achievements
      await checkUserAchievements(data);
      
      // Update live metrics
      await updateLiveMetrics(data);
      
      // Check for anomalies
      await checkDataAnomalies(data);
      
      console.log('IoT data processed successfully');
      return { success: true };
    } catch (error) {
      console.error('Error processing IoT data:', error);
      throw new functions.https.HttpsError('internal', 'Error processing IoT data');
    }
  });

/**
 * Cloud Function to check and award achievements
 */
async function checkUserAchievements(data) {
  try {
    // Get all users to check for achievements
    const usersSnapshot = await db.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      
      // Check energy saving achievements
      if (data.metric_type === 'electricity' && data.value < userData.baseline_energy * 0.8) {
        await awardAchievement(userId, 'energy_saver', {
          title: 'Energy Saver',
          description: '20% reduction in energy usage',
          reward_tokens: 50,
          carbon_saved: (userData.baseline_energy - data.value) * 0.4
        });
      }
      
      // Check water conservation achievements
      if (data.metric_type === 'water' && data.value < userData.baseline_water * 0.7) {
        await awardAchievement(userId, 'water_guardian', {
          title: 'Water Guardian',
          description: '30% reduction in water usage',
          reward_tokens: 75,
          water_saved: userData.baseline_water - data.value
        });
      }
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
}

/**
 * Award achievement to user
 */
async function awardAchievement(userId, achievementType, achievementData) {
  try {
    // Check if user already has this achievement
    const existingAchievement = await db.collection('achievements')
      .where('userId', '==', userId)
      .where('type', '==', achievementType)
      .limit(1)
      .get();
    
    if (existingAchievement.empty) {
      // Award new achievement
      await db.collection('achievements').add({
        userId,
        type: achievementType,
        ...achievementData,
        earned_date: admin.firestore.FieldValue.serverTimestamp(),
        claimed: false
      });
      
      // Send notification
      await sendNotification(userId, {
        type: 'achievement',
        title: `New Achievement: ${achievementData.title}`,
        message: achievementData.description,
        data: { achievementType, tokens: achievementData.reward_tokens }
      });
      
      console.log(`Achievement ${achievementType} awarded to user ${userId}`);
    }
  } catch (error) {
    console.error('Error awarding achievement:', error);
  }
}

/**
 * Update live metrics in Realtime Database
 */
async function updateLiveMetrics(data) {
  try {
    const metricsRef = rtdb.ref('live-metrics');
    
    // Update current metrics
    await metricsRef.child('current').update({
      [`${data.building}_${data.metric_type}`]: data.value,
      last_updated: admin.database.ServerValue.TIMESTAMP
    });
    
    // Update building totals
    const buildingRef = metricsRef.child(`buildings/${data.building}`);
    await buildingRef.update({
      [data.metric_type]: data.value,
      last_updated: admin.database.ServerValue.TIMESTAMP
    });
    
    // Calculate campus-wide totals
    await updateCampusTotals(data.metric_type);
    
  } catch (error) {
    console.error('Error updating live metrics:', error);
  }
}

/**
 * Check for data anomalies and alert if found
 */
async function checkDataAnomalies(data) {
  try {
    // Get historical data for this building and metric type
    const historicalData = await db.collection('sensor-data')
      .where('building', '==', data.building)
      .where('metric_type', '==', data.metric_type)
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();
    
    if (!historicalData.empty) {
      const values = historicalData.docs.map(doc => doc.data().value);
      const mean = _.mean(values);
      const stdDev = Math.sqrt(_.mean(values.map(v => Math.pow(v - mean, 2))));
      
      // Check if current value is more than 2 standard deviations from mean
      if (Math.abs(data.value - mean) > (2 * stdDev)) {
        await triggerAnomalyAlert({
          building: data.building,
          metric_type: data.metric_type,
          value: data.value,
          expected_range: [mean - stdDev, mean + stdDev],
          severity: Math.abs(data.value - mean) > (3 * stdDev) ? 'high' : 'medium'
        });
      }
    }
  } catch (error) {
    console.error('Error checking anomalies:', error);
  }
}

/**
 * Update campus-wide totals
 */
async function updateCampusTotals(metricType) {
  try {
    const buildingsSnapshot = await rtdb.ref('live-metrics/buildings').once('value');
    const buildings = buildingsSnapshot.val() || {};
    
    let total = 0;
    Object.values(buildings).forEach(building => {
      if (building[metricType]) {
        total += building[metricType];
      }
    });
    
    await rtdb.ref(`live-metrics/campus_totals/${metricType}`).set({
      value: total,
      last_updated: admin.database.ServerValue.TIMESTAMP
    });
    
  } catch (error) {
    console.error('Error updating campus totals:', error);
  }
}

/**
 * HTTP Function for AI/ML integration
 */
exports.processMLPredictions = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    const { predictions, model_version, timestamp } = req.body;
    
    // Store predictions in Firestore
    await db.collection('ai-predictions').add({
      predictions,
      model_version: model_version || '1.0',
      timestamp: timestamp || admin.firestore.FieldValue.serverTimestamp(),
      processed: true
    });
    
    // Trigger notifications for anomalies
    if (predictions.anomalies && predictions.anomalies.length > 0) {
      await triggerAnomalyAlerts(predictions.anomalies);
    }
    
    // Store suggestions in database
    if (predictions.suggestions && predictions.suggestions.length > 0) {
      await storeSuggestions(predictions.suggestions);
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Predictions processed successfully',
      predictions_count: predictions.length || 0
    });
  } catch (error) {
    console.error('Error processing ML predictions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Trigger anomaly alerts
 */
async function triggerAnomalyAlert(anomaly) {
  try {
    // Store anomaly in database
    await db.collection('anomalies').add({
      ...anomaly,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active',
      acknowledged: false
    });
    
    // Send notifications to admins
    const adminsSnapshot = await db.collection('users')
      .where('role', '==', 'admin')
      .get();
    
    const notifications = [];
    adminsSnapshot.forEach(doc => {
      notifications.push(sendNotification(doc.id, {
        type: 'anomaly',
        title: `Anomaly Detected: ${anomaly.building}`,
        message: `Unusual ${anomaly.metric_type} reading: ${anomaly.value}`,
        severity: anomaly.severity,
        data: anomaly
      }));
    });
    
    await Promise.all(notifications);
    
  } catch (error) {
    console.error('Error triggering anomaly alert:', error);
  }
}

/**
 * Store AI suggestions
 */
async function storeSuggestions(suggestions) {
  try {
    const batch = db.batch();
    
    suggestions.forEach(suggestion => {
      const docRef = db.collection('ai-suggestions').doc();
      batch.set(docRef, {
        ...suggestion,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        status: 'active',
        implemented: false
      });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error storing suggestions:', error);
  }
}

/**
 * HTTP Function for Web3 integration
 */
exports.mintRewardToken = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const { userId, achievementType, amount, metadata } = data;
  
  try {
    // Verify achievement exists and is unclaimed
    const achievementSnapshot = await db.collection('achievements')
      .where('userId', '==', userId)
      .where('type', '==', achievementType)
      .where('claimed', '==', false)
      .limit(1)
      .get();
    
    if (achievementSnapshot.empty) {
      throw new functions.https.HttpsError('not-found', 'Achievement not found or already claimed');
    }
    
    // Record the reward transaction
    await db.collection('rewards').add({
      userId,
      achievementType,
      amount,
      metadata: metadata || {},
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending_blockchain_confirmation',
      transaction_hash: null
    });
    
    // Mark achievement as claimed
    const achievementDoc = achievementSnapshot.docs[0];
    await achievementDoc.ref.update({
      claimed: true,
      claimed_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { 
      success: true, 
      message: 'Reward processing initiated',
      reward_id: achievementDoc.id 
    };
  } catch (error) {
    console.error('Error minting reward token:', error);
    throw new functions.https.HttpsError('internal', 'Error processing reward');
  }
});

/**
 * Scheduled function to generate daily reports
 */
exports.generateDailyReports = functions.pubsub.schedule('0 2 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const yesterday = moment().subtract(1, 'day');
      const startOfDay = yesterday.startOf('day').toDate();
      const endOfDay = yesterday.endOf('day').toDate();
      
      // Generate campus sustainability report
      const report = await generateSustainabilityReport(startOfDay, endOfDay);
      
      // Store report
      await db.collection('daily-reports').add({
        date: yesterday.format('YYYY-MM-DD'),
        report,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Update leaderboard
      await updateDailyLeaderboard(startOfDay, endOfDay);
      
      console.log(`Daily report generated for ${yesterday.format('YYYY-MM-DD')}`);
      return { success: true };
    } catch (error) {
      console.error('Error generating daily report:', error);
      throw new Error('Failed to generate daily report');
    }
  });

/**
 * Generate sustainability report
 */
async function generateSustainabilityReport(startDate, endDate) {
  try {
    // Get sensor data for the period
    const sensorDataSnapshot = await db.collection('sensor-data')
      .where('timestamp', '>=', startDate)
      .where('timestamp', '<=', endDate)
      .get();
    
    const sensorData = sensorDataSnapshot.docs.map(doc => doc.data());
    
    // Get user actions for the period
    const userActionsSnapshot = await db.collection('user-actions')
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();
    
    const userActions = userActionsSnapshot.docs.map(doc => doc.data());
    
    // Calculate metrics
    const electricityData = sensorData.filter(d => d.metric_type === 'electricity');
    const waterData = sensorData.filter(d => d.metric_type === 'water');
    const wasteData = sensorData.filter(d => d.metric_type === 'waste');
    
    return {
      date: moment(startDate).format('YYYY-MM-DD'),
      metrics: {
        total_energy_consumption: _.sumBy(electricityData, 'value'),
        total_water_consumption: _.sumBy(waterData, 'value'),
        total_waste_generated: _.sumBy(wasteData, 'value'),
        average_energy_per_building: _.meanBy(electricityData, 'value'),
        average_water_per_building: _.meanBy(waterData, 'value')
      },
      user_engagement: {
        active_users: _.uniqBy(userActions, 'userId').length,
        total_actions: userActions.length,
        total_carbon_saved: _.sumBy(userActions, 'carbon_saved'),
        most_popular_action: _.maxBy(_.countBy(userActions, 'action_type'), _.identity)
      },
      achievements: {
        total_awarded: userActions.filter(a => a.achievement_earned).length,
        total_tokens_distributed: _.sumBy(userActions, 'tokens_earned')
      },
      sustainability_score: calculateSustainabilityScore(sensorData, userActions)
    };
  } catch (error) {
    console.error('Error generating sustainability report:', error);
    throw error;
  }
}

/**
 * Calculate sustainability score
 */
function calculateSustainabilityScore(sensorData, userActions) {
  const energyEfficiency = 100 - (_.meanBy(sensorData.filter(d => d.metric_type === 'electricity'), 'value') / 1000 * 10);
  const waterEfficiency = 100 - (_.meanBy(sensorData.filter(d => d.metric_type === 'water'), 'value') / 2000 * 10);
  const userEngagement = Math.min(userActions.length * 2, 100);
  
  return Math.round((energyEfficiency + waterEfficiency + userEngagement) / 3);
}

/**
 * Update daily leaderboard
 */
async function updateDailyLeaderboard(startDate, endDate) {
  try {
    // Get user actions for the day
    const userActionsSnapshot = await db.collection('user-actions')
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();
    
    const userScores = {};
    
    userActionsSnapshot.docs.forEach(doc => {
      const action = doc.data();
      if (!userScores[action.userId]) {
        userScores[action.userId] = {
          userId: action.userId,
          total_carbon_saved: 0,
          total_actions: 0,
          total_tokens: 0
        };
      }
      
      userScores[action.userId].total_carbon_saved += action.carbon_saved || 0;
      userScores[action.userId].total_actions += 1;
      userScores[action.userId].total_tokens += action.tokens_earned || 0;
    });
    
    // Calculate scores
    Object.values(userScores).forEach(user => {
      user.score = (user.total_carbon_saved * 10) + (user.total_actions * 5) + user.total_tokens;
    });
    
    // Update leaderboard
    const batch = db.batch();
    Object.values(userScores).forEach(user => {
      const leaderboardRef = db.collection('leaderboard').doc(user.userId);
      batch.set(leaderboardRef, {
        ...user,
        date: moment(startDate).format('YYYY-MM-DD'),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
}

/**
 * Send notification to user
 */
async function sendNotification(userId, notification) {
  try {
    await db.collection('notifications').doc(userId).collection('items').add({
      ...notification,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });
    
    // Also store in Realtime Database for real-time updates
    await rtdb.ref(`notifications/${userId}`).push({
      ...notification,
      timestamp: admin.database.ServerValue.TIMESTAMP,
      read: false
    });
    
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

/**
 * HTTP Function to get user statistics
 */
exports.getUserStats = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const userId = context.auth.uid;
  
  try {
    // Get user achievements
    const achievementsSnapshot = await db.collection('achievements')
      .where('userId', '==', userId)
      .get();
    
    // Get user actions
    const actionsSnapshot = await db.collection('user-actions')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .limit(30)
      .get();
    
    const achievements = achievementsSnapshot.docs.map(doc => doc.data());
    const actions = actionsSnapshot.docs.map(doc => doc.data());
    
    return {
      total_achievements: achievements.length,
      total_tokens: _.sumBy(achievements, 'reward_tokens'),
      total_carbon_saved: _.sumBy(actions, 'carbon_saved'),
      total_actions: actions.length,
      recent_actions: actions.slice(0, 10),
      sustainability_score: calculateUserSustainabilityScore(actions),
      rank: await getUserRank(userId)
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw new functions.https.HttpsError('internal', 'Error getting user statistics');
  }
});

/**
 * Calculate user sustainability score
 */
function calculateUserSustainabilityScore(actions) {
  if (actions.length === 0) return 0;
  
  const totalCarbonSaved = _.sumBy(actions, 'carbon_saved');
  const consistencyScore = Math.min(actions.length * 5, 100);
  const impactScore = Math.min(totalCarbonSaved, 100);
  
  return Math.round((consistencyScore + impactScore) / 2);
}

/**
 * Get user rank
 */
async function getUserRank(userId) {
  try {
    const leaderboardSnapshot = await db.collection('leaderboard')
      .orderBy('score', 'desc')
      .get();
    
    let rank = 1;
    for (const doc of leaderboardSnapshot.docs) {
      if (doc.id === userId) {
        return rank;
      }
      rank++;
    }
    
    return rank;
  } catch (error) {
    console.error('Error getting user rank:', error);
    return null;
  }
}
