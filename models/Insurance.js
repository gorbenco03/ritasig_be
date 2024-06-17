const mongoose = require('mongoose');

const InsuranceSchema = new mongoose.Schema({
  Nume: { type: String, required: true },
  Prenume: { type: String, required: true },
  CNP: { type: Number, required: true },
  DataNasterii: { type: Date, required: true },
  PermisDeConducere: { type: String, required: true },
  Email: { type: String, required: true },
  NrDeTelefon: { type: String, required: true },
  Adresa: { type: String, required: true },
  CategorieBonus: { type: Number, required: true },
  MarcaMasinii: { type: String, required: true },
  Modelul: { type: String, required: true },
  CategoriaMasinii: { type: String, required: true },
  NumarulWIN: { type: String, required: true },
  AnProductie: { type: Number, required: true },
  CapacitateCilindrica: { type: Number, required: true },
  NrInmatriculare: { type: String, required: true },
  NrCertificatInmatriculare: { type: String, required: true },
  NormaDePoluare: { type: String, required: true },
  TipCombustibil: { type: String, required: true },
  PerioadaDeAsigurare: { type: String, required: true },
  TipAsigurare: { type: String, required: true },
  PretAsigurare: { type: Number, required: true },
  StatusAsigurare: { type: String, required: false },
  NumarSerie: { type: String, required: false },
  DataInceput: { type: Date, required: false },
  DataSfarsit: { type: Date, required: false }
});

module.exports = mongoose.model('Insurance', InsuranceSchema);
