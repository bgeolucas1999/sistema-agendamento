import { useTheme } from '../contexts/ThemeContext';

export function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { colors, backgroundType, transparency, mode } = theme;

  const getBackgroundStyle = () => {
    const alpha = transparency;
    
    if (backgroundType === 'solid') {
      return mode === 'dark' 
        ? 'bg-gray-900'
        : 'bg-blue-50';
    }
    
    if (backgroundType === 'gradient') {
      const primary = hexToRgb(colors.primary);
      const secondary = hexToRgb(colors.secondary);
      return {
        background: mode === 'dark'
          ? `linear-gradient(135deg, rgba(17, 24, 39, ${alpha}) 0%, rgba(${primary}, ${alpha * 0.5}) 50%, rgba(${secondary}, ${alpha * 0.5}) 100%)`
          : `linear-gradient(135deg, rgba(${primary}, ${alpha * 0.3}) 0%, rgba(239, 246, 255, ${alpha}) 50%, rgba(${secondary}, ${alpha * 0.3}) 100%)`,
      };
    }
    
    if (backgroundType === 'mesh') {
      const primary = hexToRgb(colors.primary);
      const secondary = hexToRgb(colors.secondary);
      const accent = hexToRgb(colors.accent);
      return {
        background: mode === 'dark'
          ? `radial-gradient(at 0% 0%, rgba(${primary}, ${alpha * 0.5}) 0px, transparent 50%),
             radial-gradient(at 100% 0%, rgba(${secondary}, ${alpha * 0.5}) 0px, transparent 50%),
             radial-gradient(at 100% 100%, rgba(${accent}, ${alpha * 0.5}) 0px, transparent 50%),
             radial-gradient(at 0% 100%, rgba(${primary}, ${alpha * 0.4}) 0px, transparent 50%),
             rgb(17, 24, 39)`
          : `radial-gradient(at 0% 0%, rgba(${primary}, ${alpha * 0.4}) 0px, transparent 50%),
             radial-gradient(at 100% 0%, rgba(${secondary}, ${alpha * 0.4}) 0px, transparent 50%),
             radial-gradient(at 100% 100%, rgba(${accent}, ${alpha * 0.4}) 0px, transparent 50%),
             radial-gradient(at 0% 100%, rgba(${primary}, ${alpha * 0.3}) 0px, transparent 50%),
             rgb(239, 246, 255)`,
      };
    }
  };

  const backgroundStyle = getBackgroundStyle();

  return (
    <div 
      className={typeof backgroundStyle === 'string' ? backgroundStyle : ''}
      style={typeof backgroundStyle === 'object' ? backgroundStyle : undefined}
    >
      {children}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '59, 130, 246';
}