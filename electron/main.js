const { app, BrowserWindow } = require('electron')
const path = require('path')
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = !app.isPackaged
const nextApp = next({ dev, dir: path.join(__dirname, '..') })
const handle = nextApp.getRequestHandler()

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  })

  win.loadURL('http://localhost:3000')
}

app.whenReady().then(async () => {
  await nextApp.prepare()

  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(3000, () => {
    console.log('Next.js server running on port 3000')
    createWindow()
  })
})

app.on('window-all-closed', () => app.quit())