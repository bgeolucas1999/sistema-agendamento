<#
.SYNOPSIS
  Safely copy `seed-data.sql` into the Postgres container and run it with psql.

.DESCRIPTION
  This script copies the local `scripts/seed-data.sql` into the Postgres container
  using `docker cp` (preserves bytes / encoding), then runs `psql -f` inside the container.
  This avoids encoding issues that can happen when piping via PowerShell streams.

.EXAMPLE
  docker compose up -d --build
  .\scripts\load-seed-windows.ps1

#>

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$seedFile = Join-Path $scriptDir 'seed-data.sql'
$container = 'sistema_agendamento_postgres'
$destPath = '/tmp/seed-data.sql'

if (-not (Test-Path $seedFile)) {
    Write-Error "Seed file not found: $seedFile"
    exit 1
}

# Ensure container is running
$running = docker ps --filter "name=$container" --format "{{.Names}}" 2>$null
if (-not $running) {
    Write-Error "Container '$container' not found or not running. Start the stack with: docker compose up -d"
    exit 1
}

Write-Host "Copying seed file to container ${container}:$destPath..." -ForegroundColor Cyan
docker cp $seedFile "${container}:$destPath"
if ($LASTEXITCODE -ne 0) {
    Write-Error "docker cp failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "Running psql inside container..." -ForegroundColor Cyan
docker exec -i $container psql -U admin -d sistema_agendamento -v ON_ERROR_STOP=1 -f $destPath
$rc = $LASTEXITCODE
if ($rc -eq 0) {
    Write-Host "Seed loaded successfully." -ForegroundColor Green
    exit 0
} else {
    Write-Error "psql inside container failed with exit code $rc"
    exit $rc
}
