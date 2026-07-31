@echo off
chcp 65001 >nul
title 苍穹外卖 - Redis
echo ============================================
echo           苍穹外卖 - 启动 Redis
echo ============================================
echo.
cd /d "%~dp0Redis\Redis-x64-3.0.504"
echo 正在启动 Redis...
start "Redis" redis-server.exe redis.windows.conf
echo.
echo Redis 已在后台窗口启动（端口 6379）
echo.
pause
