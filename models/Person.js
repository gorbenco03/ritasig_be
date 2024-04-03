// models/Person.js

const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
  Nume: String,
  Prenume: String,
  CNP: String,
  DataNasterii: Date,
  PermisDeConducere: String,
  Email: String,
  NrDeTelefon: String,
  CategorieBonus: Number,
});

module.exports = mongoose.model('Person', PersonSchema);
