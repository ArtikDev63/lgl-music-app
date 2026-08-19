export const mezclarColoresHEX = (hexBase, hexSuperior, opacidadSuperior) => {
  // 1. Quitar el '#' si existe y convertir a RGB entero
  const rBase = parseInt(hexBase.replace('#', '').substring(0, 2), 16);
  const gBase = parseInt(hexBase.replace('#', '').substring(2, 4), 16);
  const bBase = parseInt(hexBase.replace('#', '').substring(4, 6), 16);

  const rSup = parseInt(hexSuperior.replace('#', '').substring(0, 2), 16);
  const gSup = parseInt(hexSuperior.replace('#', '').substring(2, 4), 16);
  const bSup = parseInt(hexSuperior.replace('#', '').substring(4, 6), 16);

  // 2. Aplicar fórmula de mezcla (Alpha Blending)
  const rResultado = Math.round((1 - opacidadSuperior) * rBase + opacidadSuperior * rSup);
  const gResultado = Math.round((1 - opacidadSuperior) * gBase + opacidadSuperior * gSup);
  const bResultado = Math.round((1 - opacidadSuperior) * bBase + opacidadSuperior * bSup);

  // 3. Convertir de nuevo a formato HEX de 6 caracteres
  const aHex = (componente) => componente.toString(16).padStart(2, '0').toUpperCase();

  return `#${aHex(rResultado)}${aHex(gResultado)}${aHex(bResultado)}`;
};