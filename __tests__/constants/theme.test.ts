const { NAV_THEME } = jest.requireActual<typeof import('@/constants/theme')>('@/constants/theme');

describe('NAV_THEME', () => {
    it('has light and dark themes', () => {
        expect(NAV_THEME.light).toBeDefined();
        expect(NAV_THEME.dark).toBeDefined();
    });

    it('light theme has required navigation colors', () => {
        expect(NAV_THEME.light.background).toBeDefined();
        expect(NAV_THEME.light.text).toBeDefined();
        expect(NAV_THEME.light.primary).toBeDefined();
        expect(NAV_THEME.light.border).toBeDefined();
    });

    it('dark theme has required navigation colors', () => {
        expect(NAV_THEME.dark.background).toBeDefined();
        expect(NAV_THEME.dark.text).toBeDefined();
        expect(NAV_THEME.dark.primary).toBeDefined();
        expect(NAV_THEME.dark.border).toBeDefined();
    });
});
