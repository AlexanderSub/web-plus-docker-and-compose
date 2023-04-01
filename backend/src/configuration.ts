export default () => ({
  secretKey: process.env.JWT_SECRET || 'secret_key',
  expiresIn: process.env.JWT_EXPIRESIN,
});
