'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Book Schema
let BookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    pages: { type: Number, required: true, min: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null }
  },
  {
    versionKey: false
  }
);

// Sets the createdAt parameter equal ot the current time
BookSchema.pre('save', next => {
  let now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Book', BookSchema);
