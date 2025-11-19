import { Space } from '../../services/spaceService';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users, MapPin, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface SpaceCardProps {
  space: Space;
  onReserve?: (space: Space) => void;
  onEdit?: (space: Space) => void;
  onDelete?: (space: Space) => void;
  isAdmin?: boolean;
}

export default function SpaceCard({ space, onReserve, onEdit, onDelete, isAdmin }: SpaceCardProps) {
  const getSpaceTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      DESK: 'Mesa Individual',
      MEETING_ROOM: 'Sala de Reunião',
      PRIVATE_OFFICE: 'Escritório Privado',
      EVENT_SPACE: 'Espaço para Eventos',
      COWORKING: 'Coworking',
    };
    return types[type] || type;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-blue-100">
      <div className="aspect-video relative bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden">
        {space.imageUrl ? (
          <ImageWithFallback
            src={space.imageUrl}
            alt={space.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-blue-300" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className={space.available ? 'bg-green-500' : 'bg-red-500'}>
            {space.available ? 'Disponível' : 'Indisponível'}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="mb-1">{space.name}</h3>
            <Badge variant="outline" className="text-xs">
              {getSpaceTypeLabel(space.type)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{space.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              {space.capacity} pessoas
            </div>
            <div className="flex items-center text-blue-600">
              <DollarSign className="w-4 h-4" />
              <span>{formatCurrency(space.pricePerHour)}/hora</span>
            </div>
          </div>
          {space.location && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              {space.location}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {isAdmin ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(space)}
              className="flex-1"
            >
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(space)}
              className="flex-1 text-red-600 hover:text-red-700"
            >
              Excluir
            </Button>
          </>
        ) : (
          <Button
            onClick={() => onReserve?.(space)}
            disabled={!space.available}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            {space.available ? 'Reservar' : 'Indisponível'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
