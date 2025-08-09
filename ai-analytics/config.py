# Environment Configuration for EcoVerse
# This file provides environment variable handling with graceful fallbacks

import os

# Graceful dotenv import
try:
    from dotenv import load_dotenv
    load_dotenv()
    DOTENV_AVAILABLE = True
    print("✅ python-dotenv loaded successfully")
except ImportError:
    DOTENV_AVAILABLE = False
    print("ℹ️  python-dotenv not available, using system environment variables")

def get_env_var(key: str, default: str = None, required: bool = False) -> str:
    """
    Get environment variable with graceful handling
    
    Args:
        key: Environment variable name
        default: Default value if not found
        required: Whether the variable is required
        
    Returns:
        Environment variable value or default
        
    Raises:
        ValueError: If required variable is not found
    """
    value = os.getenv(key, default)
    
    if required and value is None:
        raise ValueError(f"Required environment variable '{key}' not found")
    
    return value

# Common environment variables with defaults
class Config:
    """Configuration class with environment variable defaults"""
    
    # AI/ML Configuration
    ML_MODEL_UPDATE_INTERVAL = int(get_env_var('ML_MODEL_UPDATE_INTERVAL', '50'))
    ANOMALY_DETECTION_THRESHOLD = float(get_env_var('ANOMALY_DETECTION_THRESHOLD', '0.1'))
    PREDICTION_CONFIDENCE_THRESHOLD = float(get_env_var('PREDICTION_CONFIDENCE_THRESHOLD', '0.8'))
    
    # API Configuration
    API_HOST = get_env_var('API_HOST', '0.0.0.0')
    API_PORT = int(get_env_var('API_PORT', '5000'))
    API_DEBUG = get_env_var('API_DEBUG', 'true').lower() == 'true'
    
    # Data Integration
    DATA_STREAM_INTERVAL = int(get_env_var('DATA_STREAM_INTERVAL', '30'))
    IOT_SIMULATION_URL = get_env_var('IOT_SIMULATION_URL', 'http://localhost:8000')
    ENABLE_REAL_TIME_STREAMING = get_env_var('ENABLE_REAL_TIME_STREAMING', 'true').lower() == 'true'
    
    # Database Configuration
    DATABASE_URL = get_env_var('DATABASE_URL', 'sqlite:///ecoversa.db')
    
    # Firebase Configuration
    FIREBASE_URL = get_env_var('FIREBASE_URL', 'https://ecoverse-default-rtdb.firebaseio.com')
    FIREBASE_API_KEY = get_env_var('FIREBASE_API_KEY', '')
    
    # Web3 Configuration
    WEB3_PROVIDER_URL = get_env_var('WEB3_PROVIDER_URL', 'http://localhost:8545')
    GREEN_TOKEN_ADDRESS = get_env_var('GREEN_TOKEN_ADDRESS', '')
    ECO_ACHIEVEMENTS_ADDRESS = get_env_var('ECO_ACHIEVEMENTS_ADDRESS', '')
    
    # Logging
    LOG_LEVEL = get_env_var('LOG_LEVEL', 'INFO')
    LOG_FILE = get_env_var('LOG_FILE', 'ecoversa.log')
    
    @classmethod
    def print_config(cls):
        """Print current configuration"""
        print("\n🔧 EcoVerse Configuration")
        print("=" * 30)
        print(f"API Host: {cls.API_HOST}:{cls.API_PORT}")
        print(f"Debug Mode: {cls.API_DEBUG}")
        print(f"Data Stream Interval: {cls.DATA_STREAM_INTERVAL}s")
        print(f"ML Model Update Interval: {cls.ML_MODEL_UPDATE_INTERVAL}")
        print(f"Log Level: {cls.LOG_LEVEL}")
        print(f"Firebase URL: {cls.FIREBASE_URL}")
        print(f"Database URL: {cls.DATABASE_URL}")
        print(f"Real-time Streaming: {cls.ENABLE_REAL_TIME_STREAMING}")
        print("=" * 30)

# Example usage and testing
if __name__ == "__main__":
    print("🧪 Testing EcoVerse Configuration")
    print(f"Dotenv Available: {DOTENV_AVAILABLE}")
    
    # Test configuration
    Config.print_config()
    
    # Test environment variable access
    test_var = get_env_var('CUSTOM_TEST_VAR', 'default_value')
    print(f"\nTest Variable: {test_var}")
    
    print("\n✅ Configuration system working correctly!")
