#!/bin/bash

echo "============================================"
echo "              DRIVEFLOW"
echo "============================================"

echo

# ============================================
# VALIDACAO LINUX
# ============================================

if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "[ERRO] Este script deve ser executado no Linux."
    exit 1
fi

# ============================================
# VALIDACOES
# ============================================

command -v docker >/dev/null 2>&1 || {
    echo "[ERRO] Docker nao encontrado."
    exit 1
}

command -v npm >/dev/null 2>&1 || {
    echo "[ERRO] Node/NPM nao encontrado."
    exit 1
}

command -v java >/dev/null 2>&1 || {
    echo "[ERRO] Java nao encontrado."
    exit 1
}

# ============================================
# FRONTEND
# ============================================

echo
echo "============================================"
echo "FRONTEND"
echo "============================================"

cd frontend || exit

if [ ! -d "node_modules" ]; then

    echo "[INFO] Instalando dependencias Angular..."

    npm install

    if [ $? -ne 0 ]; then
        echo "[ERRO] npm install falhou."
        exit 1
    fi

    echo "[OK] Dependencias Angular instaladas."

else
    echo "[INFO] node_modules ja existe."
fi

cd ..

# ============================================
# DOCKER
# ============================================

echo
echo "============================================"
echo "DOCKER"
echo "============================================"

CONTAINER_NAME="driveflow-db"

if [ "$(docker ps -a -q -f name=^${CONTAINER_NAME}$)" ]; then

    echo "[INFO] Container encontrado."

    if [ "$(docker ps -q -f name=^${CONTAINER_NAME}$)" ]; then

        echo "[INFO] Container ja esta rodando."

    else

        echo "[INFO] Iniciando container..."

        docker start ${CONTAINER_NAME}

        if [ $? -ne 0 ]; then
            echo "[ERRO] Falha ao iniciar container."
            exit 1
        fi

        echo "[OK] Container iniciado."
    fi

else

    echo "[INFO] Container nao encontrado."
    echo "[INFO] Criando ambiente Docker..."

    docker compose up -d --build

    if [ $? -ne 0 ]; then
        echo "[ERRO] Docker compose falhou."
        exit 1
    fi

    echo "[OK] Ambiente Docker criado."
fi

# ============================================
# INICIANDO SERVICOS
# ============================================

echo
echo "============================================"
echo "INICIANDO SERVICOS"
echo "============================================"

cd frontend || exit
npm start &
FRONT_PID=$!
cd ..

cd backend || exit

if [ -f "./mvnw" ]; then

    chmod +x mvnw

    ./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081 &
    BACK_PID=$!

else

    echo "[AVISO] Maven Wrapper nao encontrado."
    echo "[AVISO] Tentando usar Maven global..."

    mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081 &
    BACK_PID=$!
fi

cd ..

echo
echo "============================================"
echo "AMBIENTE PRONTO"
echo "============================================"

echo
echo "Frontend: http://localhost:4200"
echo "Backend:  http://localhost:8081"
echo

echo "Pressione ENTER para encerrar os servicos..."
read

# ============================================
# ENCERRAMENTO GRACIOSO
# ============================================

echo
echo "[INFO] Encerrando servicos..."

kill -SIGINT $FRONT_PID 2>/dev/null
kill -SIGINT $BACK_PID 2>/dev/null

echo
echo "[INFO] Containers Docker permanecem ativos."

wait