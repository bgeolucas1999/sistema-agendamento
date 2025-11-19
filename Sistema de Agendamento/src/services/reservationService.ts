import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export interface Reservation {
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

export interface ReservationDTO {
  spaceId: number;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface ReservationFilter {
  spaceId?: number;
  userId?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

class ReservationService {
  // Mock data for testing without backend
  private mockReservations: Reservation[] = [
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
  ];

  async getAllReservations(filter?: ReservationFilter): Promise<Reservation[]> {
    try {
      return await api.get<Reservation[]>(API_ENDPOINTS.RESERVATIONS.BASE, {
        params: filter,
      });
    } catch (error) {
      // Propagate error so UI can show it — returning mock silently hides backend failures
      console.error('Failed to fetch reservations from backend', error);
      throw error;
    }
  }

  async getMyReservations(): Promise<Reservation[]> {
    try {
      return await api.get<Reservation[]>(API_ENDPOINTS.RESERVATIONS.MY_RESERVATIONS);
    } catch (error) {
      console.error('Failed to fetch my reservations', error);
      throw error;
    }
  }

  async getReservationById(id: number): Promise<Reservation> {
    try {
      return await api.get<Reservation>(API_ENDPOINTS.RESERVATIONS.BY_ID(id));
    } catch (error) {
      console.error('Failed to fetch reservation by id', error);
      throw error;
    }
  }

  async createReservation(reservationData: ReservationDTO): Promise<Reservation> {
    try {
      return await api.post<Reservation>(API_ENDPOINTS.RESERVATIONS.BASE, reservationData);
    } catch (error) {
      console.error('Failed to create reservation', error);
      throw error;
    }
  }

  async cancelReservation(id: number): Promise<void> {
    try {
      return await api.post<void>(API_ENDPOINTS.RESERVATIONS.CANCEL(id));
    } catch (error) {
      console.error('Failed to cancel reservation', error);
      throw error;
    }
  }

  async updateReservation(id: number, reservationData: Partial<ReservationDTO>): Promise<Reservation> {
    try {
      return await api.put<Reservation>(API_ENDPOINTS.RESERVATIONS.BY_ID(id), reservationData);
    } catch (error) {
      console.error('Failed to update reservation', error);
      throw error;
    }
  }
}

export default new ReservationService();