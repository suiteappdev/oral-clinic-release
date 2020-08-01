const {electron, ipcMain, app, BrowserWindow} = require('electron');
const {is} = require('electron-util');
const ipc = require('electron-better-ipc');
const delay = require('delay');
const isDev = require('electron-is-dev');
const path = require('path');
const loadRoute = require('./utils/routes');

let inicioView = null;

const openInicioWiew = async () => {

  if (inicioView) {

    inicioView.show();

    return inicioView;
  }

  inicioView = new BrowserWindow({
    backgroundColor: "white",
    useContentSize : true,
    resizable: true,
    maximizable: true,
    frame: true,
    minimizable: true,
    fullscreenable: true,
    transparent: false,
    center: true,
    movable: true,
    webPreferences:{
      nodeIntegration : true,
      webSecurity: false
    },
    icon: path.join(__dirname, '..', 'static', '/logos/icon.png'),
  });

  inicioView.setMenuBarVisibility(false)
  inicioView.maximize();
  loadRoute(inicioView, "inicio");
  
  inicioView.once("ready-to-show", ()=>{
    console.log("Ready");
    inicioView.show();
  })

  ipc.answerRenderer('login-close', async () => {
    inicioView.hide();
  });

  ipc.answerRenderer('login-close', async () => {
    inicioView.hide();
  });

  ipc.answerRenderer('login-minimize', async () => {
    inicioView.minimize();
  });

  inicioView.on('close', (event) => {
    inicioView = null;
  });
};

module.exports = {
    openInicioWiew
};
