# Electron App For Microsoft Todo

## Table of Contents
* [How to start in dev](#how-to-start-in-dev)
* [How to build App for MacOS](#how-to-build-app-for-macos)
* [How to make a Electron app](#how-to-make-a-electron-app)
* [Atom-Shell Archive build](#atom-shell-archive-build)


## How to start in dev
### prerequisite
```
npm -g install electron-prebuilt   
```
```
git clone https://github.com/pramendra/todo.git
electron todo
```

## How to build App for MacOS
### prerequisite
```
npm i electron-packager -g   
```

```
// build for window and macOS
// electron-packager ./todo todo —platform=darwin,win32 —arch=x64 —version=1.6.8 —overwrite

// build for macOS
electron-packager ./todo todo —platform=darwin —arch=x64 —version=1.6.8 —overwrite
open todo-darwin-x64/todo
```
### release versions reference
```
https://github.com/electron/electron/releases
```

## How to make a Electron app
```
mkdir todo  
cd todo
npm init -y
// update package.json
// index.js to main.js
```

* [How to start in dev](#how-to-start-in-dev)
* [How to build App for MacOS](#how-to-build-app-for-macos)


## Atom Shell Archive build
```
npm install -g asar  
asar pack ./todo ./todo.asar  
asar todo.asar    
electron todo.asar   
```