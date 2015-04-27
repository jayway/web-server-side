'use strict';

var express = require('express');
var router = express.Router();
var items = require('../services/items');

/* GET home page. */
router.get('/', function (req, res, next) {
  items.getAll().then(function (all) {
    res.render('index', {title: 'Kanban Board', items: all});
  }, next);
});

module.exports = router;
