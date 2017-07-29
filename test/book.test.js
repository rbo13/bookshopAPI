//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Book = require('../models/book');

// Require the test frameworks
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Books', () => {
    beforeEach((done) => { //Before each test we empty the database
        Book.remove({}, (err) => {
           done();
        });
    });
/*
  * Test the /GET route
  */
  describe('/GET book', () => {
      it('should GET all the books', (done) => {
        chai.request(server)
            .get('/book')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  /*
  * Test the /POST route
  */
  describe('/POST book', () => {
      it('should not POST a book without pages field', (done) => {
          let book = {
            title: "The Lord of the Rings",
            author: "J.R.R Tolkien",
            year: 1954
          }

          chai.request(server)
            .post('/book')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors')
                res.body.errors.should.have.property('pages');
                res.body.errors.pages.should.have.property('kind').eql('required');
                done();
            });
      });

      it('should POST a book', (done) => {
        let book = {
          title: "The Lord of the Rings",
          author: "J.R.R Tolkien",
          year: 1954,
          pages: 1170
        }

        chai.request(server)
          .post('/book')
          .send(book)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Book successfully added!');
            done();
          });
      })
  });

  /*
  * TEST the /GET/:id route
  */
  describe('/GET/:id book', () => {
      it('should GET a book by the given id', (done) => {

          let newBook = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954,
            pages: 1170
          };

          let book = new Book(newBook);
          book.save((err, book) => {

              chai.request(server)
              .get('/book/'+book.id)
              .send(book)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('title');
                  res.body.should.have.property('author');
                  res.body.should.have.property('pages');
                  res.body.should.have.property('year');
                  res.body.should.have.property('_id').eql(book.id);
                  done();
              });

          });
      });
  });


  /**
   * Test the /PUT/:id route
   */
   describe('/PUT/:id book', () => {
      it('should UPDATE a book given the id', (done) => {

          let oldBook = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954,
            pages: 1170
          };

          let updatedBook = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1950,
            pages: 1170
          };

          let book = new Book(oldBook);
          book.save((err, book) => {
              chai.request(server)
                .put('/book/' + book.id)
                .send(updatedBook)
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property("message").eql("Book updated!");
                  done();
                })
          });
      });
   });

   /**
    * TEST the /DELETE/:id route
    */
   describe('/DELETE/:id book', () => {
     it('should DELETE a book given by the id', (done) => {

        let bookToDelete = {
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          year: 1950,
          pages: 1170
        };

        let book = new Book(bookToDelete);
        book.save((err, book) => {
            chai.request(server)
              .delete('/book/' + book.id)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql('Book successfully removed!');
                  res.body.should.have.property('ok').eql(1);
                  res.body.should.have.property('n').eql(1);
                  done();
              });
        });

     })
   });


});
