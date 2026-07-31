@echo off
chcp 65001 >nul
title 苍穹外卖 - 后端服务
echo ============================================
echo         苍穹外卖 - 启动后端服务
echo ============================================
echo.
echo 确认事项：
echo [1] MySQL 已启动（localhost:3306，root / Liu2118392957）
echo [2] Redis 已启动（localhost:6379）
echo [3] 数据库 sky_take_out 已导入
echo.
echo 正在启动 Spring Boot 服务...
echo.
cd /d "%~dp0sky-take-out"
call mvn spring-boot:run -pl sky-server
echo.
pause
