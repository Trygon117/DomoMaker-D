const mongoose = require('mongoose');
const _ = require('underscore');

let DomoModel = {};

const setName = (name) => _.escape(name).trim();

const setObsession = (obsession) => _.escape(obsession).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    require: true,
  },
  obsession: {
    type: String,
    required: true,
    trim: true,
    set: setObsession,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  obsession: doc.obsession,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    // convert the string ownerId to an objectId
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return DomoModel.find(search).select('name age obsession').lean().exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports = DomoModel;
