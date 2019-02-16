module.exports = {
  port: 3000,
  dbUrl: 'mongodb://localhost:5000/note-pad',
  // secret for creating and decoding tokens
  secret: 'ThisIsDefinitelyNotTheSecret',
  // for bcrypt
  saltRounds: 10
};
