S# Guia de Deploy - Sistema de Agendamento de Espaços

## Pré-requisitos

### Backend
- Java 17 ou superior
- Maven 3.6+
- PostgreSQL 14+ ou MySQL 8+
- IntelliJ IDEA ou Eclipse

### Frontend
- Node.js 18+ 
- npm ou yarn

## Ambiente de Desenvolvimento

### Configuração do Backend

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd reserves
```

2. **Configure o banco de dados**

Edite `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/reservespace
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT Configuration
jwt.secret=suaChaveSecretaMuitoSeguraComPeloMenos256Bits
jwt.expiration=86400000

# Server Configuration
server.port=8080

# CORS Configuration
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

3. **Crie o banco de dados**
```sql
CREATE DATABASE reservespace;
```

4. **Execute o backend**
```bash
mvn spring-boot:run
```

Ou no IntelliJ IDEA: Run > Run 'ReservesApplication'

### Configuração do Frontend

1. **Instale as dependências**
```bash
npm install
```

2. **Configure variáveis de ambiente**

Crie `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

3. **Execute o frontend**
```bash
npm run dev
```

Acesse: `http://localhost:5173`

## Dados Iniciais (Seed)

### Backend - data.sql

Crie `src/main/resources/data.sql`:

```sql
-- Criar usuário admin (senha: admin123)
INSERT INTO users (name, email, password, phone) 
VALUES ('Administrador', 'admin@reservespace.com', '$2a$10$xJ3lY5k8iKZNQQ7sXO8jNukGhEQ2cFjbYCLK3W4YKjH8dK5Zg7J6W', '11999999999');

INSERT INTO user_roles (user_id, roles) 
VALUES (1, 'ADMIN'), (1, 'USER');

-- Criar usuário normal (senha: user123)
INSERT INTO users (name, email, password, phone) 
VALUES ('João Silva', 'joao@example.com', '$2a$10$xJ3lY5k8iKZNQQ7sXO8jNukGhEQ2cFjbYCLK3W4YKjH8dK5Zg7J6W', '11988888888');

INSERT INTO user_roles (user_id, roles) 
VALUES (2, 'USER');

-- Criar espaços
INSERT INTO spaces (name, description, type, capacity, price_per_hour, available, floor, location) VALUES
('Sala de Reunião A', 'Sala ampla com TV 50" e quadro branco', 'MEETING_ROOM', 8, 50.00, true, '2º andar', 'Prédio Principal'),
('Mesa Compartilhada 1', 'Mesa em área coworking com internet rápida', 'DESK', 1, 15.00, true, '1º andar', 'Área Coworking'),
('Escritório Privado', 'Escritório privado para até 4 pessoas', 'PRIVATE_OFFICE', 4, 80.00, true, '3º andar', 'Ala Empresarial'),
('Auditório', 'Espaço para eventos com capacidade de 50 pessoas', 'EVENT_SPACE', 50, 200.00, true, 'Térreo', 'Prédio Anexo');

-- Adicionar amenidades
INSERT INTO space_amenities (space_id, amenities) VALUES
(1, 'Wi-Fi'), (1, 'TV'), (1, 'Quadro Branco'), (1, 'Ar Condicionado'),
(2, 'Wi-Fi'), (2, 'Tomadas'), (2, 'Café'),
(3, 'Wi-Fi'), (3, 'Ar Condicionado'), (3, 'Impressora'), (3, 'Privacidade'),
(4, 'Wi-Fi'), (4, 'Projetor'), (4, 'Som'), (4, 'Ar Condicionado'), (4, 'Palco');
```

## Deploy em Produção

### Backend - Deploy no Heroku

1. **Instale o Heroku CLI**
```bash
npm install -g heroku
```

2. **Login no Heroku**
```bash
heroku login
```

3. **Crie a aplicação**
```bash
heroku create reservespace-api
```

4. **Adicione PostgreSQL**
```bash
heroku addons:create heroku-postgresql:essential-0
```

5. **Configure variáveis de ambiente**
```bash
heroku config:set JWT_SECRET=suaChaveSecretaMuitoSegura
heroku config:set CORS_ALLOWED_ORIGINS=https://seu-frontend.vercel.app
```

6. **Crie Procfile**
```
web: java -jar target/reserves-0.0.1-SNAPSHOT.jar --server.port=$PORT
```

7. **Configure application-prod.properties**
```properties
spring.datasource.url=${DATABASE_URL}
spring.jpa.hibernate.ddl-auto=update
jwt.secret=${JWT_SECRET}
cors.allowed-origins=${CORS_ALLOWED_ORIGINS}
```

8. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Backend - Deploy no Railway

1. **Instale o Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login e crie projeto**
```bash
railway login
railway init
```

3. **Adicione PostgreSQL**
No dashboard Railway: Add Service > Database > PostgreSQL

4. **Configure variáveis de ambiente**
No dashboard:
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`

5. **Deploy**
```bash
railway up
```

### Backend - Deploy em VPS (Ubuntu)

1. **Instale Java**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

2. **Instale PostgreSQL**
```bash
sudo apt install postgresql postgresql-contrib
```

3. **Configure o banco**
```bash
sudo -u postgres psql
CREATE DATABASE reservespace;
CREATE USER reserveuser WITH PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE reservespace TO reserveuser;
\q
```

4. **Compile o projeto**
```bash
mvn clean package -DskipTests
```

5. **Crie um serviço systemd**
```bash
sudo nano /etc/systemd/system/reservespace.service
```

Conteúdo:
```ini
[Unit]
Description=Reserve Space API
After=syslog.target

[Service]
User=ubuntu
ExecStart=/usr/bin/java -jar /home/ubuntu/reserves/target/reserves-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
Environment="SPRING_PROFILES_ACTIVE=prod"

[Install]
WantedBy=multi-user.target
```

6. **Inicie o serviço**
```bash
sudo systemctl enable reservespace
sudo systemctl start reservespace
sudo systemctl status reservespace
```

7. **Configure Nginx**
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/reservespace
```

Conteúdo:
```nginx
server {
    listen 80;
    server_name api.seu-dominio.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/reservespace /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. **Configure SSL com Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.seu-dominio.com
```

### Frontend - Deploy na Vercel

1. **Instale Vercel CLI**
```bash
npm install -g vercel
```

2. **Configure variáveis de ambiente**

Crie `.env.production`:
```env
VITE_API_BASE_URL=https://reservespace-api.herokuapp.com/api
```

3. **Build local para testar**
```bash
npm run build
npm run preview
```

4. **Deploy**
```bash
vercel --prod
```

Ou conecte seu repositório GitHub no dashboard da Vercel.

### Frontend - Deploy na Netlify

1. **Instale Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Configure variáveis de ambiente**
No dashboard Netlify: Site settings > Environment variables

3. **Crie netlify.toml**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

4. **Deploy**
```bash
netlify deploy --prod
```

### Frontend - Deploy em VPS com Nginx

1. **Build da aplicação**
```bash
npm run build
```

2. **Envie arquivos para servidor**
```bash
scp -r dist/* user@seu-servidor:/var/www/reservespace
```

3. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/reservespace;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080/api;
    }
}
```

4. **Configure SSL**
```bash
sudo certbot --nginx -d seu-dominio.com
```

## Docker

### Backend Dockerfile

```dockerfile
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: reservespace
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./reserves
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/reservespace
      SPRING_DATASOURCE_USERNAME: admin
      SPRING_DATASOURCE_PASSWORD: admin123
      JWT_SECRET: suaChaveSecretaMuitoSegura
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      VITE_API_BASE_URL: http://localhost:8080/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Executar**:
```bash
docker-compose up -d
```

## CI/CD com GitHub Actions

### Backend - .github/workflows/backend.yml

```yaml
name: Backend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'backend/**'

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up JDK 17
      uses: actions/setup-java@v2
      with:
        java-version: '17'
        distribution: 'adopt'
    
    - name: Build with Maven
      run: mvn clean package -DskipTests
      working-directory: ./backend
    
    - name: Run tests
      run: mvn test
      working-directory: ./backend
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "reservespace-api"
        heroku_email: "seu-email@example.com"
        appdir: "backend"
```

### Frontend - .github/workflows/frontend.yml

```yaml
name: Frontend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'frontend/**'

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
      working-directory: ./frontend
    
    - name: Build
      run: npm run build
      working-directory: ./frontend
      env:
        VITE_API_BASE_URL: ${{secrets.API_BASE_URL}}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{secrets.VERCEL_TOKEN}}
        vercel-org-id: ${{secrets.VERCEL_ORG_ID}}
        vercel-project-id: ${{secrets.VERCEL_PROJECT_ID}}
        working-directory: ./frontend
```

## Monitoramento

### Backend - Actuator

Adicione ao `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Configure `application.properties`:
```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

Endpoints disponíveis:
- `/actuator/health` - Status da aplicação
- `/actuator/info` - Informações da aplicação
- `/actuator/metrics` - Métricas

### Frontend - Sentry

1. **Instale o Sentry**
```bash
npm install @sentry/react
```

2. **Configure no main.tsx**
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});
```

## Backup e Recuperação

### Backup PostgreSQL

```bash
# Backup
pg_dump -U usuario -h localhost reservespace > backup.sql

# Restore
psql -U usuario -h localhost reservespace < backup.sql

# Backup automatizado (cron)
0 2 * * * pg_dump -U usuario reservespace > /backups/backup_$(date +\%Y\%m\%d).sql
```

## Checklist de Deploy

### Backend
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados criado e configurado
- [ ] JWT secret configurado (mínimo 256 bits)
- [ ] CORS configurado com domínio do frontend
- [ ] SSL/HTTPS configurado
- [ ] Logs configurados
- [ ] Backup automatizado
- [ ] Monitoramento ativo

### Frontend
- [ ] API_BASE_URL apontando para produção
- [ ] Build gerado sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] SSL/HTTPS configurado
- [ ] CDN configurado (opcional)
- [ ] Error tracking configurado (Sentry)
- [ ] Analytics configurado (opcional)

## Troubleshooting

### Erro de CORS
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solução**: Verificar configuração de CORS no backend

### Erro 401 (Unauthorized)
```
401 Unauthorized
```
**Solução**: 
- Verificar se token está sendo enviado
- Verificar se token não expirou
- Verificar JWT secret no backend

### Erro de conexão com banco
```
Unable to connect to database
```
**Solução**:
- Verificar se banco está rodando
- Verificar credenciais
- Verificar URL de conexão

### Frontend não carrega após deploy
**Solução**:
- Verificar se arquivos foram copiados corretamente
- Verificar configuração do servidor web
- Verificar se está servindo index.html para todas as rotas

## Suporte

Para mais informações, consulte:
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Docs](https://react.dev/)
- [Vercel Docs](https://vercel.com/docs)
- [Heroku Docs](https://devcenter.heroku.com/)
