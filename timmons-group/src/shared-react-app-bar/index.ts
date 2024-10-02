import { CSSProperties } from 'react';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    navLink: CSSProperties;
    mobileUserName: CSSProperties;
    mobileUserEmail: CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    navLink: CSSProperties;
    altTextLink: CSSProperties;
    mobileUserName: CSSProperties;
    mobileUserEmail: CSSProperties;
  }

  //Some of the color options are not available in the default theme
  interface TypographyColor {
    error: string;
  }

  interface TypographyColorOptions {
    error: string;
  }

  interface Palette {
    regressive: Palette['primary'];
    progressive: Palette['primary'];
    tertiary: Palette['primary'];
    ancillary: Palette['primary'];
  }

  interface PaletteOptions {
    regressive: PaletteOptions['primary'];
    progressive: PaletteOptions['primary'];
    tertiary: PaletteOptions['primary'];
    ancillary: PaletteOptions['primary'];
  }

  interface Theme {
    appBar: {
      logo: CSSProperties;
      logoText: CSSProperties;
    };
    iconButton: CSSProperties;
  }

  interface ThemeOptions {
    appBar: {
      logo: CSSProperties;
      logoText: CSSProperties;
    };
    iconButton: CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    [key: string]: boolean | undefined;
  }

  interface TypographyPropsColorOverrides {
    error: true;
  }
}

export { default } from './components/AppBar/AppBar.tsx';