import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Space } from '../services/spaceService';
import { Building2, Users, DollarSign, MapPin, Layers, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface SpaceDetailsDialogProps {
  space: Space | null;
  open: boolean;
  onClose: () => void;
  onReserve?: (space: Space) => void;
}

export function SpaceDetailsDialog({ space, open, onClose, onReserve }: SpaceDetailsDialogProps) {
  if (!space) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white text-2xl">
            {space.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {space.available ? (
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Disponível
              </Badge>
            ) : (
              <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                Indisponível
              </Badge>
            )}
            <Badge variant="outline" className="border-gray-300 dark:border-gray-600">
              {space.type}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-gray-900 dark:text-white mb-2">Descrição</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {space.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Capacidade</span>
              </div>
              <p className="text-2xl text-gray-900 dark:text-white">
                {space.capacity} pessoas
              </p>
            </div>

            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Preço/Hora</span>
              </div>
              <p className="text-2xl text-gray-900 dark:text-white">
                {formatCurrency(space.pricePerHour)}
              </p>
            </div>

            {space.location && (
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Localização</span>
                </div>
                <p className="text-gray-900 dark:text-white">
                  {space.location}
                </p>
              </div>
            )}

            {space.floor && (
              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Andar</span>
                </div>
                <p className="text-gray-900 dark:text-white">
                  {space.floor}
                </p>
              </div>
            )}
          </div>

          {/* Amenities */}
          {space.amenities && space.amenities.length > 0 && (
            <div>
              <h3 className="text-gray-900 dark:text-white mb-3">Comodidades</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {space.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 dark:border-gray-600"
            >
              Fechar
            </Button>
            {space.available && onReserve && (
              <Button
                onClick={() => {
                  onReserve(space);
                  onClose();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Reservar Espaço
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
