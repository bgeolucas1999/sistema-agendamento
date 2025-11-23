#!/usr/bin/env pwsh
# Executa um conjunto de queries de verificação no Postgres do container
function RunQuery($sql, $label) {
    Write-Output "\n--- $label ---"
    docker exec -i sistema_agendamento_postgres psql -U admin -d sistema_agendamento -c "$sql"
}

Write-Output "Executando queries de verificação no banco 'sistema_agendamento' (container: sistema_agendamento_postgres)"

RunQuery "\\dt" "Listar tabelas"
RunQuery "SELECT 'spaces' AS table_name, COUNT(*) FROM spaces;" "Contagem: spaces"
RunQuery "SELECT 'users' AS table_name, COUNT(*) FROM users;" "Contagem: users"
RunQuery "SELECT 'reservations' AS table_name, COUNT(*) FROM reservations;" "Contagem: reservations"
RunQuery "SELECT id, space_id, user_name, user_email, start_time, end_time, status FROM reservations ORDER BY created_at DESC LIMIT 10;" "10 reservas mais recentes"
RunQuery "SELECT u.id, u.name, u.email, array_agg(r.role) AS roles FROM users u LEFT JOIN user_roles r ON u.id = r.user_id GROUP BY u.id, u.name, u.email ORDER BY u.id;" "Usuarios e roles"

Write-Output "\nFim das verificações."
