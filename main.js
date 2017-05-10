'use strict';

const electron      = require('electron');
const {Menu}        = require('electron')
const fs            = require('fs');
const constants     = JSON.parse(fs.readFileSync(`${__dirname}/constants.json`, 'utf8'))
const template = [
  {
    label: "Application",
    submenu: [
      { label: "About Application", selector: "Todo App" },
      { type: "separator" },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: function() {
          app.quit();
        }
      }
    ]
  },
  {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        selector: "selectAll:"
      }
    ]
  }
];

const day = 86400000;
const app = electron.app;
const settings = {
  center: true,
  width: 960,
  height: 750,
  fullscreen: false,
  resizable: true,
  icon: `${__dirname}/icons/icon.png`
};

const css = `
  ::-webkit-scrollbar {
      height: 8px;
      width: 8px;
      background: #000;
  }

  ::-webkit-scrollbar-thumb {
      background: #805bc1;
      -webkit-box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.75);
  }

  ::-webkit-scrollbar-corner {
      background: #000;
  }
`;

let mainWindow = null;
let first = true;

function writeCacheFile() {
  try {
    const cache =  JSON.stringify({ time: Date.now() });
    fs.writeFileSync(`${__dirname}/cache.json`, cache, 'utf8');
  } catch (e) {
    // ignore
  }
}

function readCacheFile(headers) {
  try {
    if(fs.existsSync('./cache.json')) {
      const cache = JSON.parse(fs.readFileSync(`${__dirname}/cache.json`, 'utf8'));

      if(Date.now() - cache.time > day) {
        headers = {"extraHeaders" : "pragma: no-cache\n"};
        writeCacheFile();
      }
    } else {
      headers = {"extraHeaders" : "pragma: no-cache\n"};
      writeCacheFile();
    }
  } catch(e) {
    // ignore
  }
}

function createWindow() {
  let firstLoad = true;
  let headers = {};

  readCacheFile(headers);

  mainWindow = new electron.BrowserWindow(settings);
  mainWindow.webContents.clearHistory();
  mainWindow.loadURL(constants.URL, headers);
  mainWindow.setMenu(null);
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    if(firstLoad) {
      mainWindow.webContents.insertCSS(css);
      firstLoad = false;
    }
  });
}

app.on('ready', createWindow)
app.on('browser-window-created', (e, window) => {
     window.setResizable(!first);
     window.setMenu(null);
     first = false;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
