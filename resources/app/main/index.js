'use strict';

process.on('uncaughtException', function (err) {
  console.log("GLOBAL ERROR", err);
});
const {app, Menu} = require('electron');
const prepareNext = require('electron-next');

//windows handlers
const {openInicioWiew} = require('./inicio');
const {openLoginWiew} = require('./login');
const {openHomeWiew} = require('./home');
const {openAgendaWiew} = require('./agenda');

app.on('ready', async () => {
  await prepareNext('./renderer');
  await openLoginWiew();
});

app.on('window-all-closed', event => {
  event.preventDefault();
  //removeTray();
  app.quit();
});


