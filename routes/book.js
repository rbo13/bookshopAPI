'use strict';

let mongoose = require('mongoose');
let Book = require('../models/book');

/**
* GET /book route to retrieve all books.
*/
function getBooks(req, res) {
  let query = Book.find({});
  query.exec((err, books) => {

    if(err) {
      res.send(err)
        .status(500);
    }

    res.json(books);
  })
}

/*
* POST /book route to save a new book.
*/
function postBook(req, res){
  var newBook = new Book(req.body);
  // save
  newBook.save((err, book) => {
    if(err) {
      res.send(err)
      .status(500);
    } else {
      res.json({
        success: true,
        status: 200,
        message: "Book successfully added!",
        data: book
      });
    }
  });
}

/*
* GET /book/:id route to get book by ID
*/
function getBook(req, res) {
  Book.findById(req.params.id, (err, book) => {
    if(err){
      res.send(err)
      .status(500);
    }
    res.json(book);
  })
}

/*
* DELETE /book/:id route to delete book by id.
* This is hard deletion.
*/
function deleteBook(req, res) {
  Book.remove({ _id: req.params.id }, (err, result) => {
    if(err) {
      res.json({
        success: false,
        error: err
      }).status(500);
    }
    res.json({
      success: true,
      status: 204,
      data: result,
      message: "Book successfully removed!"
    }).status(204);
  });
}

/*
* PUT /book/:id route to update a single book.
*/
function updateBook(req, res) {
  Book.findById({_id: req.params.id}, (err, book) => {
        if(err) res.send(err);

        book.updatedAt = new Date(); // This field also updates the `updatedAt`
        
        Object.assign(book, req.body).save((err, book) => {
            if(err) res.send(err).status(500);

            res.json({
              success: true,
              status: 204,
              data: book,
              message: 'Book updated!'
            }).status(204);
        });
    });
}

module.exports = { getBooks, postBook, getBook, deleteBook, updateBook }
