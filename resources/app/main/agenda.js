const {electron, ipcMain, app, BrowserWindow} = require('electron');
const {is} = require('electron-util');
const ipc = require('electron-better-ipc');
const delay = require('delay');
const isDev = require('electron-is-dev');
const path = require('path');
const loadRoute = require('./utils/routes');

let agendaView = null;

const openAgendaWiew = async () => {

  if (agendaView) {

    agendaView.show();

    return agendaView;
  }

  agendaView = new BrowserWindow({
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


  loadRoute(agendaView, "agenda");
  
  agendaView.once("ready-to-show", ()=>{
    agendaView.show();
  })

  ipc.answerRenderer('login-close', async () => {
    agendaView.hide();
  });

  ipc.answerRenderer('login-close', async () => {
    agendaView.hide();
  });

  ipc.answerRenderer('login-minimize', async () => {
    agendaView.minimize();
  });

  agendaView.on('close', (event) => {
    agendaView = null;
  });
};

module.exports = {
    openAgendaWiew
};
