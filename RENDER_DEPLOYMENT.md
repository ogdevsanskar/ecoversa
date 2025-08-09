# Ecoversa - Render Deployment Guide

This guide explains how to deploy the Ecoversa web application to Render.

## Prerequisites

1. A GitHub repository with your code (✅ Done: https://github.com/ogdevsanskar/ecoversa.git)
2. A Render account (https://render.com)

## Deployment Steps

### 1. Connect GitHub Repository

1. Go to https://render.com and sign up/log in
2. Click "New +" and select "Static Site"
3. Connect your GitHub account if not already connected
4. Select the repository: `ogdevsanskar/ecoversa`
5. Give your service a name: `ecoversa-web-app`

### 2. Configure Build Settings

**Build Command:** `./build.sh`
**Publish Directory:** `web-app/dist`

### 3. Environment Variables (if needed)

If you have any environment variables (like Firebase config), add them in the Render dashboard:
- Go to your service settings
- Navigate to "Environment"
- Add your variables

### 4. Deploy

Click "Create Static Site" and Render will:
1. Clone your repository
2. Run the build script
3. Deploy your application

## Project Structure

```
ecoversa/
├── web-app/              # React + Vite frontend
│   ├── src/             # Source code
│   ├── dist/            # Build output (generated)
│   ├── package.json     # Dependencies
│   └── vite.config.ts   # Vite configuration
├── web3-contracts/      # Smart contracts
├── build.sh            # Build script for Render
├── render.yaml         # Render configuration
└── README.md
```

## Automatic Deployments

Once set up, Render will automatically deploy your app whenever you push changes to the main branch.

## Custom Domain (Optional)

You can add a custom domain in the Render dashboard under "Settings" > "Custom Domains".

## Troubleshooting

1. **Build fails**: Check the build logs in Render dashboard
2. **404 errors**: Ensure the `staticPublishPath` points to `web-app/dist`
3. **Routing issues**: The `render.yaml` includes rewrite rules for SPA routing

## Live URL

After deployment, your app will be available at:
`https://ecoversa-web-app.onrender.com` (or your custom domain)