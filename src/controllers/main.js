var sequelize = require('sequelize');
const op = sequelize.Op;
const bcryptjs = require('bcryptjs');
const db = require('../database/models');

const mainController = {
  home: (req, res) => {
    if(req.session.User != null)  {
      db.Book.findAll({
        include: [{ association: 'authors' }]
      })
      .then((books) => {
        res.render('home', { books, user: req.session.User });
      })
      .catch((error) => console.log(error));
    }
    else{
      res.render('login', { user: null });
    }

  },
  bookDetail: (req, res) => {
    if(req.session.User != null)  {
      db.Book.findByPk(req.params.id, {
        include: [{ association: 'authors' }]
      })
      .then((book) => {
        res.render('bookDetail', { book, user: req.session.User });
      })
      .catch((error) => console.log(error));
    }
    else{
      res.render('login', { user: null });
    }
  },
  bookSearch: (req, res) => {
    if(req.session.User != null)  {
      res.render('search', { books: [], user: req.session.User });
    }
    else{
      res.render('login', { user: null });
    }
  },
  bookSearchResult: (req, res) => {
    if(req.session.User != null)  {
      db.Book.findAll({ where: { title: { [op.like]: '%'+req.body.title+'%' }} })
      .then((books) => {
        res.render('search', { books, user: req.session.User });
      })
      .catch((error) => console.log(error));    }
    else{
      res.render('login', { user: null });
    }
  },
  deleteBook: (req, res) => {
    if(req.session.User != null)  {
      db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', {raw: true})
      db.Book.destroy({ where: { id: req.params.id } })
      .then(() => {
        db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', {raw: true})
        res.redirect('/' );
      })
      .catch((error) => console.log(error));  
    }
    else{
      res.render('login', { user: null });
    }
  },
  authors: (req, res) => {
    if(req.session.User != null)  {
      db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors, user: req.session.User});
      })
      .catch((error) => console.log(error));
    }
    else{
      res.render('login', { user: null });
    }
  },
  authorBooks: (req, res) => {
    if(req.session.User != null)  {
      db.Author.findByPk(req.params.id, {
        include: [{ association: 'books' }]
      })
        .then((author) => {
          res.render('authorBooks', { author, user: req.session.User });
        })
        .catch((error) => console.log(error));
    }
    else{
      res.render('login', { user: null });
    }
  },
  register: (req, res) => {
    res.render('register', { user: req.session.User});
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    req.session.User = null;
    res.render('login', { user : req.session.User });
  },
  processLogin: (req, res) => {
    db.User.findOne({ where: { Email: req.body.email }, include: [{ association: 'category' }] } )
    .then((user) => {
      req.session.User = user;
      if (user != null && bcryptjs.compareSync(req.body.password, user.Pass)) {
        res.redirect('/');
      }else{
        res.send('Usuario o contraseña incorrectos.')
        res.render('login', { user : null});
      }
    })
    .catch((error) => console.log(error)); 
  },
  edit: (req, res) => {
    if(req.session.User != null)  {
      db.Book.findByPk(req.params.id)
      .then((book) => {
        res.render('editBook', { book, user : req.session.User })
      })
      .catch((error) => console.log(error));
    }
    else{
      res.render('login', { user: null });
    }
  },
  processEdit: (req, res) => {
    if(req.session.User != null)  {
      db.Book.update(
        {
          title: req.body.title,
          cover: req.body.cover,
          description: req.body.description
        },
        { where: { id: req.params.id } })
        .then(() => {
          res.redirect('/books/detail/' + req.params.id );
        })
        .catch((error) => console.log(error));
    }
    else{
      res.render('login', { user: null });
    }
  }
};

module.exports = mainController;
