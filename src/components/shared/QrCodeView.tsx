"use client";

import { useMemo } from "react";
import QRCode from "qrcode";

interface QrCodeViewProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * Standard ISO/IEC 18004 compliant QR Code View component using the mature `qrcode` library.
 */
export function QrCodeView({ value, size = 220, className = "" }: QrCodeViewProps) {
  const qrData = useMemo(() => {
    try {
      const qr = QRCode.create(value, { errorCorrectionLevel: "M" });
      const n = qr.modules.size;
      const data = qr.modules.data;
      const padding = 4; // ISO/IEC 18004 quiet zone of 4 module units
      const total = n + padding * 2;

      let pathD = "";
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          if (data[r * n + c]) {
            const x = c + padding;
            const y = r + padding;
            pathD += `M${x},${y}h1v1h-1z `;
          }
        }
      }
      return { total, pathD };
    } catch (err) {
      console.error("QR Code Generation Error:", err);
      return null;
    }
  }, [value]);

  if (!qrData) {
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground text-xs rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        QR Unavailable
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center p-2 bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${qrData.total} ${qrData.total}`}
        className="w-full h-full"
        shapeRendering="crispEdges"
      >
        <rect width={qrData.total} height={qrData.total} fill="#FFFFFF" />
        <path d={qrData.pathD} fill="#000000" />
      </svg>
    </div>
  );
}

/**
 * Downloads the rendered QR code as a high-resolution PNG image using `qrcode` DataURL generation.
 */
export function downloadQrPng(value: string, petName: string): void {
  try {
    QRCode.toDataURL(
      value,
      {
        errorCorrectionLevel: "M",
        margin: 4,
        width: 600,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      },
      (err, dataUrl) => {
        if (err || !dataUrl) {
          console.error("QR PNG DataURL Error:", err);
          return;
        }
        const a = document.createElement("a");
        const cleanName = petName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
        a.href = dataUrl;
        a.download = `pawguard-${cleanName || "pet"}-safety-tag.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );
  } catch (err) {
    console.error("QR PNG Download Error:", err);
  }
}

/**
 * Opens a clean print window formatted for physical pet tag printing using standard SVG string generation.
 */
export function printQrTag(value: string, petName: string, species?: string, breed?: string): void {
  try {
    QRCode.toString(
      value,
      {
        type: "svg",
        errorCorrectionLevel: "M",
        margin: 4,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      },
      (err, svgString) => {
        if (err || !svgString) {
          console.error("Print QR SVG Error:", err);
          return;
        }

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>PawGuard Safety Tag — ${petName}</title>
              <style>
                @page { size: auto; margin: 20mm; }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                  color: #0F172A;
                  background: #FFFFFF;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  padding: 40px;
                  text-align: center;
                }
                .card {
                  border: 2px solid #1E3A8A;
                  border-radius: 20px;
                  padding: 32px 40px;
                  max-width: 380px;
                  width: 100%;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                }
                .brand {
                  font-size: 24px;
                  font-weight: 800;
                  color: #1E3A8A;
                  letter-spacing: -0.5px;
                  margin-bottom: 4px;
                }
                .tagline {
                  font-size: 11px;
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  color: #475569;
                  margin-bottom: 20px;
                }
                .qr-container {
                  padding: 12px;
                  background: #FFFFFF;
                  border: 1px solid #E2E8F0;
                  border-radius: 16px;
                  margin-bottom: 20px;
                  width: 220px;
                  height: 220px;
                }
                .qr-container svg {
                  width: 100%;
                  height: 100%;
                }
                .pet-name {
                  font-size: 26px;
                  font-weight: 800;
                  color: #0F172A;
                  margin-bottom: 4px;
                }
                .pet-details {
                  font-size: 13px;
                  color: #475569;
                  margin-bottom: 16px;
                }
                .instructions {
                  font-size: 12px;
                  font-weight: 600;
                  color: #16A34A;
                  background: #F0FDF4;
                  border: 1px solid #DCFCE7;
                  padding: 8px 14px;
                  border-radius: 9999px;
                }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="brand">PAWGUARD</div>
                <div class="tagline">Official QR Safety Tag</div>
                <div class="qr-container">
                  ${svgString}
                </div>
                <div class="pet-name">${petName}</div>
                ${species || breed ? `<div class="pet-details">${species || ""}${species && breed ? " · " : ""}${breed || ""}</div>` : ""}
                <div class="instructions">Scan to help reunite this pet with their owner</div>
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 500);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    );
  } catch (err) {
    console.error("Print QR Error:", err);
  }
}
