if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = require('./app');

app.listen({ port: process.env.PORT || 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000`)
  console.log(`🚀 Prisma ready at ${process.env.PRISMA_ENDPOINT}`);
});
