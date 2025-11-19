import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Filter, X } from 'lucide-react';
import { SPACE_TYPES } from '../../utils/constants';

interface SpaceFilterProps {
  onFilter: (filters: FilterValues) => void;
  onReset: () => void;
}

export interface FilterValues {
  type?: string;
  minCapacity?: number;
  maxPrice?: number;
  search?: string;
}

export default function SpaceFilter({ onFilter, onReset }: SpaceFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const handleResetFilters = () => {
    setFilters({});
    onReset();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar espaços..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:w-auto"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Ocultar Filtros' : 'Filtros'}
        </Button>
      </div>

      {showFilters && (
        <Card className="border-blue-100">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Espaço</Label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => handleFilterChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {SPACE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Capacidade Mínima</Label>
                <Input
                  type="number"
                  placeholder="Ex: 4"
                  value={filters.minCapacity || ''}
                  onChange={(e) => handleFilterChange('minCapacity', parseInt(e.target.value))}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label>Preço Máximo (R$/hora)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 100"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex items-end gap-2">
                <Button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Aplicar
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
