'use strict';

var request = require('request-promise');

module.exports = {
  getAll: function () {
    return request('http://kanban-awd.herokuapp.com/items.json', {
      json: true
    });
  }
};
