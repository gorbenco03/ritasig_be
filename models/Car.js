// models/Car.js

const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  CategoriaMasinii: String,
  NumarulWIN: String,
  AnProductie: Number,
  CapacitateCilindrica: Number,
  NrInmatriculare: String,
  NrCertificatInmatriculare: String,
  NormaDePoluare: String,
  TipCombustibil: String,
  CategorieBonus: Number,
  PerioadaDeAsigurare: String,
});

module.exports = mongoose.model('Car', CarSchema);
