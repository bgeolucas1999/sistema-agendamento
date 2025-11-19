import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import SpaceCard from '../components/spaces/SpaceCard';
import SpaceFilter, { FilterValues } from '../components/spaces/SpaceFilter';
import ReservationForm from '../components/reservations/ReservationForm';
import Loading from '../components/common/Loading';
import spaceService, { Space } from '../services/spaceService';
import reservationService, { ReservationDTO } from '../services/reservationService';
import { toast } from 'sonner@2.0.3';

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [filteredSpaces, setFilteredSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [reservationLoading, setReservationLoading] = useState(false);

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    setLoading(true);
    try {
      const data = await spaceService.getAllSpaces();
      setSpaces(data);
      setFilteredSpaces(data);
    } catch (error) {
      toast.error('Erro ao carregar espaços');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters: FilterValues) => {
    let filtered = [...spaces];

    if (filters.search) {
      filtered = filtered.filter(
        (space) =>
          space.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          space.description.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter((space) => space.type === filters.type);
    }

    if (filters.minCapacity) {
      filtered = filtered.filter((space) => space.capacity >= filters.minCapacity!);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((space) => space.pricePerHour <= filters.maxPrice!);
    }

    setFilteredSpaces(filtered);
  };

  const handleResetFilter = () => {
    setFilteredSpaces(spaces);
  };

  const handleReserve = (space: Space) => {
    setSelectedSpace(space);
    setReservationModalOpen(true);
  };

  const handleReservationSubmit = async (reservation: ReservationDTO) => {
    setReservationLoading(true);
    try {
      await reservationService.createReservation(reservation);
      toast.success('Reserva criada com sucesso!');
      setReservationModalOpen(false);
      loadSpaces(); // Reload to update availability
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao criar reserva');
    } finally {
      setReservationLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-gray-900 dark:text-white">Espaços Disponíveis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Encontre o espaço perfeito para suas necessidades
          </p>
        </div>

        <SpaceFilter onFilter={handleFilter} onReset={handleResetFilter} />

        {filteredSpaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum espaço encontrado com os filtros aplicados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => (
              <SpaceCard key={space.id} space={space} onReserve={handleReserve} />
            ))}
          </div>
        )}
      </div>

      <ReservationForm
        open={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
        onSubmit={handleReservationSubmit}
        space={selectedSpace}
        loading={reservationLoading}
      />
    </Layout>
  );
}