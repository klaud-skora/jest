const { app } = require('./app');
const { connect } = require('./client');

const port = process.env.PORT || 80;

connect();

app.listen(port, () => {
  console.log(`Serwer is listening on port ${port}`);
}); 