'use strict';

var express = require('express');
var router = express.Router();
var items = require('../services/items');
var status = require('../services/status');

function statusForm(item, delta) {
  var s = status.relativeTo(item.status, delta);
  if (!s) {
    return null;
  }
  return {
    status: s,
    method: 'POST',
    action: s ? '/items/' + s : null
  };
}

function toItemViewModel(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    status: item.status,
    back: item.status === 'done' ? statusForm(item, -3) : statusForm(item, -1),
    forward: statusForm(item, 1)
  };
}

router.get('/', function (req, res, next) {
  items.getAll().then(function (all) {
    var board = {
      backlog: all.backlog.map(toItemViewModel),
      working: all.working.map(toItemViewModel),
      verify: all.verify.map(toItemViewModel),
      done: all.done.map(toItemViewModel)
    };

    res.render('index', {
      title: 'Kanban Board',
      board: board
    });
  }, function (e) {
    console.error(e.message, e.stack);
    res.status(500);
    res.render('error', {
      title: 'Our deepest apologies!',
      description: 'The Kanban service is not available at the moment. Please ' +
        'try again a later time.'
    });
  });
});

router.post('/items/:status', function (req, res) {
  var target = req.params.status;

  if (!status.exists(target)) {
    res.status(400);
    res.render('error', {
      title: 'Bad Request',
      description: 'The status of the item cannot be set to "' + target + '"'
    });
  }

  var id = req.body.id;

  if (!id) {
    res.status(400);
    res.render('error', {
      title: 'Bad Request',
      description: 'The "id" is missing.'
    });
  }

  items.update(id, target).then(function () {
    res.redirect('/');
  }, function () {
    if (!id) {
      res.status(500);
      res.render('error', {
        title: 'Update Failed',
        description: 'Something failed when updating the item.'
      });
    }
  });
});

module.exports = router;
