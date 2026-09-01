import QRCode from "qrcode";

/**
 * Standard ISO/IEC 18004 compliant QR Code Matrix Generator backed by standard `qrcode` library.
 */
export function generateQrMatrix(text: string): boolean[][] {
  try {
    const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
    const n = qr.modules.size;
    const data = qr.modules.data;
    const matrix: boolean[][] = [];
    for (let r = 0; r < n; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < n; c++) {
        row.push(data[r * n + c] === 1);
      }
      matrix.push(row);
    }
    return matrix;
  } catch (err) {
    console.error("generateQrMatrix Error:", err);
    return [];
  }
}
