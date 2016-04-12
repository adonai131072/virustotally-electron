'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var path = require('path');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {

  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({
    width: 200,
    height: 300,
    "transparent": true,
    "frame": false,
  });
  mainWindow.setAlwaysOnTop(true);
  mainWindow.loadUrl('file://' + __dirname + '/' + path.parse(__filename).name + '.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  var Menu = require('menu');
  var Tray = require('tray');
  var nativeImage = require('native-image');

  var trayIcon = new Tray(nativeImage.createFromPath(__dirname + "/imgs/favicon.ico"));
  var contextMenu = Menu.buildFromTemplate([
    { label: "終了", click: function () { mainWindow.close(); } },
  ]);
  trayIcon.setContextMenu(contextMenu);

  trayIcon.setToolTip(app.getName());
  trayIcon.on("clicked", function () {
    mainWindow.focus();
  });

});

