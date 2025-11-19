import { useState } from 'react';
import { Calendar } from '../components/ui/calendar';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
  reserved?: boolean;
}

interface ReservationCalendarProps {
  onDateSelect?: (date: Date) => void;
  onTimeSelect?: (time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

const timeSlots: TimeSlot[] = [
  { time: '08:00', available: true },
  { time: '09:00', available: true },
  { time: '10:00', available: false, reserved: true },
  { time: '11:00', available: true },
  { time: '12:00', available: false, reserved: true },
  { time: '13:00', available: true },
  { time: '14:00', available: true },
  { time: '15:00', available: false, reserved: true },
  { time: '16:00', available: true },
  { time: '17:00', available: true },
  { time: '18:00', available: true },
  { time: '19:00', available: false, reserved: true },
];

export function ReservationCalendar({
  onDateSelect,
  onTimeSelect,
  selectedDate,
  selectedTime,
}: ReservationCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate && onDateSelect) {
      onDateSelect(newDate);
    }
  };

  const handleTimeSelect = (time: string) => {
    if (onTimeSelect) {
      onTimeSelect(time);
    }
  };

  // Mock function to determine if a date has reservations
  const getDayStatus = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (day < today) {
      return 'past';
    }
    
    // Mock: every 3rd and 7th day has reservations
    const dayOfMonth = day.getDate();
    if (dayOfMonth % 3 === 0) {
      return 'busy';
    }
    if (dayOfMonth % 7 === 0) {
      return 'partial';
    }
    return 'available';
  };

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <h3 className="text-gray-900 dark:text-white mb-2">Selecione uma Data</h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 border-2 border-green-500" />
              <span className="text-gray-600 dark:text-gray-400">Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400">Parcialmente Ocupado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 border-2 border-red-500" />
              <span className="text-gray-600 dark:text-gray-400">Ocupado</span>
            </div>
          </div>
        </div>
        
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date()}
          className="rounded-md border-0"
          modifiers={{
            busy: (day) => getDayStatus(day) === 'busy',
            partial: (day) => getDayStatus(day) === 'partial',
            available: (day) => getDayStatus(day) === 'available',
          }}
          modifiersClassNames={{
            busy: 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50',
            partial: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50',
            available: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30',
          }}
        />
      </Card>

      {/* Time Slots */}
      {date && (
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-white mb-4">
            Horários Disponíveis - {date.toLocaleDateString('pt-BR')}
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {timeSlots.map((slot) => (
              <Button
                key={slot.time}
                onClick={() => handleTimeSelect(slot.time)}
                disabled={!slot.available}
                variant={selectedTime === slot.time ? 'default' : 'outline'}
                className={`
                  relative h-auto py-3 px-4 flex flex-col items-center gap-1
                  transition-all duration-200 hover:scale-105
                  ${!slot.available 
                    ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' 
                    : 'hover:shadow-md'
                  }
                  ${selectedTime === slot.time 
                    ? 'ring-2 ring-blue-500 ring-offset-2' 
                    : ''
                  }
                `}
              >
                <Clock className="w-4 h-4" />
                <span className="font-medium">{slot.time}</span>
                {slot.available ? (
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-500" />
                )}
              </Button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p className="font-medium mb-1">Informações Importantes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Cada reserva tem duração mínima de 1 hora</li>
                  <li>Horários em vermelho já estão ocupados</li>
                  <li>Você pode cancelar até 24h antes do horário reservado</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Status Summary */}
      {date && (
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-white mb-4">Status do Dia</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-2xl mb-1">
                {timeSlots.filter((s) => s.available).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Disponíveis</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="text-2xl mb-1">
                {timeSlots.filter((s) => !s.available).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ocupados</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-2xl mb-1">
                {timeSlots.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
