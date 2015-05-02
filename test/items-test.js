'use strict';

var Promise = require('bluebird');
var sinon = require('sinon');
var mockery = require('mockery');
var expect = require('chai').expect;
var BASE = require('../services/base-url');

describe('items', function () {
  var request;
  var items;

  before(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    request = sinon.stub();

    mockery.registerMock('request-promise', request);

    items = require('../services/items');
  });

  after(function () {
    mockery.disable();
  });

  it('parses internal URLs to retrieve item IDs', function () {
    request.returns(Promise.resolve(
      {
        url: BASE + '/items/17.json',
        title: 'Testing',
        description: 'Testing...',
        status: 'done'
      }
    ));
    return items.getById('17').then(function (item) {
      expect(item.id).to.equal('17');
    });
  });
});

