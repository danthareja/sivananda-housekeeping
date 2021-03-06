if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local' });
}

const server = require('./server');
const port = process.env.PORT || 4000;

server.listen({ port }, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
