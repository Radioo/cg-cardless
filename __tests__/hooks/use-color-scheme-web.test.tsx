describe('useColorScheme (web)', () => {
  it('exports a useColorScheme function', () => {
    const mod = require('@/hooks/use-color-scheme.web');
    expect(typeof mod.useColorScheme).toBe('function');
  });
});
