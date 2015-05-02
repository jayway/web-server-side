'use strict';

var request = require('request-promise');
var Promise = require('bluebird');

var status = require('./status');
var BASE = require('./base-url');
var ID_PATTERN = /\/items\/(\d+)\.json$/;

function getId(item) {
  if (item.id) {
    return item.id;
  }
  var m = new RegExp(ID_PATTERN).exec(item.url);
  return m ? m[1] : null;
}

function internalItemOrStatusUrl(id) {
  return BASE + '/items/' + id;
}

function toExternal(item) {
  return {
    id: getId(item),
    title: item.title,
    description: item.description,
    status: item.status
  };
}

module.exports = {
  getById: function (id) {
    if (status.exists(id)) {
      return Promise.reject(new Error('Invalid id: ' + id));
    }
    return request(internalItemOrStatusUrl(id), {
      json: true,
    }).then(toExternal);
  },
  getByStatus: function (s) {
    if (!status.exists(s)) {
      return Promise.reject(new Error('Invalid status: ' + s));
    }
    return request(internalItemOrStatusUrl(s), {
      json: true,
    }).then(function (items) {
      return (items || []).map(toExternal);
    });
  },
  getAll: function () {
    return Promise.all([
      this.getByStatus('backlog'),
      this.getByStatus('working'),
      this.getByStatus('verify'),
      this.getByStatus('done')
    ]).then(function (lists) {
      return {
        backlog: lists[0],
        working: lists[1],
        verify: lists[2],
        done: lists[3]
      };
    });
  },
  update: function (id, s) {
    return request(internalItemOrStatusUrl(s), {
      form: {
        id: id
      },
      method: 'POST'
    });
  }
};
