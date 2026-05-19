@echo off
setlocal enabledelayedexpansion

title DriveFlow Initializer

echo ============================================
echo              DRIVEFLOW
echo ============================================
echo.

:: ============================================
:: VALIDACAO WINDOWS
:: ============================================

if not "%OS%"=="Windows_NT" (
    echo [ERRO] Este script deve ser executado no Windows CMD.
    pause
    exit /b 1
)

:: ============================================
:: VALIDACOES
:: ============================================

where docker >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Docker nao encontrado.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node/NPM nao encontrado.
    pause
    exit /b 1
)

where java >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Java nao encontrado.
    pause
    exit /b 1
)

:: ============================================
:: FRONTEND
:: ============================================

echo.
echo ============================================
echo FRONTEND
echo ============================================
echo.

if not exist frontend (
    echo [ERRO] Pasta frontend nao encontrada.
    pause
    exit /b 1
)

cd frontend

if not exist node_modules (

    echo [INFO] Instalando dependencias Angular...

    call npm install

    if errorlevel 1 (
        echo [ERRO] npm install falhou.
        pause
        exit /b 1
    )

    echo [OK] Dependencias Angular instaladas.

) else (
    echo [INFO] node_modules ja existe.
)

cd ..

:: ============================================
:: DOCKER
:: ============================================

echo.
echo ============================================
echo DOCKER
echo ============================================
echo.

set CONTAINER_NAME=driveflow-db

docker ps -a --format "{{.Names}}" | findstr /I "^%CONTAINER_NAME%$" >nul

if errorlevel 1 (

    echo [INFO] Container nao encontrado.
    echo [INFO] Criando ambiente Docker...

    docker compose up -d --build

    if errorlevel 1 (
        echo [ERRO] Docker compose falhou.
        pause
        exit /b 1
    )

    echo [OK] Ambiente Docker criado.

) else (

    echo [INFO] Container encontrado.

    docker ps --format "{{.Names}}" | findstr /I "^%CONTAINER_NAME%$" >nul

    if errorlevel 1 (

        echo [INFO] Container parado.
        echo [INFO] Iniciando container...

        docker start %CONTAINER_NAME%

        if errorlevel 1 (
            echo [ERRO] Falha ao iniciar container.
            pause
            exit /b 1
        )

        echo [OK] Container iniciado.

    ) else (
        echo [INFO] Container ja esta rodando.
    )
)

:: ============================================
:: INICIANDO SERVICOS
:: ============================================

echo.
echo ============================================
echo INICIANDO SERVICOS
echo ============================================
echo.

start "Frontend - Angular" cmd /k "cd frontend && npm start"

if exist "backend\mvnw.cmd" (

    start "Backend - Spring Boot" cmd /k "cd backend && mvnw.cmd spring-boot:run -Dspring-boot.run.arguments=--server.port=8081"

) else (

    echo [AVISO] Maven Wrapper nao encontrado.
    echo [AVISO] Tentando usar Maven global...

    start "Backend - Spring Boot" cmd /k "cd backend && mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081"
)

echo.
echo ============================================
echo AMBIENTE PRONTO
echo ============================================
echo.
echo Frontend:
echo http://localhost:4200
echo.
echo Backend:
echo http://localhost:8081
echo.

echo Pressione qualquer tecla para encerrar os servicos...
pause >nul

:: ============================================
:: ENCERRAMENTO GRACIOSO
:: ============================================

echo.
echo [INFO] Encerrando servicos...

taskkill /FI "WINDOWTITLE eq Frontend - Angular" /T >nul 2>&1
taskkill /FI "WINDOWTITLE eq Backend - Spring Boot" /T >nul 2>&1

echo.
echo [INFO] Containers Docker permanecem ativos.

timeout /t 2 >nul

endlocal