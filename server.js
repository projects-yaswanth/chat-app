const app = require('./app');
const server = require('./socket');
const mongoose = require('mongoose');

const databaseAccess = process.env.DATABASE_LINK.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(databaseAccess)
  .then(() => {
    console.log('DB connected success');
  })
  .catch((err) => console.log(err.message));

server.listen(process.env.PORT, () => {
  console.log(`App is listening to the port : ${process.env.PORT}`);
});
