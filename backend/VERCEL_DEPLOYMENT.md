# Vercel Deployment Guide for Factory OS Backend

## Required Environment Variables

You need to set these environment variables in your Vercel dashboard:

### 1. MongoDB Connection
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/factory-os?retryWrites=true&w=majority
```

### 2. Node Environment
```
NODE_ENV=production
```

### 3. Optional: Custom Port (usually not needed for Vercel)
```
PORT=3001
```

## Setting Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with its value
5. Make sure to set them for Production, Preview, and Development environments

## Important Notes

### Socket.io Limitations
- **Socket.io will NOT work on Vercel serverless functions**
- The current setup removes Socket.io from the Vercel deployment
- For real-time features, consider using:
  - Vercel's built-in WebSocket support
  - External services like Pusher, Ably, or Socket.io's cloud service
  - A separate server for real-time features

### Database Connection
- Make sure your MongoDB Atlas cluster allows connections from Vercel's IP ranges
- Add `0.0.0.0/0` to your MongoDB Atlas IP whitelist for development
- For production, use Vercel's specific IP ranges

### File Structure
```
backend/
├── api/
│   └── index.js          # Main Vercel serverless function
├── vercel.json           # Vercel configuration
├── package.json          # Updated with build scripts
└── ... (other files)
```

## Deployment Steps

1. **Push your changes to GitHub**
2. **Connect your repository to Vercel**
3. **Set the Root Directory to `backend`**
4. **Add environment variables in Vercel dashboard**
5. **Deploy**

## Testing Your Deployment

After deployment, test these endpoints:
- `https://your-app.vercel.app/api/health` - Should return status OK
- `https://your-app.vercel.app/api/machines` - Should return machines data
- `https://your-app.vercel.app/api/workers` - Should return workers data

## Troubleshooting

### Common Issues:
1. **Database connection errors**: Check MONGODB_URI and IP whitelist
2. **Module not found**: Ensure all dependencies are in package.json
3. **CORS errors**: Update CORS origins in api/index.js
4. **Function timeout**: Vercel has a 10-second timeout for hobby plans

### Debugging:
- Check Vercel function logs in the dashboard
- Use `console.log()` statements for debugging
- Test locally with `vercel dev` command
