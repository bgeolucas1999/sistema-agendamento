import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarProps {
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  reservedDates?: Date[];
}

export default function Calendar({ selectedDate, onSelectDate, reservedDates = [] }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate offset for first day of month
  const firstDayOfWeek = monthStart.getDay();
  const offset = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const isDateReserved = (date: Date) => {
    return reservedDates.some(reserved => isSameDay(reserved, date));
  };

  const handleDateClick = (date: Date) => {
    if (date < new Date() && !isSameDay(date, new Date())) {
      return; // Don't allow selecting past dates
    }
    onSelectDate(date);
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="rounded-[0px]">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm text-gray-500 py-2">
              {day}
            </div>
          ))}
          {offset.map((i) => (
            <div key={`offset-${i}`} />
          ))}
          {daysInMonth.map((day) => {
            const isPast = day < new Date() && !isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isReserved = isDateReserved(day);
            const isTodayDate = isToday(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                disabled={isPast}
                className={`
                  aspect-square rounded-lg text-sm transition-all
                  flex items-center justify-center
                  ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50'}
                  ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                  ${isTodayDate && !isSelected ? 'bg-blue-50 text-blue-600' : ''}
                  ${isReserved && !isSelected ? 'bg-red-50 text-red-600' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded" />
            <span className="text-gray-600">Selecionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 rounded" />
            <span className="text-gray-600">Hoje</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 rounded" />
            <span className="text-gray-600">Reservado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}