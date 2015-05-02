'use strict';

var statuses = ['backlog', 'working', 'verify', 'done'];

function relativeTo(status, delta) {
  var i = statuses.indexOf(status);

  if (i < 0) {
    return null;
  }

  var i2 = i + delta;
  if (i2 < 0 || i2 >= statuses.length) {
    return null;
  }

  return statuses[i2];
}

function exists(s) {
  return statuses.indexOf(s) >= 0;
}

module.exports = {
  all: statuses,
  relativeTo: relativeTo,
  exists: exists
};
