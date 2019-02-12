module.exports = {
  port: 3000,
  dbUrl: 'mongodb://localhost:5000/note-pad',

  // secret for hashing tokens
  secret: 'ThisIsDefinitelyNotTheSecret',
  saltRounds: 10
};
