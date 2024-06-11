const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const fs = require('fs');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const indexRouter = require('./routes/index');
const Insurance = require('./models/Insurance');
const usersRouter = require('./routes/users');
const connectDB = require('./db');
connectDB();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/api/test', (req, res) => {
  res.status(200).send({ message: 'Serverul funcționează corect!' });
});

app.post('/api/insurance', async (req, res) => {
  try {
    const newInsurance = new Insurance(req.body);
    const savedInsurance = await newInsurance.save();
    res.status(201).json(savedInsurance);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.patch('/api/insurances/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const insurance = await Insurance.findById(id);

    if (!insurance) {
      return res.status(404).send('Asigurarea nu a fost găsită.');
    }

    if (status === 'Acceptat') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      let endDate = new Date(tomorrow);
      if (insurance.PerioadaDeAsigurare === '1 an') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else if (insurance.PerioadaDeAsigurare === '6 luni') {
        endDate.setMonth(endDate.getMonth() + 6);
      } else if (insurance.PerioadaDeAsigurare === '3 luni') {
        endDate.setMonth(endDate.getMonth() + 3);
      }

      insurance.DataInceput = tomorrow;
      insurance.DataSfarsit = endDate;
      let prefix;
      switch (insurance.TipAsigurare) {
        case 'RCA':
          prefix = 'RCA-';
          break;
        case 'CASCO':
          prefix = 'CAS-';
          break;
        case 'CARTE VERDE':
          prefix = 'CARV-';
          break;
        default:
          prefix = '';
      }
      insurance.NumarSerie = prefix + uuidv4();
    }

    insurance.StatusAsigurare = status;
    await insurance.save();

    if (status === 'Acceptat') {
      let templatePath = path.join(__dirname, 'template.html');
      if (insurance.TipAsigurare === 'CARTE VERDE') {
        templatePath = path.join(__dirname, 'templateCV.html');
      }
      const template = fs.readFileSync(templatePath, 'utf8');

      const replacements = {
        '{Nume}': insurance.Nume,
        '{Prenume}': insurance.Prenume,
        '{CNP}': insurance.CNP,
        '{DataNasterii}': insurance.DataNasterii,
        '{PermisDeConducere}': insurance.PermisDeConducere,
        '{Email}': insurance.Email,
        '{NrDeTelefon}': insurance.NrDeTelefon,
        '{CategorieBonus}': insurance.CategorieBonus,
        '{CategoriaMasinii}': insurance.CategoriaMasinii,
        '{NumarulWIN}': insurance.NumarulWIN,
        '{AnFabricatie}': insurance.AnProductie,
        '{CapacitateCilindrica}': insurance.CapacitateCilindrica,
        '{NrInmatriculare}': insurance.NrInmatriculare,
        '{NrCertificatInmatriculare}': insurance.NrCertificatInmatriculare,
        '{NormaDePoluare}': insurance.NormaDePoluare,
        '{TipCombustibil}': insurance.TipCombustibil,
        '{PerioadaDeAsigurare}': insurance.PerioadaDeAsigurare,
        '{TipAsigurare}': insurance.TipAsigurare,
        '{PretAsigurare}': insurance.PretAsigurare,
        '{Adresa}': insurance.Adresa,
        '{Seria}': insurance.NumarSerie,
        '{DataInceput}': insurance.DataInceput,
        '{DataSfarsit}': insurance.DataSfarsit,
        '{MarcaMasinii}': insurance.MarcaMasinii,
        '{Modelul}': insurance.Modelul,
      };

      let htmlContent = template;
      for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(key, 'g');
        htmlContent = htmlContent.replace(regex, value);
      }

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(htmlContent);
      const pdfPath = path.join(__dirname, 'public', `Detalii-Asigurare-${insurance._id}.pdf`);
      await page.pdf({ path: pdfPath, format: 'A4' });

      await browser.close();

      console.log('PDF created successfully.');
    }

    res.send(insurance);
  } catch (error) {
    res.status(500).send('Eroare la server: ' + error.message);
  }
});
app.post('/api/insurances/:id/generate-invoice', async (req, res) => {
  try {
    const { id } = req.params;
    const insurance = await Insurance.findById(id);
    if (!insurance) {
      return res.status(404).send('Asigurarea nu a fost găsită.');
    }

    const template = fs.readFileSync(path.join(__dirname, 'templateFactura.html'), 'utf8');

    const replacements = {
      '{Nume}': insurance.Nume,
      '{Prenume}': insurance.Prenume,
      '{CNP}': insurance.CNP,
      '{DataNasterii}': insurance.DataNasterii,
      '{PermisDeConducere}': insurance.PermisDeConducere,
      '{Email}': insurance.Email,
      '{NrDeTelefon}': insurance.NrDeTelefon,
      '{CategorieBonus}': insurance.CategorieBonus,
      '{CategoriaMasinii}': insurance.CategoriaMasinii,
      '{NumarulWIN}': insurance.NumarulWIN,
      '{AnFabricatie}': insurance.AnProductie,
      '{CapacitateCilindrica}': insurance.CapacitateCilindrica,
      '{NrInmatriculare}': insurance.NrInmatriculare,
      '{NrCertificatInmatriculare}': insurance.NrCertificatInmatriculare,
      '{NormaDePoluare}': insurance.NormaDePoluare,
      '{TipCombustibil}': insurance.TipCombustibil,
      '{PerioadaDeAsigurare}': insurance.PerioadaDeAsigurare,
      '{TipAsigurare}': insurance.TipAsigurare,
      '{PretAsigurare}': insurance.PretAsigurare,
      '{Adresa}': insurance.Adresa,
      '{Seria}': insurance.NumarSerie,
      '{DataInceput}': insurance.DataInceput,
      '{DataSfarsit}': insurance.DataSfarsit,
      '{MarcaMasinii}': insurance.MarcaMasinii,
      '{Modelul}': insurance.Modelul,
    };

    let htmlContent = template;
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(key, 'g');
      htmlContent = htmlContent.replace(regex, value);
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfPath = path.join(__dirname, 'public', `Factura-${insurance._id}.pdf`);
    await page.pdf({ path: pdfPath, format: 'A4' });

    await browser.close();

    res.json({ pdfUrl: `/public/Factura-${insurance._id}.pdf` });
  } catch (error) {
    res.status(500).send('Eroare la server: ' + error.message);
  }
});

app.get('/api/insurances/:id/download-pdf', (req, res) => {
  const { id } = req.params;
  const pdfPath = path.join(__dirname, 'public', `Detalii-Asigurare-${id}.pdf`);

  if (fs.existsSync(pdfPath)) {
    res.download(pdfPath, `Detalii-Asigurare-${id}.pdf`, (err) => {
      if (err) {
        console.error('Error downloading PDF:', err);
        res.status(500).send('Error downloading PDF');
      }
    });
  } else {
    res.status(404).send('PDF not found');
  }
});

app.get('/api/insurances', async (req, res) => {
  try {
    const insurances = await Insurance.find({});
    res.status(200).json(insurances);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.use(function(req, res, next) {
  res.status(404).send('Not Found');
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
