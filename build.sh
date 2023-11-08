#!/bin/bash
version=$(cat package.json| jq ".version" | tr -d '"')
yarn vite-build
yarn electron-builder --win --x64
mv "./dist/Electron Tracker Setup ${version}.exe" "./dist/Electron Tracker Setup ${version} x86_64.exe"
mv "./dist/Electron Tracker-${version}-win.zip" "./dist/Electron Tracker-${version}-x86_64-win.zip"
yarn electron-builder --win --arm64
mv "./dist/Electron Tracker Setup ${version}.exe" "./dist/Electron Tracker Setup ${version} arm64.exe"
yarn electron-builder --linux --x64 --arm64 --armv7l
yarn electron-builder --mac --arm64 --universal
