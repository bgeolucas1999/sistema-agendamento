import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import SpaceCard from '../components/spaces/SpaceCard';
import Loading from '../components/common/Loading';
import spaceService, { Space, SpaceDTO } from '../services/spaceService';
import reservationService, { Reservation } from '../services/reservationService';
import { Plus, Building2, Calendar } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { SPACE_TYPES } from '../utils/constants';
import { formatDateTime, formatCurrency } from '../utils/helpers';

export default function AdminPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [spaceModalOpen, setSpaceModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState<SpaceDTO>({
    name: '',
    description: '',
    type: 'DESK',
    capacity: 1,
    pricePerHour: 0,
    amenities: [],
    imageUrl: '',
    floor: '',
    location: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [spacesData, reservationsData] = await Promise.all([
        spaceService.getAllSpaces(),
        reservationService.getAllReservations(),
      ]);
      setSpaces(spacesData);
      setReservations(reservationsData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingSpace(null);
    setFormData({
      name: '',
      description: '',
      type: 'DESK',
      capacity: 1,
      pricePerHour: 0,
      amenities: [],
      imageUrl: '',
      floor: '',
      location: '',
    });
    setSpaceModalOpen(true);
  };

  const handleOpenEditModal = (space: Space) => {
    setEditingSpace(space);
    setFormData({
      name: space.name,
      description: space.description,
      type: space.type,
      capacity: space.capacity,
      pricePerHour: space.pricePerHour,
      amenities: space.amenities,
      imageUrl: space.imageUrl || '',
      floor: space.floor || '',
      location: space.location || '',
    });
    setSpaceModalOpen(true);
  };

  const handleFormChange = (field: keyof SpaceDTO, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingSpace) {
        await spaceService.updateSpace(editingSpace.id, formData);
        toast.success('Espaço atualizado com sucesso');
      } else {
        await spaceService.createSpace(formData);
        toast.success('Espaço criado com sucesso');
      }
      setSpaceModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao salvar espaço');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (space: Space) => {
    if (!confirm('Tem certeza que deseja excluir este espaço?')) return;

    try {
      await spaceService.deleteSpace(space.id);
      toast.success('Espaço excluído com sucesso');
      loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao excluir espaço');
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
          <h1 className="text-gray-900 dark:text-white">Administração</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie espaços e reservas</p>
        </div>

        <Tabs defaultValue="spaces" className="space-y-6">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="spaces">
              <Building2 className="w-4 h-4 mr-2" />
              Espaços
            </TabsTrigger>
            <TabsTrigger value="reservations">
              <Calendar className="w-4 h-4 mr-2" />
              Reservas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spaces" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl">Gerenciar Espaços</h2>
              <Button onClick={handleOpenCreateModal} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Espaço
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDelete}
                  isAdmin
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reservations" className="space-y-4">
            <h2 className="text-xl">Todas as Reservas</h2>
            {reservations.length === 0 ? (
              <Card className="border-blue-100">
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Nenhuma reserva encontrada</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <Card key={reservation.id} className="border-blue-100">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Espaço</p>
                          <p>{reservation.spaceName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Usuário</p>
                          <p>{reservation.userName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Data/Hora</p>
                          <p className="text-sm">{formatDateTime(reservation.startTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Valor</p>
                          <p>{formatCurrency(reservation.totalPrice)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Space Form Modal */}
      <Dialog open={spaceModalOpen} onOpenChange={setSpaceModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {editingSpace ? 'Editar Espaço' : 'Novo Espaço'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Espaço *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select value={formData.type} onValueChange={(value) => handleFormChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPACE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidade *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => handleFormChange('capacity', parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerHour">Preço por Hora (R$) *</Label>
                <Input
                  id="pricePerHour"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pricePerHour}
                  onChange={(e) => handleFormChange('pricePerHour', parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  placeholder="Ex: Prédio A, Sala 101"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">Andar</Label>
                <Input
                  id="floor"
                  value={formData.floor}
                  onChange={(e) => handleFormChange('floor', e.target.value)}
                  placeholder="Ex: 3º andar"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleFormChange('imageUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSpaceModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={formLoading} className="bg-blue-600 hover:bg-blue-700">
                {formLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}