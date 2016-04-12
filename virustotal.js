var api__ = 'https://www.virustotal.com/vtapi/v2';
var apikey__ = '';

var rest = require('restler');

exports.setApiKey = function (apikey) {
  apikey__ = String(apikey);
}

exports.scan = function (filename, callback) {
  rest.post(api__ + '/file/scan', {
    multipart: true,
    data: {
      'apikey': apikey__,
      'file': rest.file(filename),
    }
  }).on('complete', callback);
}

exports.report = function (key, callback) {
  rest.post(api__ + '/file/report', {
    data: {
      'apikey': apikey__,
      'resource': key,
    }
  }).on('complete', callback);
}

