import chroma from 'chroma-js'

export function generatePalette(baseColor: string) {
  const base = chroma(baseColor)

  return {
    primary: base.hex(),
    primaryLight: base.brighten(1.5).hex(),
    primaryDark: base.darken(1.5).hex(),
    background: base.brighten(3).desaturate(2).hex(),
    backgroundDeep: base.brighten(2).desaturate(1.5).hex(),
    text: base.darken(3).hex(),
    textLight: base.darken(1.5).hex(),
    accent: chroma.mix(base.hex(), base.set('hsl.h', '+30').hex(), 0.5).hex(),
    card: chroma.mix('#ffffff', base.hex(), 0.05).hex(),
  }
}