try {
  const { prisma } = require('./generated/client');
  module.exports = prisma;
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    console.log(
      'Please generate the prisma client with `npx run prisma generate`'
    );
    process.exit(1);
  }
  throw e;
}
