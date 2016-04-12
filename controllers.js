'use strict';

var fs = require('fs');
var path = require('path');
var virustotal = require('./virustotal.js');
var settings = require('./settings.js');
var shell = require('shell');

var settingsFile = "./settings.json";

var ngModule = angular.module('virustotally', [
  'ngFileUpload'
]);

ngModule.controller('MainController', function ($scope) {
  var main = this;
  main.settings = settings.getSettings(settingsFile, { apikey: '', });
  virustotal.setApiKey(main.settings.apikey);alert(main.settings.apikey);
  main.files = [];
  main.fileDrop = function ($files) {
    if($files == undefined || 'length' in $files === false) {
      return;
    }
    for (var i = 0; i < $files.length; i++) {
      try{
        virustotal.scan($files[i].path, (function () {
          var filename = String($files[i].path);
          return function (data) {
            if(data.response_code != 1) {
              alert("Something wrong in virustotal:\n" + data.verbose_msg);
            }
            else {
              $scope.$apply(function () {
                main.files.push({
                  'name': filename,
                  'sha256': data.sha256,
                  'finished': false,
                  'result': "",
                  'result_url': "",
                });
              });
            }
          };
        })());
      } catch (e) {
        alert(e);
      }
    }
  };
  $scope.$watch('files', function () {
    main.fileDrop($scope.files);
  });

  main.report = function (sha256) {
    virustotal.report(sha256, function (data) {
      if(data.response_code != 1) {
        alert("Scan is not finished yet!!");
        console.log(data.verbose_msg);
      }
      else {
        var i = main.files.findIndex(function (elem, index, arr) { return elem.sha256 === sha256; });
        if(i != -1) {
          $scope.$apply(function () {
            main.files[i].finished = true;
            main.files[i].result = data.positives + " / " + data.total;
            main.files[i].result_url = data.permalink;
          });
        }
      }
    });
  };

  main.openVT = function (result_url) {
    shell.openExternal(result_url);
  };

}).filter('pathToName', function () {
  return function (input) {
    if (input) {
      return path.parse(input).base;
    }
    return input;
  };
});

