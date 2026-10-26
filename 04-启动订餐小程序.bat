@echo off
chcp 65001 >nul
title 悦享订餐 - 订餐小程序
echo ============================================
echo        悦享订餐 - 启动订餐小程序
echo ============================================
echo.
cd /d "%~dp0订餐小程序"
if not exist node_modules (
  echo 正在安装依赖...
  call npm install
)
echo 启动后在浏览器打开 http://localhost:5173
echo.
call npm run dev
echo.
pause
