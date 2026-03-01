import { Colors } from '@/constants/theme';

describe('Theme Colors', () => {
  it('has light and dark color schemes', () => {
    expect(Colors.light).toBeDefined();
    expect(Colors.dark).toBeDefined();
  });

  it('has matching keys in light and dark schemes', () => {
    const lightKeys = Object.keys(Colors.light).sort((a, b) => a.localeCompare(b));
    const darkKeys = Object.keys(Colors.dark).sort((a, b) => a.localeCompare(b));
    expect(lightKeys).toEqual(darkKeys);
  });

  it('has valid hex color values', () => {
    const hexRegex = /^#[0-9A-Fa-f]{3,8}$/;
    for (const color of Object.values(Colors.light)) {
      expect(color).toMatch(hexRegex);
    }
    for (const color of Object.values(Colors.dark)) {
      expect(color).toMatch(hexRegex);
    }
  });
});
