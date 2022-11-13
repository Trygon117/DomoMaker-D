const models = require('../models');
const DomoModel = require('../models/Domo');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.obsession) {
    return res.status(400).json({ error: 'name, age, and obsession are all required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    obsession: req.body.obsession,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, obsession: newDomo.obsession });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ erro: 'Domo already exists!' });
    }
    return res.status(400).json({ error: 'An error has occured.' });
  }
};

const deleteDomo = async (req, res) => {
  try {
    await DomoModel.deleteOne({ _id: req.body._id });
    return res.status(200).json({ deletedDomo: req.body._id });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured!' });
  }
};

const getDomos = (req, res) => DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured!' });
  }

  return res.json({ domos: docs });
});

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
