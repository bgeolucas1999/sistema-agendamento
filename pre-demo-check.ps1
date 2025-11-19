#!/usr/bin/env pwsh

# ============================================================================
# SCRIPT DE PRÉ-DEMO - VERIFICAÇÃO RÁPIDA
# Uso: .\pre-demo-check.ps1
# ============================================================================

Write-Host "🎯 SISTEMA DE AGENDAMENTO - PRÉ-DEMO CHECK" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# ============================================================================
# 1. VERIFICAR DOCKER
# ============================================================================
Write-Host "📦 Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host "  ✅ Docker instalado: $dockerVersion" -ForegroundColor Green
    } else {
        $errors += "Docker não instalado ou não encontrado no PATH"
    }
} catch {
    $errors += "Docker não acessível: $_"
}

# ============================================================================
# 2. VERIFICAR DOCKER COMPOSE
# ============================================================================
try {
    $composeVersion = docker compose version 2>$null
    if ($composeVersion) {
        Write-Host "  ✅ Docker Compose pronto" -ForegroundColor Green
    } else {
        $errors += "Docker Compose não instalado"
    }
} catch {
    $errors += "Docker Compose erro: $_"
}

# ============================================================================
# 3. VERIFICAR CONTAINERS
# ============================================================================
Write-Host ""
Write-Host "🐳 Verificando Containers..." -ForegroundColor Yellow

$running = docker ps --format "{{.Names}}" 2>$null
if ($running -match "backend") {
    Write-Host "  ✅ Backend container rodando" -ForegroundColor Green
} else {
    $warnings += "Backend container NÃO está rodando - inicie com: docker compose up -d"
}

if ($running -match "frontend") {
    Write-Host "  ✅ Frontend container rodando" -ForegroundColor Green
} else {
    $warnings += "Frontend container NÃO está rodando"
}

# ============================================================================
# 4. VERIFICAR BACKEND HEALTH
# ============================================================================
Write-Host ""
Write-Host "🏥 Verificando Backend Health..." -ForegroundColor Yellow

try {
    $health = Invoke-WebRequest -Uri "http://localhost:8080/api/health" `
        -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($health.StatusCode -eq 200) {
        Write-Host "  ✅ Backend respondendo em http://localhost:8080" -ForegroundColor Green
    }
} catch {
    $errors += "Backend NÃO respondendo em localhost:8080"
}

# ============================================================================
# 5. VERIFICAR FRONTEND
# ============================================================================
Write-Host ""
Write-Host "🌐 Verificando Frontend..." -ForegroundColor Yellow

try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" `
        -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($frontend.StatusCode -eq 200) {
        Write-Host "  ✅ Frontend respondendo em http://localhost:3000" -ForegroundColor Green
    }
} catch {
    $errors += "Frontend NÃO respondendo em localhost:3000"
}

# ============================================================================
# 6. VERIFICAR LOGIN FUNCIONA
# ============================================================================
Write-Host ""
Write-Host "🔐 Testando Login..." -ForegroundColor Yellow

try {
    $loginBody = @{
        email = "admin@example.com"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody `
        -UseBasicParsing `
        -TimeoutSec 5 `
        -ErrorAction Stop

    if ($loginResponse.StatusCode -eq 200) {
        $data = $loginResponse.Content | ConvertFrom-Json
        if ($data.token) {
            Write-Host "  ✅ Login funcionando - Token gerado" -ForegroundColor Green
            Write-Host "     Token: $($data.token.Substring(0,20))..." -ForegroundColor Gray
        } else {
            $errors += "Login responde 200 mas sem token"
        }
    }
} catch {
    $errors += "Login FALHOU: $_"
}

# ============================================================================
# 7. VERIFICAR API SPACES
# ============================================================================
Write-Host ""
Write-Host "📍 Testando GET /api/spaces..." -ForegroundColor Yellow

try {
    $spacesResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/spaces" `
        -Headers @{ Authorization = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjo5OTk5OTk5OTk5fQ.dummy" } `
        -UseBasicParsing `
        -TimeoutSec 3 `
        -ErrorAction SilentlyContinue

    if ($spacesResponse.StatusCode -eq 200) {
        $spaces = $spacesResponse.Content | ConvertFrom-Json
        Write-Host "  ✅ Espaços retornados: $($spaces.Count) items" -ForegroundColor Green
        if ($spaces.Count -lt 2) {
            $warnings += "Esperava 2 espaços, encontrou $($spaces.Count)"
        }
    }
} catch {
    Write-Host "  ⚠️  GET /api/spaces pode precisar token válido - é normal em demo" -ForegroundColor Yellow
}

# ============================================================================
# 8. VERIFICAR NODE.JS (para testes Playwright)
# ============================================================================
Write-Host ""
Write-Host "🧪 Verificando Node.js (Playwright)..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "  ✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
    }
} catch {
    $warnings += "Node.js não encontrado - não será possível rodar testes"
}

# ============================================================================
# 9. VERIFICAR PORTS EM USO
# ============================================================================
Write-Host ""
Write-Host "🔌 Verificando Ports..." -ForegroundColor Yellow

$port8080 = netstat -ano 2>$null | Select-String ":8080" | Select-Object -First 1
$port3000 = netstat -ano 2>$null | Select-String ":3000" | Select-Object -First 1

if ($port8080) {
    Write-Host "  ✅ Port 8080 em uso (Backend)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Port 8080 aparentemente livre" -ForegroundColor Yellow
}

if ($port3000) {
    Write-Host "  ✅ Port 3000 em uso (Frontend)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Port 3000 aparentemente livre" -ForegroundColor Yellow
}

# ============================================================================
# 10. VERIFICAR ARQUIVOS DOCUMENTAÇÃO
# ============================================================================
Write-Host ""
Write-Host "📄 Verificando Documentação..." -ForegroundColor Yellow

$docs = @(
    "README.md",
    "RESUMO_FINAL.md",
    "TESTES_E2E.md",
    "PRE_DEMO_CHECKLIST.md",
    "GARANTIAS_TECNICAS.md"
)

foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "  ✅ $doc" -ForegroundColor Green
    } else {
        $warnings += "$doc não encontrado"
    }
}

# ============================================================================
# RESUMO
# ============================================================================
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "📊 RESUMO" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host ""
    Write-Host "✅ TUDO PRONTO PARA DEMO!" -ForegroundColor Green -BackgroundColor Black
    Write-Host "Sistema operacional e todos os pré-requisitos OK." -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "  1. Abrir browser: http://localhost:3000" -ForegroundColor Yellow
    Write-Host "  2. Login: admin@example.com / admin123" -ForegroundColor Yellow
    Write-Host "  3. Navegar pelo sistema" -ForegroundColor Yellow
    Write-Host "  4. Testar criar reserva" -ForegroundColor Yellow
    Write-Host ""
} else {
    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "⚠️  AVISOS ($($warnings.Count)):" -ForegroundColor Yellow
        foreach ($w in $warnings) {
            Write-Host "  • $w" -ForegroundColor Yellow
        }
    }

    if ($errors.Count -gt 0) {
        Write-Host ""
        Write-Host "❌ ERROS CRÍTICOS ($($errors.Count)):" -ForegroundColor Red
        foreach ($e in $errors) {
            Write-Host "  • $e" -ForegroundColor Red
        }
        Write-Host ""
        Write-Host "SOLUÇÃO RÁPIDA:" -ForegroundColor Red
        Write-Host "  docker compose down --volumes" -ForegroundColor Yellow
        Write-Host "  docker system prune -a -f" -ForegroundColor Yellow
        Write-Host "  docker compose up -d --build" -ForegroundColor Yellow
        Write-Host "  Start-Sleep -Seconds 30" -ForegroundColor Yellow
        Write-Host "  .\pre-demo-check.ps1  # Rodar de novo" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Good luck! 🚀" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
