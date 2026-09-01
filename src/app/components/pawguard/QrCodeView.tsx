"use client";

import { useMemo } from "react";
import { generateQrMatrix } from "@/lib/utils/qr-generator";

interface QrCodeViewProps {
  value: string;
  size?: number;
  className?: string;
}

export function QrCodeView({ value, size = 220, className = "" }: QrCodeViewProps) {
  const matrix = useMemo(() => {
    try {
      return generateQrMatrix(value);
    } catch (err) {
      console.error("QR matrix generation failed:", err);
      return [];
    }
  }, [value]);

  if (!matrix.length) {
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground text-xs rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        QR Unavailable
      </div>
    );
  }

  const n = matrix.length;
  const padding = 4; // ISO/IEC 18004 quiet zone of 4 module units
  const total = n + padding * 2;

  // Build SVG path string for high performance rendering
  let pathD = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c]) {
        const x = c + padding;
        const y = r + padding;
        pathD += `M${x},${y}h1v1h-1z `;
      }
    }
  }

  return (
    <div
      className={`inline-flex items-center justify-center p-2 bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${total} ${total}`}
        className="w-full h-full"
        shapeRendering="crispEdges"
      >
        <rect width={total} height={total} fill="#FFFFFF" />
        <path d={pathD} fill="#000000" />
      </svg>
    </div>
  );
}

/**
 * Downloads the rendered QR code as a high-resolution PNG image.
 */
export function downloadQrPng(value: string, petName: string): void {
  try {
    const matrix = generateQrMatrix(value);
    const n = matrix.length;
    const padding = 4;
    const total = n + padding * 2;
    const canvasSize = 600;
    const moduleSize = canvasSize / total;

    const canvas = document.createElement("canvas");
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw White Background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw Modules
    ctx.fillStyle = "#000000";
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (matrix[r][c]) {
          const x = (c + padding) * moduleSize;
          const y = (r + padding) * moduleSize;
          ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(moduleSize), Math.ceil(moduleSize));
        }
      }
    }

    // Convert to PNG Blob and trigger download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const cleanName = petName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
      a.href = url;
      a.download = `pawguard-${cleanName || "pet"}-safety-tag.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  } catch (err) {
    console.error("QR PNG Download Error:", err);
  }
}

/**
 * Opens a clean print window formatted for physical pet tag printing.
 */
export function printQrTag(value: string, petName: string, species?: string, breed?: string): void {
  try {
    const matrix = generateQrMatrix(value);
    const n = matrix.length;
    const padding = 4;
    const total = n + padding * 2;
    let pathD = "";
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (matrix[r][c]) {
          pathD += `M${c + padding},${r + padding}h1v1h-1z `;
        }
      }
    }

    const svgHtml = `<svg viewBox="0 0 ${total} ${total}" style="width: 220px; height: 220px; shape-rendering: crispEdges;"><rect width="${total}" height="${total}" fill="#FFFFFF"/><path d="${pathD}" fill="#000000"/></svg>`;

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
              ${svgHtml}
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
  } catch (err) {
    console.error("Print QR Error:", err);
  }
}
