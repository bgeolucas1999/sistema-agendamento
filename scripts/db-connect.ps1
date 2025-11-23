#!/usr/bin/env pwsh
# Abre uma sessão psql dentro do container Postgres do projeto
try {
    Write-Output "Conectando ao container 'sistema_agendamento_postgres'..."
    docker exec -it sistema_agendamento_postgres psql -U admin -d sistema_agendamento
} catch {
    Write-Error "Falha ao executar docker exec. Verifique se o container está rodando."
}
