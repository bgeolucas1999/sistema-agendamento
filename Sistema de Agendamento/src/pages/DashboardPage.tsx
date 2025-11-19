import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Building2, Calendar, Clock, TrendingUp, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import reservationService, { Reservation } from '../services/reservationService';
import spaceService, { Space } from '../services/spaceService';
import { SpaceDetailsDialog } from '../components/SpaceDetailsDialog';
import Loading from '../components/common/Loading';
import { formatDateTime } from '../utils/helpers';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [spaceDetailsOpen, setSpaceDetailsOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [reservationsData, spacesData] = await Promise.all([
        reservationService.getMyReservations(),
        spaceService.getAllSpaces(),
      ]);
      setReservations(reservationsData);
      setSpaces(spacesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingReservations = reservations
    .filter((r) => r.status === 'CONFIRMED' && new Date(r.startTime) > new Date())
    .slice(0, 3);

  const stats = [
    {
      title: 'Espaços Disponíveis',
      value: spaces.filter((s) => s.available).length,
      icon: Building2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Minhas Reservas',
      value: reservations.filter((r) => r.status === 'CONFIRMED').length,
      icon: Calendar,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Próximas Reservas',
      value: upcomingReservations.length,
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Taxa de Ocupação',
      value: '87%',
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

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
          <h1 className="text-gray-900 dark:text-white">Bem-vindo de volta, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Aqui está um resumo das suas atividades
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                      <p className="text-2xl text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Reservations */}
          <Card className="border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
                Próximas Reservas
                <Link to="/reservations">
                  <Button variant="ghost" size="sm">
                    Ver todas
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingReservations.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p>Você não tem reservas próximas</p>
                  <Link to="/spaces">
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                      Explorar Espaços
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-sm text-gray-900 dark:text-white">{reservation.spaceName}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {formatDateTime(reservation.startTime)}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded">
                          Confirmada
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Spaces */}
          <Card className="border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
                Espaços Disponíveis
                <Link to="/spaces">
                  <Button variant="ghost" size="sm">
                    Ver todos
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {spaces.slice(0, 5).map((space) => (
                  <div
                    key={space.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedSpace(space);
                      setSpaceDetailsOpen(true);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{space.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Capacidade: {space.capacity} pessoas
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpace(space);
                        setSpaceDetailsOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Space Details Dialog */}
      <SpaceDetailsDialog
        space={selectedSpace}
        open={spaceDetailsOpen}
        onClose={() => setSpaceDetailsOpen(false)}
        onReserve={(space) => {
          navigate('/spaces');
        }}
      />
    </Layout>
  );
}