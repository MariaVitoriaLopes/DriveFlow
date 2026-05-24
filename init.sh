#!/bin/bash

# =========================================================
# CONFIGURACOES
# =========================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"

MONGO_CONTAINER="mongodb_driveflow"
MONGO_URI="mongodb://localhost:27017/driveflow_db"

FRONTEND_PID=""
BACKEND_PID=""

# =========================================================
# FUNCOES
# =========================================================

check_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "[ERRO] $2 nao encontrado."
        exit 1
    fi
}

cleanup() {

    echo
    echo "[INFO] Encerrando servicos..."

    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" >/dev/null 2>&1
    fi

    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" >/dev/null 2>&1
    fi

    echo
    echo "[INFO] Frontend e Backend encerrados."
    echo "[INFO] MongoDB permanecera ativo."

    exit 0
}

trap cleanup SIGINT

# =========================================================
# HEADER
# =========================================================

clear

echo "============================================"
echo "               DRIVEFLOW"
echo "============================================"
echo

echo "Root:"
echo "$ROOT_DIR"
echo

# =========================================================
# VALIDACOES
# =========================================================

check_command docker "Docker"
check_command npm "Node/NPM"
check_command java "Java"

# =========================================================
# VALIDAR PASTAS
# =========================================================

if [ ! -d "$FRONTEND_DIR" ]; then
    echo "[ERRO] Pasta frontend nao encontrada."
    exit 1
fi

if [ ! -d "$BACKEND_DIR" ]; then
    echo "[ERRO] Pasta backend nao encontrada."
    exit 1
fi

# =========================================================
# FRONTEND - DEPENDENCIAS
# =========================================================

echo
echo "============================================"
echo "FRONTEND"
echo "============================================"
echo

cd "$FRONTEND_DIR" || exit 1

if [ ! -d "node_modules" ]; then

    echo "[INFO] Instalando dependencias..."

    npm install

    if [ $? -ne 0 ]; then
        echo "[ERRO] Falha no npm install."
        exit 1
    fi

    echo "[OK] Dependencias instaladas."

else

    echo "[INFO] node_modules ja existe."
fi

# =========================================================
# DOCKER / MONGODB
# =========================================================

echo
echo "============================================"
echo "MONGODB"
echo "============================================"
echo

if ! docker ps -a --format "{{.Names}}" | grep -i "^${MONGO_CONTAINER}$" >/dev/null; then

    echo "[INFO] Container nao encontrado."
    echo "[INFO] Executando docker compose..."

    cd "$ROOT_DIR" || exit 1

    docker compose up -d

    if [ $? -ne 0 ]; then
        echo "[ERRO] Falha no docker compose."
        exit 1
    fi

    echo "[OK] MongoDB iniciado."

else

    if ! docker ps --format "{{.Names}}" | grep -i "^${MONGO_CONTAINER}$" >/dev/null; then

        echo "[INFO] MongoDB parado."
        echo "[INFO] Iniciando container..."

        docker start "$MONGO_CONTAINER"

        if [ $? -ne 0 ]; then
            echo "[ERRO] Falha ao iniciar MongoDB."
            exit 1
        fi

        echo "[OK] MongoDB iniciado."

    else

        echo "[INFO] MongoDB ja esta rodando."
    fi
fi

# =========================================================
# AGUARDAR MONGODB
# =========================================================

echo
echo "[INFO] Aguardando MongoDB iniciar..."

sleep 5

# =========================================================
# BACKEND
# =========================================================

echo
echo "============================================"
echo "BACKEND"
echo "============================================"
echo

cd "$BACKEND_DIR" || exit 1

if [ -f "./mvnw" ]; then

    chmod +x mvnw

    ./mvnw spring-boot:run &
    BACKEND_PID=$!

else

    echo "[AVISO] Maven Wrapper nao encontrado."
    echo "[INFO] Usando Maven global..."

    mvn spring-boot:run &
    BACKEND_PID=$!
fi

# =========================================================
# FRONTEND SERVER
# =========================================================

echo
echo "============================================"
echo "FRONTEND SERVER"
echo "============================================"
echo

cd "$FRONTEND_DIR" || exit 1

npm start &
FRONTEND_PID=$!

# =========================================================
# STATUS FINAL
# =========================================================

echo
echo "============================================"
echo "AMBIENTE PRONTO"
echo "============================================"
echo

echo "Frontend:"
echo "http://localhost:4200"
echo

echo "Backend:"
echo "http://localhost:8081"
echo

echo "MongoDB:"
echo "$MONGO_URI"
echo

echo "Pressione CTRL+C para encerrar Frontend e Backend..."

wait