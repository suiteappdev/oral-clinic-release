const {electron, ipcMain, app, BrowserWindow} = require('electron');
const {is} = require('electron-util');
const ipc = require('electron-better-ipc');
const delay = require('delay');
const isDev = require('electron-is-dev');
const path = require('path');
const loadRoute = require('./utils/routes');

let homeView = null;

const openHomeWiew = async () => {

  if (homeView) {

    homeView.show();

    return homeView;
  }

  homeView = new BrowserWindow({
    backgroundColor: "white",
    resizable: true,
    maximizable: false,
    frame: true,
    minimizable: true,
    fullscreenable: true,
    transparent: false,
    center: true,
    show: false,
    movable: true,
    webPreferences:{
      nodeIntegration : true
    },
    icon: path.join(__dirname, '..', 'static', '/logos/icon.png'),
  });


  loadRoute(homeView, "home");
  
  homeView.once("ready-to-show", ()=>{
    homeView.show();
  })

  ipc.answerRenderer('login-close', async () => {
    homeView.hide();
  });

  ipc.answerRenderer('login-close', async () => {
    homeView.hide();
  });

  ipc.answerRenderer('login-minimize', async () => {
    homeView.minimize();
  });

  homeView.on('close', (event) => {
    homeView = null;
  });
};

module.exports = {
  openHomeWiew
};
