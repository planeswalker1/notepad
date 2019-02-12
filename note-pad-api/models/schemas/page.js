const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema for every note in a user's notes
let pageSchema = new Schema({
  name: {type: String, default: 'New Page'},
  text: String
  },
  {
    toObject: {getters: true},
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate'
    }
  }
);

pageSchema.pre('save', function (callback) {
  callback();
});

let Page = mongoose.model('Page', pageSchema);

module.exports = Page;