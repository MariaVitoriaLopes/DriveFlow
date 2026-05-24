@echo off
setlocal

title DriveFlow Initializer

:: =========================================================
:: ROOT DO PROJETO
:: =========================================================

set ROOT_DIR=%~dp0

if "%ROOT_DIR:~-1%"=="\" (
    set ROOT_DIR=%ROOT_DIR:~0,-1%
)

:: =========================================================
:: CONFIGURACOES
:: =========================================================

set FRONTEND_DIR=%ROOT_DIR%\frontend
set BACKEND_DIR=%ROOT_DIR%\backend

set FRONTEND_TITLE=DriveFlow Frontend
set BACKEND_TITLE=DriveFlow Backend

set MONGO_CONTAINER=mongodb_driveflow
set MONGO_URI=mongodb://localhost:27017/driveflow_db

:: =========================================================
:: HEADER
:: =========================================================

cls

echo ============================================
echo                DRIVEFLOW
echo ============================================
echo.

echo Root:
echo %ROOT_DIR%
echo.

:: =========================================================
:: VALIDACOES
:: =========================================================

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

:: =========================================================
:: VALIDAR PASTAS
:: =========================================================

if not exist "%FRONTEND_DIR%" (
    echo [ERRO] Pasta frontend nao encontrada.
    pause
    exit /b 1
)

if not exist "%BACKEND_DIR%" (
    echo [ERRO] Pasta backend nao encontrada.
    pause
    exit /b 1
)

:: =========================================================
:: FRONTEND - DEPENDENCIAS
:: =========================================================

echo.
echo ============================================
echo FRONTEND
echo ============================================
echo.

cd /d "%FRONTEND_DIR%"

if not exist "node_modules" (

    echo [INFO] Instalando dependencias...

    call npm install

    if errorlevel 1 (
        echo [ERRO] Falha no npm install.
        pause
        exit /b 1
    )

    echo [OK] Dependencias instaladas.

) else (

    echo [INFO] node_modules ja existe.
)

:: =========================================================
:: DOCKER / MONGODB
:: =========================================================

echo.
echo ============================================
echo MONGODB
echo ============================================
echo.

docker ps -a --format "{{.Names}}" | findstr /I "^%MONGO_CONTAINER%$" >nul

if errorlevel 1 (

    echo [INFO] Container nao encontrado.
    echo [INFO] Executando docker compose...

    cd /d "%ROOT_DIR%"

    docker compose up -d

    if errorlevel 1 (
        echo [ERRO] Falha no docker compose.
        pause
        exit /b 1
    )

    echo [OK] MongoDB iniciado.

) else (

    docker ps --format "{{.Names}}" | findstr /I "^%MONGO_CONTAINER%$" >nul

    if errorlevel 1 (

        echo [INFO] MongoDB parado.
        echo [INFO] Iniciando container...

        docker start %MONGO_CONTAINER%

        if errorlevel 1 (
            echo [ERRO] Falha ao iniciar MongoDB.
            pause
            exit /b 1
        )

        echo [OK] MongoDB iniciado.

    ) else (

        echo [INFO] MongoDB ja esta rodando.
    )
)

:: =========================================================
:: AGUARDAR MONGODB
:: =========================================================

echo.
echo [INFO] Aguardando MongoDB iniciar...

timeout /t 5 >nul

:: =========================================================
:: BACKEND
:: =========================================================

echo.
echo ============================================
echo BACKEND
echo ============================================
echo.

if exist "%BACKEND_DIR%\mvnw.cmd" (

    start "%BACKEND_TITLE%" cmd /k cd /d "%BACKEND_DIR%" ^&^& mvnw.cmd spring-boot:run

) else (

    echo [AVISO] Maven Wrapper nao encontrado.
    echo [INFO] Usando Maven global...

    start "%BACKEND_TITLE%" cmd /k cd /d "%BACKEND_DIR%" ^&^& mvn spring-boot:run
)

:: =========================================================
:: FRONTEND SERVER
:: =========================================================

echo.
echo ============================================
echo FRONTEND SERVER
echo ============================================
echo.

start "%FRONTEND_TITLE%" cmd /k cd /d "%FRONTEND_DIR%" ^&^& npm start

:: =========================================================
:: STATUS FINAL
:: =========================================================

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

echo MongoDB:
echo %MONGO_URI%
echo.

echo Pressione qualquer tecla para encerrar Frontend e Backend...
pause >nul

:: =========================================================
:: ENCERRAMENTO
:: =========================================================

echo.
echo [INFO] Encerrando servicos...

taskkill /FI "WINDOWTITLE eq %FRONTEND_TITLE%" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq %BACKEND_TITLE%" /T /F >nul 2>&1

echo.
echo [INFO] Frontend e Backend encerrados.
echo [INFO] MongoDB permanecera ativo.

timeout /t 2 >nul

endlocal
exit /b 0