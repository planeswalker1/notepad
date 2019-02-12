const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const config = require('../config');

const Page = require('./page');

// schema for a user
let userSchema = new Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, trim: true, required: true, unique: true, sparse: true },
  pages: [{type: Schema.ObjectId, ref: 'Page'}],
  hash: { type: String, required: true },
  token: String
});

// create full name
// userSchema.virtual('name').get(function() {
//   var name = "";
//   if (this.firstName) {
//       name = this.firstName;
//       if (this.lastName) name += ' ' + this.lastName;
//   } else if (this.lastName) name = this.lastName;
//   return name;
// });

// methods for validating password
userSchema.methods.comparePassword = function(pw, callback) {
	bcrypt.compare(pw, this.hash, function(err, isMatch) {
		if (err) {
      return callback(err);
    }

		callback(null, isMatch);
	});
};

userSchema.pre('save', function(next) {
  // hash pw
  let user = this;

  // ismodifed
  if (!user.isModified('hash')) return next();


  bcrypt.genSalt(config.saltRounds, function(err, salt) {
    if (err) return console.log('error', err);
    bcrypt.hash(user.hash, salt, function(err, hash) {
        // Store hash in your password DB.
        user.hash = hash;

        return next();
    });
  });

});

let User = mongoose.model('User', userSchema);

module.exports = User;