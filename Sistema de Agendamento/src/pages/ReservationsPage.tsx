import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ReservationCalendar } from '../components/ReservationCalendar';
import Loading from '../components/common/Loading';
import reservationService, { Reservation } from '../services/reservationService';
import { formatDateTime, formatCurrency } from '../utils/helpers';
import { Calendar, Clock, MapPin, X, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await reservationService.getMyReservations();
      setReservations(data);
    } catch (error) {
      toast.error('Erro ao carregar reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedReservation) return;

    setCancelLoading(true);
    try {
      await reservationService.cancelReservation(selectedReservation.id);
      toast.success('Reserva cancelada com sucesso');
      setCancelDialogOpen(false);
      loadReservations();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao cancelar reserva');
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { label: string; className: string } } = {
      PENDING: { label: 'Pendente', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
      CONFIRMED: { label: 'Confirmada', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
      CANCELLED: { label: 'Cancelada', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
      COMPLETED: { label: 'Concluída', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    };
    const config = statusConfig[status] || { label: status, className: '' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const upcomingReservations = reservations.filter(
    (r) => r.status === 'CONFIRMED' && new Date(r.startTime) > new Date()
  );

  const pastReservations = reservations.filter(
    (r) => r.status === 'COMPLETED' || (r.status === 'CONFIRMED' && new Date(r.startTime) < new Date())
  );

  const cancelledReservations = reservations.filter((r) => r.status === 'CANCELLED');

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
    const isPast = new Date(reservation.startTime) < new Date();
    const canCancel = reservation.status === 'CONFIRMED' && !isPast;

    return (
      <Card className="border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-[1.02]">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mb-1 text-gray-900 dark:text-white">{reservation.spaceName}</h3>
                  {getStatusBadge(reservation.status)}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDateTime(reservation.startTime)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  até {formatDateTime(reservation.endTime)}
                </div>
                <div className="flex items-center">
                  <span className="mr-2">💰</span>
                  {formatCurrency(reservation.totalPrice)}
                </div>
              </div>

              {reservation.notes && (
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <span>Observações: </span>
                  {reservation.notes}
                </div>
              )}
            </div>

            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancelClick(reservation)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 transition-all hover:scale-105"
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-gray-900 dark:text-white">Minhas Reservas</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gerencie todas as suas reservas em um só lugar
            </p>
          </div>
          <Button 
            onClick={() => setCalendarDialogOpen(true)}
            className="transition-all hover:scale-105 shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Reserva
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <TabsTrigger 
              value="upcoming"
              className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 transition-all"
            >
              <span className="flex items-center gap-2">
                Próximas
                <Badge variant="secondary" className="ml-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {upcomingReservations.length}
                </Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="past"
              className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 transition-all"
            >
              <span className="flex items-center gap-2">
                Passadas
                <Badge variant="secondary" className="ml-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {pastReservations.length}
                </Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="cancelled"
              className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 transition-all"
            >
              <span className="flex items-center gap-2">
                Canceladas
                <Badge variant="secondary" className="ml-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                  {cancelledReservations.length}
                </Badge>
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingReservations.length === 0 ? (
              <Card className="border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400">Você não tem reservas próximas</p>
                  <Button 
                    onClick={() => setCalendarDialogOpen(true)} 
                    className="mt-4"
                  >
                    Fazer uma Reserva
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastReservations.length === 0 ? (
              <Card className="border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400">Você não tem reservas passadas</p>
                </CardContent>
              </Card>
            ) : (
              pastReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledReservations.length === 0 ? (
              <Card className="border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <X className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400">Você não tem reservas canceladas</p>
                </CardContent>
              </Card>
            ) : (
              cancelledReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Calendar Dialog */}
      <Dialog open={calendarDialogOpen} onOpenChange={setCalendarDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Selecionar Data e Horário
            </DialogTitle>
          </DialogHeader>
          <ReservationCalendar
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
          />
          {selectedDate && selectedTime && (
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setCalendarDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => {
                toast.success('Reserva criada! (Demo)');
                setCalendarDialogOpen(false);
              }}>
                Confirmar Reserva
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">
              Cancelar Reserva
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 dark:border-gray-600">
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              disabled={cancelLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {cancelLoading ? 'Cancelando...' : 'Confirmar Cancelamento'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}