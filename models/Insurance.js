// models/Insurance.js

const mongoose = require('mongoose');

const InsuranceSchema = new mongoose.Schema({
  Nume: String,
  Prenume: String,
  CNP: Number,
  DataNasterii: Date,
  PermisDeConducere: String,
  Email: String,
  NrDeTelefon: String,
  CategorieBonus: Number,
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
  TipAsigurare: String,
  PretAsigurare: Number, 
});

module.exports = mongoose.model('Insurance', InsuranceSchema);
