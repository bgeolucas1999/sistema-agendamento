import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export interface Space {
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

export interface SpaceDTO {
  name: string;
  description: string;
  type: string;
  capacity: number;
  pricePerHour: number;
  amenities: string[];
  imageUrl?: string;
  floor?: string;
  location?: string;
}

export interface SpaceFilter {
  type?: string;
  minCapacity?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  amenities?: string[];
}

class SpaceService {
  // Mock data for testing without backend
  private mockSpaces: Space[] = [
    {
      id: 1,
      name: 'Sala de Reunião A',
      description: 'Sala moderna equipada com projetor, quadro branco e sistema de videoconferência',
      type: 'MEETING_ROOM',
      capacity: 10,
      pricePerHour: 75.00,
      amenities: ['Projetor', 'Quadro Branco', 'Wi-Fi', 'Ar Condicionado', 'Videoconferência'],
      available: true,
      floor: '2º Andar',
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
  ];

  async getAllSpaces(): Promise<Space[]> {
    return await api.get<Space[]>(API_ENDPOINTS.SPACES.BASE);
  }

  async getSpaceById(id: number): Promise<Space> {
    return await api.get<Space>(API_ENDPOINTS.SPACES.BY_ID(id));
  }

  async getAvailableSpaces(filter?: SpaceFilter): Promise<Space[]> {
    return await api.get<Space[]>(API_ENDPOINTS.SPACES.AVAILABLE, {
      params: filter,
    });
  }

  async createSpace(spaceData: SpaceDTO): Promise<Space> {
    try {
      return await api.post<Space>(API_ENDPOINTS.SPACES.BASE, spaceData);
    } catch (error) {
      // Create mock space if backend is not available
      const newSpace: Space = {
        id: this.mockSpaces.length + 1,
        ...spaceData,
        available: true,
      };
      this.mockSpaces.push(newSpace);
      return newSpace;
    }
  }

  async updateSpace(id: number, spaceData: Partial<SpaceDTO>): Promise<Space> {
    try {
      return await api.put<Space>(API_ENDPOINTS.SPACES.BY_ID(id), spaceData);
    } catch (error) {
      // Update mock data if backend is not available
      const space = this.mockSpaces.find(s => s.id === id);
      if (!space) {
        throw new Error('Space not found');
      }
      Object.assign(space, spaceData);
      return space;
    }
  }

  async deleteSpace(id: number): Promise<void> {
    try {
      return await api.delete<void>(API_ENDPOINTS.SPACES.BY_ID(id));
    } catch (error) {
      // Delete from mock data if backend is not available
      const index = this.mockSpaces.findIndex(s => s.id === id);
      if (index !== -1) {
        this.mockSpaces.splice(index, 1);
      }
    }
  }
}

export default new SpaceService();