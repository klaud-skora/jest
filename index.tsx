const { app } = require('./app');

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Serwer is listening on port ${port}`);
}); 