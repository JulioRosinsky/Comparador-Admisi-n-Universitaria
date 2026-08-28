// Official DEMRE NEM Conversion Scale (100 - 1000 scale)
// Based on official Table Grupo A (Científico-Humanista) & Grupo C (Técnico-Profesional)

export interface NemPoint {
  nem: number;
  scoreGrupoA: number; // Humanista-Científico
  scoreGrupoC: number; // Técnico-Profesional
}

export const NEM_CONVERSION_TABLE: NemPoint[] = [
  { nem: 4.0, scoreGrupoA: 100, scoreGrupoC: 100 },
  { nem: 4.1, scoreGrupoA: 139, scoreGrupoC: 145 },
  { nem: 4.2, scoreGrupoA: 178, scoreGrupoC: 190 },
  { nem: 4.3, scoreGrupoA: 217, scoreGrupoC: 235 },
  { nem: 4.4, scoreGrupoA: 256, scoreGrupoC: 280 },
  { nem: 4.5, scoreGrupoA: 295, scoreGrupoC: 325 },
  { nem: 4.6, scoreGrupoA: 334, scoreGrupoC: 370 },
  { nem: 4.7, scoreGrupoA: 373, scoreGrupoC: 415 },
  { nem: 4.8, scoreGrupoA: 412, scoreGrupoC: 460 },
  { nem: 4.9, scoreGrupoA: 451, scoreGrupoC: 505 },
  { nem: 5.0, scoreGrupoA: 490, scoreGrupoC: 550 },
  { nem: 5.1, scoreGrupoA: 511, scoreGrupoC: 572 },
  { nem: 5.2, scoreGrupoA: 533, scoreGrupoC: 595 },
  { nem: 5.3, scoreGrupoA: 554, scoreGrupoC: 617 },
  { nem: 5.4, scoreGrupoA: 576, scoreGrupoC: 640 },
  { nem: 5.5, scoreGrupoA: 597, scoreGrupoC: 662 },
  { nem: 5.6, scoreGrupoA: 619, scoreGrupoC: 685 },
  { nem: 5.7, scoreGrupoA: 640, scoreGrupoC: 707 },
  { nem: 5.8, scoreGrupoA: 662, scoreGrupoC: 730 },
  { nem: 5.9, scoreGrupoA: 683, scoreGrupoC: 752 },
  { nem: 6.0, scoreGrupoA: 705, scoreGrupoC: 775 },
  { nem: 6.1, scoreGrupoA: 734, scoreGrupoC: 797 },
  { nem: 6.2, scoreGrupoA: 764, scoreGrupoC: 820 },
  { nem: 6.3, scoreGrupoA: 793, scoreGrupoC: 842 },
  { nem: 6.4, scoreGrupoA: 823, scoreGrupoC: 865 },
  { nem: 6.5, scoreGrupoA: 852, scoreGrupoC: 887 },
  { nem: 6.6, scoreGrupoA: 882, scoreGrupoC: 910 },
  { nem: 6.7, scoreGrupoA: 911, scoreGrupoC: 932 },
  { nem: 6.8, scoreGrupoA: 941, scoreGrupoC: 955 },
  { nem: 6.9, scoreGrupoA: 970, scoreGrupoC: 977 },
  { nem: 7.0, scoreGrupoA: 1000, scoreGrupoC: 1000 },
];

/**
 * Converts a NEM grade (1.0 to 7.0) to DEMRE PAES points (100 - 1000)
 */
export function convertNemToScore(
  nem: number,
  type: 'humanista' | 'tecnico' = 'humanista'
): number {
  if (isNaN(nem) || nem <= 4.0) return 100;
  if (nem >= 7.0) return 1000;

  const roundedNem = Math.round(nem * 100) / 100;

  // Find exact or closest points for linear interpolation
  const lowerPoint = NEM_CONVERSION_TABLE.slice().reverse().find((p) => p.nem <= roundedNem);
  const upperPoint = NEM_CONVERSION_TABLE.find((p) => p.nem >= roundedNem);

  if (!lowerPoint && upperPoint) {
    return type === 'humanista' ? upperPoint.scoreGrupoA : upperPoint.scoreGrupoC;
  }
  if (lowerPoint && !upperPoint) {
    return type === 'humanista' ? lowerPoint.scoreGrupoA : lowerPoint.scoreGrupoC;
  }
  if (lowerPoint && upperPoint) {
    if (lowerPoint.nem === upperPoint.nem) {
      return type === 'humanista' ? lowerPoint.scoreGrupoA : lowerPoint.scoreGrupoC;
    }
    const ratio = (roundedNem - lowerPoint.nem) / (upperPoint.nem - lowerPoint.nem);
    const scoreLow = type === 'humanista' ? lowerPoint.scoreGrupoA : lowerPoint.scoreGrupoC;
    const scoreHigh = type === 'humanista' ? upperPoint.scoreGrupoA : upperPoint.scoreGrupoC;
    return Math.round(scoreLow + ratio * (scoreHigh - scoreLow));
  }

  return 100;
}
