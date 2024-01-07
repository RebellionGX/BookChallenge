const express = require('express');
const session = require('express-session');
const mainRouter = require('./routes/main');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use('/',
  session({
    secret: 'cookie-agustin-ponce',
    resave: false,
    saveUninitialized: true
  }), mainRouter);

app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});