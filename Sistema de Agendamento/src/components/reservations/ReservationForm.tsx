import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Space } from '../../services/spaceService';
import { ReservationDTO } from '../../services/reservationService';
import Calendar from './Calendar';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

interface ReservationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reservation: ReservationDTO) => void;
  space: Space | null;
  loading?: boolean;
}

export default function ReservationForm({ open, onClose, onSubmit, space, loading }: ReservationFormProps) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    if (open) {
      // Load user data from auth context or localStorage
      if (user) {
        setUserEmail(user.email || '');
        setUserName(user.name || '');
      } else {
        // Fallback to localStorage if auth context not available
        const userData = localStorage.getItem('userData');
        if (userData) {
          try {
            const storedUser = JSON.parse(userData);
            setUserEmail(storedUser.email || '');
            setUserName(storedUser.name || '');
          } catch (e) {
            // Silently fail - use defaults
          }
        }
      }
    } else {
      // Reset form when dialog closes
      setSelectedDate(new Date());
      setStartTime('09:00');
      setEndTime('10:00');
      setNotes('');
      setUserName('');
      setUserEmail('');
      setUserPhone('');
    }
  }, [open, user]);

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

  const handleSubmit = () => {
    if (!space) return;

    if (!userName || !userEmail) {
      return; // Form validation will prevent submission
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const startDateTime = `${dateStr}T${startTime}:00`;
    const endDateTime = `${dateStr}T${endTime}:00`;

    const reservation: ReservationDTO = {
      spaceId: space.id,
      userName: userName,
      userEmail: userEmail,
      userPhone: userPhone || undefined,
      startTime: startDateTime,
      endTime: endDateTime,
      notes: notes || undefined,
    };

    onSubmit(reservation);
  };

  const isValidTimeRange = () => {
    return endTime > startTime;
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeStr);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();
  const duration = calculateDuration();
  const totalPrice = calculateTotalPrice();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Reserva - {space?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Nome completo</Label>
              <input
                id="userName"
                type="text"
                placeholder="Seu nome"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <input
                id="userEmail"
                type="email"
                placeholder="seu.email@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userPhone">Telefone (opcional)</Label>
            <input
              id="userPhone"
              type="tel"
              placeholder="(11) 98765-4321"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label className="mb-2 block">Selecione a data</Label>
            <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Horário de início</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Horário de término</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {!isValidTimeRange() && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              O horário de término deve ser posterior ao horário de início
            </div>
          )}

          {isValidTimeRange() && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duração:</span>
                <span>{duration.toFixed(1)} horas</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Preço por hora:</span>
                <span>{formatCurrency(space?.pricePerHour || 0)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-100">
                <span>Total:</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione observações sobre a reserva..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValidTimeRange() || loading || !userName || !userEmail}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Confirmando...' : 'Confirmar Reserva'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
