@echo off
chcp 65001 >nul
title 苍穹外卖 - 管理端前端
echo ============================================
echo        苍穹外卖 - 启动管理端前端
echo ============================================
echo.
echo 确认事项：
echo [1] 后端服务已启动（http://localhost:8080）
echo [2] 依赖已安装（node_modules 存在）
echo.
cd /d "%~dp0苍穹外卖前端源码\project-sky-admin-vue-ts"
set NODE_OPTIONS=--openssl-legacy-provider
echo 正在启动 Vue 开发服务器...
echo.
call yarn run serve
echo.
pause
