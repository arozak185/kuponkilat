/**
 * Generates clean barcode lines SVG pattern based on text input
 */
export function generateBarcodeSvg(code: string, width = 120, height = 34): string {
  // Simple deterministic pattern based on characters
  const cleanCode = code.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  let binary = '101001101101'; // Start guard

  for (let i = 0; i < cleanCode.length; i++) {
    const charCode = cleanCode.charCodeAt(i);
    // Pseudo barcode encoding with varying bar widths
    const bit = (charCode % 7).toString(2).padStart(4, '0');
    binary += bit + (i % 2 === 0 ? '110' : '011');
  }
  binary += '110100101'; // End guard

  const barCount = binary.length;
  const barWidth = width / barCount;
  
  let rects = '';
  for (let i = 0; i < barCount; i++) {
    if (binary[i] === '1') {
      const x = (i * barWidth).toFixed(2);
      const w = barWidth.toFixed(2);
      rects += `<rect x="${x}" y="0" width="${w}" height="${height}" fill="currentColor" />`;
    }
  }

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${rects}</svg>`;
}
