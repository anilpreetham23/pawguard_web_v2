/**
 * Receipt opening and download utility.
 *
 * Implements the PawGuard receipt UX flow:
 * 1. Synchronously opens a new browser tab to prevent popup blocker interception.
 * 2. Fetches the official signed receipt URL from the backend.
 * 3. Navigates the newly opened tab to the official PDF receipt.
 * 4. Automatically triggers a download of the same PDF file with a clean filename:
 *    PawGuard-Donation-Receipt-{donationId}.pdf
 * 5. On failure, cleanly closes the temporary tab, logs no stack traces, and returns
 *    a user-friendly error message.
 */

import { donationService } from "./index";
import { getErrorMessage } from "@/lib/api";

export async function openAndViewReceipt(donationId: string): Promise<void> {
  if (!donationId) {
    throw new Error("A valid donation reference is required to view a receipt.");
  }

  // 1. Open new tab synchronously inside user click event to prevent popup blocking
  const receiptWindow =
    typeof window !== "undefined" ? window.open("", "_blank") : null;

  if (receiptWindow) {
    try {
      receiptWindow.document.title = "Loading Official Receipt | PawGuard";
      receiptWindow.document.body.innerHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Loading Official Receipt | PawGuard</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background-color: #f8fafc;
              color: #0f172a;
            }
            .card {
              background: #ffffff;
              padding: 2.5rem;
              border-radius: 1rem;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
              text-align: center;
              max-width: 420px;
              border: 1px solid #e2e8f0;
            }
            .spinner {
              width: 44px;
              height: 44px;
              border: 3.5px solid #e2e8f0;
              border-top-color: #1e3a8a;
              border-radius: 50%;
              animation: pg-spin 0.9s linear infinite;
              margin: 0 auto 1.25rem;
            }
            @keyframes pg-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            h1 { font-size: 1.125rem; font-weight: 600; margin: 0 0 0.5rem 0; color: #1e293b; }
            p { font-size: 0.875rem; color: #64748b; margin: 0; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="spinner"></div>
            <h1>Preparing Official Receipt</h1>
            <p>Please wait a moment while your official 80G tax-deductible receipt is retrieved.</p>
          </div>
        </body>
        </html>
      `;
    } catch {
      // Ignore if document manipulation fails
    }
  }

  try {
    // 2. Fetch the official receipt URL
    const res = await donationService.getReceiptUrl(donationId);
    if (!res?.download_url) {
      throw new Error("Receipt download URL was not provided by the server.");
    }
    const pdfUrl = res.download_url;

    // 3. Navigate the opened tab to the PDF URL
    if (receiptWindow && !receiptWindow.closed) {
      receiptWindow.location.href = pdfUrl;
    }

    // 4. Automatically trigger PDF download with clean filename
    const filename = `PawGuard-Donation-Receipt-${donationId}.pdf`;
    try {
      const response = await fetch(pdfUrl);
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
      } else {
        // Fallback: direct anchor link download
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = filename;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      // Fallback if CORS prevents blob fetch
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (err) {
    // 5. If receipt fetch fails: close temporary tab if possible so user isn't stuck with blank/loading page
    if (receiptWindow && !receiptWindow.closed) {
      try {
        receiptWindow.close();
      } catch {
        // Ignore close errors
      }
    }
    const cleanMsg =
      getErrorMessage(err) || "Failed to retrieve receipt. Please try again.";
    throw new Error(cleanMsg);
  }
}
