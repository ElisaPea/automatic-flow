import { useWindowDimensions } from 'react-native';

export const TABLET_MIN_WIDTH = 768;

/** Permite adaptar layouts entre móvil y tablet (y rotación). */
export const useBreakpoint = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  return { width, isTablet, isPhone: !isTablet };
};
