// Configuration file for Factory OS Backend
export const config = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development'
};
