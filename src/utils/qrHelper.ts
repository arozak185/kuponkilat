import QRCode from 'qrcode';

const qrCache = new Map<string, string>();

export function getCachedQr(text: string): string | undefined {
  return qrCache.get(text);
}

export async function getQrDataUrl(text: string): Promise<string> {
  if (qrCache.has(text)) {
    return qrCache.get(text)!;
  }
  try {
    const url = await QRCode.toDataURL(text, {
      margin: 1,
      width: 140,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
    qrCache.set(text, url);
    return url;
  } catch (err) {
    console.error('QR code generation error:', err);
    return '';
  }
}

export async function preloadQrCodes(ticketNumbers: string[], eventTitle: string): Promise<void> {
  const promises = ticketNumbers.map((num) => getQrDataUrl(`${num}|${eventTitle}`));
  await Promise.all(promises);
}
