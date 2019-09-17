const env = process.env.NODE_ENV.trim();

module.exports = {
  environment: env,
  isProduction: env === "production"
};
