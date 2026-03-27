// Export utilities for Excel (.csv) and image/PDF export

/**
 * Export data as CSV (Excel-compatible with BOM for UTF-8)
 */
export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(";"),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h] ?? "";
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      }).join(";")
    ),
  ];
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Export a DOM element as PNG image
 */
export async function exportToPNG(elementId: string, filename: string) {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Dynamic import of html2canvas
  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(el, {
    backgroundColor: getComputedStyle(document.body).getPropertyValue("--background")
      ? "#ffffff"
      : "#1a1a2e",
    scale: 2,
    useCORS: true,
  });
  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, `${filename}.png`);
  });
}

/**
 * Export a DOM element as PDF (single page)
 */
export async function exportToPDF(elementId: string, filename: string) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(el, { backgroundColor: "#ffffff", scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");

  // Build a simple PDF with the image
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(`${filename}.pdf`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
