var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Conexiunea la baza de date
const connectDB = require('./db');
connectDB();

var app = express();

// Setări pentru view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware-uri standard
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // Permite cereri cross-origin

// Rute principale
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Importarea modelelor
// const Person = require('./models/Person');
// const Car = require('./models/Car');
const Insurance = require('./models/Insurance')
// Ruta pentru testarea funcționării serverului
app.get('/api/test', (req, res) => {
  res.status(200).send({ message: 'Serverul funcționează corect!' });
});

// Endpoint pentru adăugarea unei persoane
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

// Endpoint pentru adăugarea unei mașini
// app.post('/api/car', async (req, res) => {
//   try {
//     const newCar = new Car(req.body);
//     const savedCar = await newCar.save();
//     res.status(201).json(savedCar);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send(err.message);
//   }
// });

// Middleware pentru gestionarea erorilor 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Handler de erori
app.use(function(err, req, res, next) {
  // Setează locale și oferă eroare în development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Răspunde cu pagina de eroare
  res.status(err.status || 500);
  res.render('error');
});

// Pornirea serverului
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
