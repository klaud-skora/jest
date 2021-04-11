exports.respondWithError = (res, error) => {
res.status(400);
res.json({ error });
}
  
exports.respondNotFound = (res) => {
res.status(404);
res.send('Not found');
}