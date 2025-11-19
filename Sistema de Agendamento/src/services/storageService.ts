// Serviço de armazenamento local que simula um banco de dados
import { Space } from './spaceService';
import { Reservation } from './reservationService';
import { User } from './authService';

interface Database {
  users: User[];
  spaces: Space[];
  reservations: Reservation[];
  notifications: Notification[];
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

class StorageService {
  private readonly DB_KEY = 'reserve_space_db';

  private getDefaultDB(): Database {
    return {
      users: [
        {
          id: 1,
          name: 'Administrador',
          email: 'admin@gmail.com',
          phone: '(11) 99999-9999',
          roles: ['ROLE_ADMIN', 'ROLE_USER'],
          profileImage: undefined,
        },
      ],
      spaces: [
        {
          id: 1,
          name: 'Sala de Reunião A',
          description: 'Sala moderna equipada com projetor, quadro branco e sistema de videoconferência',
          type: 'MEETING_ROOM',
          capacity: 10,
          pricePerHour: 75.00,
          amenities: ['Projetor', 'Quadro Branco', 'Wi-Fi', 'Ar Condicionado', 'Videoconferência'],
          available: true,
          floor: '2�� Andar',
          location: 'Bloco A',
        },
        {
          id: 2,
          name: 'Espaço de Coworking',
          description: 'Ambiente colaborativo com mesas compartilhadas e áreas de descanso',
          type: 'COWORKING',
          capacity: 30,
          pricePerHour: 50.00,
          amenities: ['Wi-Fi', 'Café', 'Impressora', 'Ar Condicionado', 'Armários'],
          available: true,
          floor: '1º Andar',
          location: 'Bloco B',
        },
        {
          id: 3,
          name: 'Auditório Principal',
          description: 'Espaço amplo para eventos, palestras e apresentações com capacidade para grandes grupos',
          type: 'AUDITORIUM',
          capacity: 100,
          pricePerHour: 200.00,
          amenities: ['Sistema de Som', 'Projetor', 'Palco', 'Ar Condicionado', 'Wi-Fi'],
          available: true,
          floor: 'Térreo',
          location: 'Bloco C',
        },
        {
          id: 4,
          name: 'Sala de Treinamento',
          description: 'Sala configurável para workshops e treinamentos corporativos',
          type: 'TRAINING_ROOM',
          capacity: 20,
          pricePerHour: 90.00,
          amenities: ['Projetor', 'Quadro Branco', 'Wi-Fi', 'Mesas Móveis', 'Ar Condicionado'],
          available: true,
          floor: '2º Andar',
          location: 'Bloco A',
        },
        {
          id: 5,
          name: 'Sala Privativa Premium',
          description: 'Escritório privativo completamente equipado para trabalho focado',
          type: 'PRIVATE_OFFICE',
          capacity: 4,
          pricePerHour: 120.00,
          amenities: ['Wi-Fi', 'Mesa Executiva', 'Cadeiras Ergonômicas', 'Armário', 'Ar Condicionado'],
          available: true,
          floor: '3º Andar',
          location: 'Bloco B',
        },
        {
          id: 6,
          name: 'Sala de Conferência B',
          description: 'Sala de conferência com vista panorâmica e equipamentos de última geração',
          type: 'MEETING_ROOM',
          capacity: 15,
          pricePerHour: 95.00,
          amenities: ['TV 4K', 'Videoconferência', 'Wi-Fi', 'Quadro Interativo', 'Ar Condicionado'],
          available: false,
          floor: '4º Andar',
          location: 'Bloco A',
        },
      ],
      reservations: [
        {
          id: 1,
          spaceId: 1,
          spaceName: 'Sala de Reunião A',
          userId: 1,
          userName: 'Administrador',
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
          status: 'CONFIRMED',
          totalPrice: 150.00,
          notes: 'Reunião de planejamento',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          spaceId: 2,
          spaceName: 'Espaço de Coworking',
          userId: 1,
          userName: 'Administrador',
          startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
          status: 'CONFIRMED',
          totalPrice: 280.00,
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          spaceId: 3,
          spaceName: 'Auditório Principal',
          userId: 1,
          userName: 'Administrador',
          startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          totalPrice: 450.00,
          notes: 'Evento corporativo',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      notifications: [
        {
          id: 1,
          userId: 1,
          title: 'Reserva Confirmada',
          message: 'Sua reserva da Sala de Reunião A foi confirmada para amanhã às 14:00',
          type: 'success',
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          userId: 1,
          title: 'Lembrete',
          message: 'Você tem uma reserva no Espaço de Coworking em 3 dias',
          type: 'info',
          read: false,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          userId: 1,
          title: 'Novo Espaço Disponível',
          message: 'A Sala de Conferência Premium está agora disponível para reservas',
          type: 'info',
          read: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    };
  }

  private getDB(): Database {
    const stored = localStorage.getItem(this.DB_KEY);
    if (!stored) {
      const defaultDB = this.getDefaultDB();
      this.saveDB(defaultDB);
      return defaultDB;
    }
    return JSON.parse(stored);
  }

  private saveDB(db: Database): void {
    localStorage.setItem(this.DB_KEY, JSON.stringify(db));
  }

  // Users
  getUsers(): User[] {
    return this.getDB().users;
  }

  getUserById(id: number): User | undefined {
    return this.getDB().users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getDB().users.find(u => u.email === email);
  }

  updateUser(id: number, userData: Partial<User>): User {
    const db = this.getDB();
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex === -1) throw new Error('User not found');
    
    db.users[userIndex] = { ...db.users[userIndex], ...userData };
    this.saveDB(db);
    return db.users[userIndex];
  }

  createUser(userData: Omit<User, 'id'>): User {
    const db = this.getDB();
    const newUser: User = {
      ...userData,
      id: Math.max(0, ...db.users.map(u => u.id)) + 1,
    };
    db.users.push(newUser);
    this.saveDB(db);
    return newUser;
  }

  // Spaces
  getSpaces(): Space[] {
    return this.getDB().spaces;
  }

  getSpaceById(id: number): Space | undefined {
    return this.getDB().spaces.find(s => s.id === id);
  }

  createSpace(spaceData: Omit<Space, 'id'>): Space {
    const db = this.getDB();
    const newSpace: Space = {
      ...spaceData,
      id: Math.max(0, ...db.spaces.map(s => s.id)) + 1,
    };
    db.spaces.push(newSpace);
    this.saveDB(db);
    return newSpace;
  }

  updateSpace(id: number, spaceData: Partial<Space>): Space {
    const db = this.getDB();
    const spaceIndex = db.spaces.findIndex(s => s.id === id);
    if (spaceIndex === -1) throw new Error('Space not found');
    
    db.spaces[spaceIndex] = { ...db.spaces[spaceIndex], ...spaceData };
    this.saveDB(db);
    return db.spaces[spaceIndex];
  }

  deleteSpace(id: number): void {
    const db = this.getDB();
    db.spaces = db.spaces.filter(s => s.id !== id);
    this.saveDB(db);
  }

  // Reservations
  getReservations(): Reservation[] {
    return this.getDB().reservations;
  }

  getReservationById(id: number): Reservation | undefined {
    return this.getDB().reservations.find(r => r.id === id);
  }

  getReservationsByUserId(userId: number): Reservation[] {
    return this.getDB().reservations.filter(r => r.userId === userId);
  }

  createReservation(reservationData: Omit<Reservation, 'id'>): Reservation {
    const db = this.getDB();
    const newReservation: Reservation = {
      ...reservationData,
      id: Math.max(0, ...db.reservations.map(r => r.id)) + 1,
    };
    db.reservations.push(newReservation);
    this.saveDB(db);
    return newReservation;
  }

  updateReservation(id: number, reservationData: Partial<Reservation>): Reservation {
    const db = this.getDB();
    const reservationIndex = db.reservations.findIndex(r => r.id === id);
    if (reservationIndex === -1) throw new Error('Reservation not found');
    
    db.reservations[reservationIndex] = { ...db.reservations[reservationIndex], ...reservationData };
    this.saveDB(db);
    return db.reservations[reservationIndex];
  }

  // Notifications
  getNotifications(userId: number): Notification[] {
    return this.getDB().notifications.filter(n => n.userId === userId);
  }

  getUnreadNotifications(userId: number): Notification[] {
    return this.getDB().notifications.filter(n => n.userId === userId && !n.read);
  }

  createNotification(notificationData: Omit<Notification, 'id'>): Notification {
    const db = this.getDB();
    const newNotification: Notification = {
      ...notificationData,
      id: Math.max(0, ...db.notifications.map(n => n.id)) + 1,
    };
    db.notifications.push(newNotification);
    this.saveDB(db);
    return newNotification;
  }

  markNotificationAsRead(id: number): void {
    const db = this.getDB();
    const notification = db.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveDB(db);
    }
  }

  markAllNotificationsAsRead(userId: number): void {
    const db = this.getDB();
    db.notifications.forEach(n => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    this.saveDB(db);
  }

  deleteNotification(id: number): void {
    const db = this.getDB();
    db.notifications = db.notifications.filter(n => n.id !== id);
    this.saveDB(db);
  }

  clearAllNotifications(userId: number): void {
    const db = this.getDB();
    db.notifications = db.notifications.filter(n => n.userId !== userId);
    this.saveDB(db);
  }

  resetDatabase(): void {
    const defaultDB = this.getDefaultDB();
    this.saveDB(defaultDB);
  }
}

export default new StorageService();
