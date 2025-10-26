import prompt from 'custom-electron-prompt';
import { Menu, app, globalShortcut, screen } from 'electron';
import serve from 'electron-serve';
import Store from 'electron-store';
import { createWindow } from './helpers';

const store = new Store()


const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = createWindow('main', {
    width: width,
    height: height,
  });
  mainWindow.setFullScreen(true);
  mainWindow.setMenuBarVisibility(false);
  globalShortcut.register('CommandOrControl+k', () => {
    const isMenuBarVisible = mainWindow.isMenuBarVisible();
    mainWindow.setMenuBarVisibility(!isMenuBarVisible);
    // console.log(isMenuBarVisible)
  });

  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Quit",
          accelerator: "CmdOrCtrl+Q",
          click: () => {
            app.quit();
          }
        },
      ]
    },
    {
      label: "View",
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        {
          label: "Toggle Full Screen",
          accelerator: (() => {
            if (process.platform === "darwin") {
              return "Ctrl+Command+F";
            } else {
              return "F11";
            }
          })(),
          click: (item, focusedWindow) => {
            if (focusedWindow) focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
      ]
    },
    {
      label: "Window",
      submenu: [
        {
          label: "Minimize",
          accelerator: "CmdOrCtrl+M",
          role: "minimize"
        },]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Learn More",
          click: () => { require("electron").shell.openExternal("https://www.igniteae.com/"); }
        },
        { type: "separator" },
        {
          label: `V ${app.getVersion()}`,
        },
      ]
    }
  ];

  if (process.platform === "darwin") {
    const name = app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          label: `About ${name}`,
          role: "about"
        },
        {
          type: "separator"
        },
        {
          label: `Hide ${name}`,
          accelerator: "Command+H",
          role: "hide"
        },
        {
          label: "Hide Others",
          accelerator: "Command+Alt+H",
          role: "hideothers"
        },
        {
          label: "Show All",
          role: "unhide"
        },
        {
          type: "separator"
        },
        {
          label: `Quit ${name}`,
          accelerator: "Command+Q",
          click: () => { app.quit(); }
        }
      ]
    });
    // Window menu.
    template[3].submenu.push(
      {
        type: "separator"
      },
      {
        label: "Bring All to Front",
        role: "front"
      }
    );
  }


  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
    mainWindow.setAutoHideMenuBar(true)
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.setAutoHideMenuBar(true)
    mainWindow.webContents.openDevTools();
  }
})();

function showInputDialog() {
  prompt({
    title: 'Server Address',
    label: 'Type your main server IP Address:',
    value: '192.168.xx.xx',
    inputAttrs: {
      type: 'text'
    },
    type: 'input'
  })
    .then((r) => {
      if (r === null) {
        console.log('user cancelled');
      } else {
        store.set("base_url", r);
        app.relaunch();
        app.exit()
      }
    })
    .catch(console.error);
}

app.on('browser-window-focus', function () {
  globalShortcut.register("CommandOrControl+R", () => {
    console.log("CommandOrControl+R is pressed: Shortcut Disabled");
  });
  globalShortcut.register("F5", () => {
    console.log("F5 is pressed: Shortcut Disabled");
  });
  
  globalShortcut.register("CommandOrControl+Shift+R", () => { console.log("CommandOrControl+Shift+R is pressed: Shortcut Disabled"); });


  globalShortcut.register('CommandOrControl+Shift+U', () => {
    showInputDialog();
  });
});