import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Palette, Sparkles, RefreshCw } from 'lucide-react';

const colorPresets = [
  { name: 'Azul', primary: '#3b82f6', secondary: '#8b5cf6', accent: '#06b6d4' },
  { name: 'Verde', primary: '#10b981', secondary: '#059669', accent: '#14b8a6' },
  { name: 'Roxo', primary: '#8b5cf6', secondary: '#a855f7', accent: '#ec4899' },
  { name: 'Laranja', primary: '#f97316', secondary: '#fb923c', accent: '#fbbf24' },
  { name: 'Rosa', primary: '#ec4899', secondary: '#f472b6', accent: '#fb7185' },
  { name: 'Ciano', primary: '#06b6d4', secondary: '#0891b2', accent: '#14b8a6' },
];

export default function SettingsPage() {
  const { theme, setThemeMode, setBackgroundType, setColors, setTransparency, resetTheme } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState(0);

  const handlePresetSelect = (index: number) => {
    setSelectedPreset(index);
    setColors(colorPresets[index]);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-gray-900 dark:text-white">Configurações</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Personalize a aparência da sua aplicação
          </p>
        </div>

        {/* Theme Mode */}
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-gray-900 dark:text-white">Modo de Tema</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setThemeMode('light')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme.mode === 'light'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-gray-900 dark:text-white">Claro</p>
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme.mode === 'dark'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Moon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-gray-900 dark:text-white">Escuro</p>
              </button>
            </div>
          </div>
        </Card>

        {/* Background Type */}
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-gray-900 dark:text-white">Tipo de Fundo</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setBackgroundType('solid')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme.backgroundType === 'solid'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="w-full h-16 rounded bg-blue-100 dark:bg-gray-700 mb-2" />
                <p className="text-gray-900 dark:text-white">Sólido</p>
              </button>
              <button
                onClick={() => setBackgroundType('gradient')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme.backgroundType === 'gradient'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="w-full h-16 rounded bg-gradient-to-br from-blue-400 to-purple-500 mb-2" />
                <p className="text-gray-900 dark:text-white">Gradiente</p>
              </button>
              <button
                onClick={() => setBackgroundType('mesh')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme.backgroundType === 'mesh'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="w-full h-16 rounded bg-gradient-to-br from-blue-400 via-purple-400 to-cyan-400 mb-2" />
                <p className="text-gray-900 dark:text-white">Mesh</p>
              </button>
            </div>
          </div>
        </Card>

        {/* Color Presets */}
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <h2 className="text-gray-900 dark:text-white">Esquema de Cores</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {colorPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetSelect(index)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPreset === index
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex gap-2 mb-2">
                    <div 
                      className="w-8 h-8 rounded" 
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-8 h-8 rounded" 
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div 
                      className="w-8 h-8 rounded" 
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <p className="text-gray-900 dark:text-white">{preset.name}</p>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Transparency */}
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <Label className="text-gray-900 dark:text-white">
              Transparência dos Efeitos: {Math.round(theme.transparency * 100)}%
            </Label>
            <Slider
              value={[theme.transparency * 100]}
              onValueChange={(value) => setTransparency(value[0] / 100)}
              min={50}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </Card>

        {/* Reset */}
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
          <Button
            onClick={resetTheme}
            variant="outline"
            className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Restaurar Padrão
          </Button>
        </Card>
      </div>
    </Layout>
  );
}
