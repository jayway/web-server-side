/*eslint-disable no-unused-expressions */
'use strict';

var expect = require('chai').expect;
var status = require('../services/status');

describe('status', function () {
  it('has statuses', function () {
    expect(status.all).to.not.be.empty;
  });

  it('returns a status relative to another status', function () {
    var another = status.relativeTo(status.all[1], -1);
    expect(another).to.equal(status.all[0]);
  });

  it('returns null if the given delta is outside the statuses array', function () {
    var another = status.relativeTo(status.all[1], -2);
    expect(another).to.equal(null);
  });
});
