var fs = require('fs');

exports.getSettings = function (filename, defaults) {
  var settings = fs.readFileSync(filename, 'utf8');
  if(settings === undefined) {
    return defaults;
  } else {alert(settings);
    return JSON.parse(settings);
  }
};

exports.setSettings = function (settings, filename) {
  fs.writeFile(filename, JSON.stringify(settings));
};

