'use strict';

var fs = require('fs');
var path = require('path');
var virustotal = require('./virustotal.js');
var shell = require('shell');

var ngModule = angular.module('virustotally', [
  'ngFileUpload'
]);

virustotal.setApiKey('0ec5d33f3ff9d1bce61dab3a5a67fce30623d3649c61cf7f2ebc7c51de3135f9');

ngModule.controller('MainController', function ($scope) {
  var main = this;
  main.text = "";
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

