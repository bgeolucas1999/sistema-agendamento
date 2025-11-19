# 🚀 Sistema de Agendamento - Guia de Teste End-to-End (Frontend + Backend)

## Pré-requisitos

- **Backend rodando**: `java -jar ../target/sistema-agendamento-0.0.1-SNAPSHOT.jar` (porta 8080)
- **Node.js**: versão 16+ instalado
- **npm ou pnpm**: gerenciador de pacotes

## Passos para Teste Local

### 1. Instalar dependências do frontend

```bash
npm install
# ou
pnpm install
```

### 2. Configurar variáveis de ambiente

O arquivo `.env` já está configurado apontando para o backend local:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

Se precisar trocar a URL, edite `.env`.

### 3. Iniciar o frontend

```bash
npm run dev
# ou
pnpm run dev
```

Acesse: **http://localhost:5173**

### 4. Testar fluxo de login e listagem

#### Teste 1: Login com admin padrão
- Email: `admin@example.com`
- Senha: `admin123`
- O token será salvo em `localStorage` com a chave `authToken`

#### Teste 2: Listar espaços
- Após login, você será redirecionado para o dashboard
- Clique em "Espaços" ou aguarde o carregamento da lista
- A API chamará `GET /api/spaces` automaticamente com o header `Authorization: Bearer {token}`

#### Teste 3: Criar uma reserva (opcional)
- Selecione um espaço da lista
- Preencha a data/hora de início e fim
- Clique em "Reservar"
- A API criará a reserva via `POST /api/reservations`

### 5. Verificar fluxo no navegador

Abra o console do navegador (F12 → Network/Console) para:
- Ver requests HTTP (Authorization header)
- Verificar respostas JSON
- Confirmar que o token está no localStorage

## Endpoints testados

| Endpoint | Método | Autenticado | Descrição |
|----------|--------|------------|-----------|
| `/api/auth/login` | POST | Não | Login e retorno de JWT |
| `/api/auth/register` | POST | Não | Registro de novo usuário |
| `/api/spaces` | GET | Sim | Listar todos os espaços |
| `/api/spaces/{id}` | GET | Sim | Obter espaço por ID |
| `/api/reservations` | POST | Sim | Criar reserva |
| `/api/reservations/my` | GET | Sim | Listar minhas reservas |
| `/api/reservations/{id}/cancel` | POST | Sim | Cancelar reserva |

## Dados de teste

### Espaços pré-carregados (via `data.sql`)
- **Sala de Reunião A**: 10 pessoas, R$ 50/hora
- **Auditório Azul**: 100 pessoas, R$ 200/hora

### Usuários padrão
- **Admin**: `admin@example.com` / `admin123` (criado automaticamente)
- **Usuário novo**: Registre via formulário de cadastro no frontend

## Troubleshooting

### CORS error (403 / Forbidden)
- Verifique se o backend está rodando em http://localhost:8080
- Confirme que `VITE_API_BASE_URL` no `.env` aponta para o backend correto
- No backend, verifique `ReservesApplication.java` — CORS deve permitir `http://localhost:5173`

### Token inválido / 401 Unauthorized
- Limpe `localStorage` (F12 → Storage → Local Storage → Delete)
- Faça login novamente

### Erro ao criar reserva
- Confirme que a data/hora está no futuro
- Verifique se o espaço está disponível (não conflita com outra reserva)
- Revise a resposta da API no Network tab

## Próximos passos

- [ ] Testar fluxo completo de login → listagem → criação de reserva
- [ ] Validar resposta de erros (bad request, unauthorized, etc.)
- [ ] Verificar campos de formulário e validações
- [ ] Testar responsividade (mobile/desktop)
- [ ] Adicionar mais usuários e testar isolamento de dados

## Deploy em produção

Quando pronto para produção:

1. Atualize `.env` com a URL da API em produção
2. Build otimizado: `npm run build`
3. Sirva os arquivos estáticos em um servidor (nginx, Apache, S3, etc.)
4. Certifique-se de que CORS está configurado no backend para a URL de produção

