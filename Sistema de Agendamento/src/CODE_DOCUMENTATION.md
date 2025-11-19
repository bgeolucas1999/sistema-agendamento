# Documentação do Código - Sistema de Agendamento de Espaços

## Visão Geral da Arquitetura

Este documento descreve a estrutura e funcionamento do código frontend do sistema de agendamento de espaços coletivos.

## Estrutura de Diretórios

```
/
├── App.tsx                 # Componente principal e configuração de rotas
├── components/             # Componentes reutilizáveis
│   ├── auth/              # Componentes de autenticação
│   ├── common/            # Componentes comuns (Loading, etc)
│   ├── layout/            # Componentes de layout (Navigation)
│   ├── reservations/      # Componentes de reservas
│   ├── spaces/            # Componentes de espaços
│   └── ui/                # Componentes UI do ShadCN
├── contexts/              # Contexts do React
├── hooks/                 # Custom hooks
├── pages/                 # Páginas da aplicação
├── services/              # Serviços de API
├── utils/                 # Funções utilitárias
└── styles/                # Estilos globais
```

## Componentes Principais

### 1. App.tsx

**Propósito**: Componente raiz que configura providers e roteamento.

**Funcionalidades**:
- Configuração do React Router
- Providers de Context (Auth, Alert)
- Rotas públicas e privadas
- Proteção de rotas baseada em autenticação

**Código Importante**:
```typescript
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
```

### 2. Contexts

#### AuthContext

**Arquivo**: `/contexts/AuthContext.tsx`

**Propósito**: Gerencia estado de autenticação global.

**Estado Mantido**:
- `user`: Dados do usuário autenticado
- `isAuthenticated`: Status de autenticação
- `isLoading`: Estado de carregamento

**Métodos**:
```typescript
login(credentials: LoginRequest): Promise<void>
register(userData: RegisterRequest): Promise<void>
logout(): void
hasRole(role: string): boolean
```

**Funcionamento**:
1. Verifica localStorage ao montar para recuperar sessão
2. Mantém sincronização entre localStorage e estado
3. Provê métodos para autenticação
4. Gerencia roles do usuário

#### AlertContext

**Arquivo**: `/contexts/AlertContext.tsx`

**Propósito**: Sistema de notificações toast.

**Métodos**:
```typescript
showSuccess(message: string): void
showError(message: string): void
showInfo(message: string): void
showWarning(message: string): void
```

## Services (Camada de API)

### 1. api.ts

**Propósito**: Cliente HTTP centralizado com interceptors.

**Características**:
- Configuração base do Axios
- Interceptor de request para adicionar token JWT
- Interceptor de response para tratar erros
- Métodos genéricos (get, post, put, delete, patch)

**Interceptor de Request**:
```typescript
this.api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Interceptor de Response**:
```typescript
this.api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redireciona para login em caso de token expirado
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 2. authService.ts

**Propósito**: Gerencia operações de autenticação.

**Métodos Principais**:

```typescript
// Login do usuário
async login(credentials: LoginRequest): Promise<JwtResponse>

// Registro de novo usuário
async register(userData: RegisterRequest): Promise<JwtResponse>

// Logout
logout(): void

// Verificar autenticação
isAuthenticated(): boolean

// Verificar role
hasRole(role: string): boolean
```

**Fluxo de Login**:
1. Envia credenciais para `/api/auth/login`
2. Recebe token JWT e dados do usuário
3. Armazena token no localStorage
4. Armazena dados do usuário no localStorage
5. Retorna resposta

### 3. spaceService.ts

**Propósito**: CRUD de espaços.

**Métodos**:
```typescript
getAllSpaces(): Promise<Space[]>
getSpaceById(id: number): Promise<Space>
getAvailableSpaces(filter?: SpaceFilter): Promise<Space[]>
createSpace(spaceData: SpaceDTO): Promise<Space>
updateSpace(id: number, spaceData: Partial<SpaceDTO>): Promise<Space>
deleteSpace(id: number): Promise<void>
```

**Interface Space**:
```typescript
interface Space {
  id: number;
  name: string;
  description: string;
  type: string;
  capacity: number;
  pricePerHour: number;
  amenities: string[];
  imageUrl?: string;
  available: boolean;
  floor?: string;
  location?: string;
}
```

### 4. reservationService.ts

**Propósito**: CRUD de reservas.

**Métodos Principais**:
```typescript
getAllReservations(filter?: ReservationFilter): Promise<Reservation[]>
getMyReservations(): Promise<Reservation[]>
createReservation(reservationData: ReservationDTO): Promise<Reservation>
cancelReservation(id: number): Promise<void>
updateReservation(id: number, data: Partial<ReservationDTO>): Promise<Reservation>
```

**Interface Reservation**:
```typescript
interface Reservation {
  id: number;
  spaceId: number;
  spaceName: string;
  userId: number;
  userName: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  notes?: string;
  createdAt: string;
}
```

## Custom Hooks

### 1. useAuth

**Propósito**: Hook para acessar contexto de autenticação.

**Uso**:
```typescript
const { user, isAuthenticated, login, logout, hasRole } = useAuth();
```

### 2. useApi

**Propósito**: Hook genérico para chamadas de API com loading e error handling.

**Parâmetros**:
```typescript
interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
}
```

**Retorno**:
```typescript
{
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T>;
}
```

**Exemplo de Uso**:
```typescript
const { data, loading, execute } = useApi(
  spaceService.getAllSpaces,
  {
    successMessage: 'Espaços carregados com sucesso',
    errorMessage: 'Erro ao carregar espaços'
  }
);

useEffect(() => {
  execute();
}, []);
```

## Componentes de UI

### 1. Navigation

**Arquivo**: `/components/layout/Navigation.tsx`

**Propósito**: Barra de navegação principal.

**Características**:
- Navegação responsiva com menu mobile
- Exibe avatar e informações do usuário
- Menu adaptado baseado em roles (admin vê opções extras)
- Botão de logout

**Estrutura**:
```typescript
const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/spaces', label: 'Espaços', icon: Building2 },
  { path: '/reservations', label: 'Reservas', icon: Calendar },
];
```

### 2. SpaceCard

**Arquivo**: `/components/spaces/SpaceCard.tsx`

**Propósito**: Card para exibir informações de um espaço.

**Props**:
```typescript
interface SpaceCardProps {
  space: Space;
  onReserve?: (space: Space) => void;
  onEdit?: (space: Space) => void;
  onDelete?: (space: Space) => void;
  isAdmin?: boolean;
}
```

**Características**:
- Exibe imagem, nome, tipo, capacidade e preço
- Modo admin com botões de editar/excluir
- Modo usuário com botão de reservar
- Badge de disponibilidade

### 3. SpaceFilter

**Arquivo**: `/components/spaces/SpaceFilter.tsx`

**Propósito**: Filtros para busca de espaços.

**Filtros Disponíveis**:
- Busca por texto (nome/descrição)
- Tipo de espaço
- Capacidade mínima
- Preço máximo

**Estado**:
```typescript
interface FilterValues {
  type?: string;
  minCapacity?: number;
  maxPrice?: number;
  search?: string;
}
```

### 4. Calendar

**Arquivo**: `/components/reservations/Calendar.tsx`

**Propósito**: Calendário interativo para seleção de data.

**Props**:
```typescript
interface CalendarProps {
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  reservedDates?: Date[];
}
```

**Funcionalidades**:
- Navegação entre meses
- Destaque para data selecionada
- Indicação de datas reservadas
- Desabilita datas passadas
- Destaque para data atual

### 5. ReservationForm

**Arquivo**: `/components/reservations/ReservationForm.tsx`

**Propósito**: Formulário modal para criar reserva.

**Características**:
- Calendário integrado
- Seleção de horários (intervalos de 30min)
- Cálculo automático de duração e preço
- Campo de observações
- Validação de horários

**Cálculo de Preço**:
```typescript
const calculateDuration = () => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  return (endMinutes - startMinutes) / 60;
};

const calculateTotalPrice = () => {
  if (!space) return 0;
  const hours = calculateDuration();
  return hours * space.pricePerHour;
};
```

### 6. LoginForm & RegisterForm

**Arquivos**: 
- `/components/auth/LoginForm.tsx`
- `/components/auth/RegisterForm.tsx`

**Propósito**: Formulários de autenticação.

**LoginForm - Campos**:
- Email
- Senha

**RegisterForm - Campos**:
- Nome completo
- Email
- Telefone (opcional)
- Senha
- Confirmar senha

**Validações**:
- Email válido
- Senha com mínimo 6 caracteres
- Senhas devem corresponder (registro)

## Páginas

### 1. DashboardPage

**Propósito**: Página inicial após login.

**Conteúdo**:
- Cards com estatísticas (espaços disponíveis, reservas, etc)
- Lista de próximas reservas
- Ações rápidas
- Espaços mais populares

**Estatísticas Exibidas**:
```typescript
const stats = [
  { title: 'Espaços Disponíveis', value: availableSpaces.length },
  { title: 'Minhas Reservas', value: confirmedReservations.length },
  { title: 'Próximas Reservas', value: upcomingReservations.length },
  { title: 'Taxa de Ocupação', value: '87%' },
];
```

### 2. SpacesPage

**Propósito**: Listagem e busca de espaços.

**Funcionalidades**:
- Grid de espaços com cards
- Sistema de filtros
- Modal de reserva
- Atualização após reserva

**Fluxo de Reserva**:
1. Usuário clica em "Reservar" no card
2. Modal abre com calendário e formulário
3. Usuário seleciona data, horários e observações
4. Sistema calcula preço total
5. Usuário confirma
6. API cria reserva
7. Lista de espaços é atualizada

### 3. ReservationsPage

**Propósito**: Gerenciamento de reservas do usuário.

**Características**:
- Tabs para categorizar reservas (Próximas, Passadas, Canceladas)
- Cards detalhados de cada reserva
- Botão para cancelar reservas futuras
- Dialog de confirmação de cancelamento

**Estrutura de Tabs**:
```typescript
<Tabs defaultValue="upcoming">
  <TabsList>
    <TabsTrigger value="upcoming">Próximas</TabsTrigger>
    <TabsTrigger value="past">Passadas</TabsTrigger>
    <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
  </TabsList>
  <TabsContent value="upcoming">{/* Reservas futuras */}</TabsContent>
  <TabsContent value="past">{/* Reservas passadas */}</TabsContent>
  <TabsContent value="cancelled">{/* Reservas canceladas */}</TabsContent>
</Tabs>
```

### 4. AdminPage

**Propósito**: Painel administrativo.

**Funcionalidades**:
- CRUD completo de espaços
- Visualização de todas as reservas
- Formulário modal para criar/editar espaços
- Tabs para organizar conteúdo

**Formulário de Espaço - Campos**:
- Nome do espaço
- Tipo (select com opções pré-definidas)
- Descrição
- Capacidade
- Preço por hora
- Localização
- Andar
- URL da imagem

## Utilitários

### 1. constants.ts

**Propósito**: Constantes da aplicação.

**Conteúdo**:
- `API_BASE_URL`: URL base da API
- `API_ENDPOINTS`: Endpoints organizados por recurso
- `SPACE_TYPES`: Tipos de espaço disponíveis
- `RESERVATION_STATUS`: Status de reserva
- `USER_ROLES`: Roles de usuário
- `STORAGE_KEYS`: Chaves do localStorage
- `DATE_FORMATS`: Formatos de data

### 2. validation.ts

**Propósito**: Funções de validação.

**Funções**:
```typescript
validateEmail(email: string): boolean
validatePassword(password: string): { valid: boolean; message?: string }
validateRequired(value: string): boolean
validatePhone(phone: string): boolean
validateDateRange(startDate: Date, endDate: Date): boolean
```

### 3. helpers.ts

**Propósito**: Funções auxiliares.

**Funções Principais**:
```typescript
// Formatar data
formatDate(date: string | Date, format: string): string

// Formatar data e hora
formatDateTime(date: string | Date): string

// Formatar moeda
formatCurrency(value: number): string

// Obter iniciais do nome
getInitials(name: string): string

// Truncar texto
truncateText(text: string, maxLength: number): string

// Debounce para otimizar buscas
debounce<T>(func: T, wait: number): (...args: any[]) => void
```

## Fluxos Principais

### Fluxo de Autenticação

```
1. Usuário acessa /login
2. Preenche email e senha
3. LoginForm valida campos
4. authService.login() é chamado
5. API retorna JWT e dados do usuário
6. Token e dados salvos no localStorage
7. AuthContext atualiza estado
8. Usuário é redirecionado para /dashboard
```

### Fluxo de Criação de Reserva

```
1. Usuário navega para /spaces
2. SpacesPage carrega lista de espaços
3. Usuário aplica filtros (opcional)
4. Usuário clica em "Reservar" em um espaço
5. ReservationForm abre como modal
6. Usuário seleciona data no calendário
7. Usuário seleciona horários de início e fim
8. Sistema calcula duração e preço automaticamente
9. Usuário adiciona observações (opcional)
10. Usuário clica em "Confirmar Reserva"
11. reservationService.createReservation() é chamado
12. API valida disponibilidade
13. API cria reserva no banco
14. Frontend mostra mensagem de sucesso
15. Modal fecha
16. Lista de espaços é recarregada
```

### Fluxo de Administração de Espaços

```
1. Admin acessa /admin
2. AdminPage carrega espaços e reservas
3. Admin clica em "Novo Espaço"
4. Modal abre com formulário vazio
5. Admin preenche dados do espaço
6. Admin clica em "Salvar"
7. spaceService.createSpace() é chamado
8. API cria espaço no banco
9. Frontend mostra mensagem de sucesso
10. Modal fecha
11. Lista é atualizada
```

## Segurança

### Proteção de Rotas

```typescript
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
```

### Proteção de Endpoints

O token JWT é automaticamente enviado em todas as requisições:

```typescript
this.api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Verificação de Roles

```typescript
const { hasRole } = useAuth();

if (hasRole(USER_ROLES.ADMIN)) {
  // Exibir opções de admin
}
```

## Responsividade

A aplicação usa Tailwind CSS com breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Exemplos**:
```typescript
// Grid responsivo
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Flex responsivo
className="flex flex-col sm:flex-row gap-4"

// Visibilidade condicional
className="hidden md:flex"  // Oculto no mobile, visível no desktop
className="flex md:hidden"  // Visível no mobile, oculto no desktop
```

## Performance

### Otimizações Implementadas

1. **useCallback**: Memoriza funções para evitar re-renders
2. **Lazy Loading**: Componentes carregados sob demanda
3. **Debounce**: Busca otimizada com delay
4. **React.memo**: Componentes memorizados quando necessário

## Boas Práticas Seguidas

1. **TypeScript**: Tipagem forte em todo o código
2. **Componentização**: Componentes pequenos e reutilizáveis
3. **Separação de Responsabilidades**: Services, Components, Utils
4. **Context API**: Gerenciamento de estado global
5. **Custom Hooks**: Lógica reutilizável
6. **Error Handling**: Tratamento centralizado de erros
7. **Loading States**: Feedback visual para usuário
8. **Mobile First**: Design responsivo desde o início
9. **Acessibilidade**: Uso de labels, aria-*, semantic HTML
10. **Clean Code**: Código limpo e bem documentado
