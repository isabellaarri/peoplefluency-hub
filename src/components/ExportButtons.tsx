import { Button } from "@/components/ui/button";
import { Download, Image, FileText } from "lucide-react";
import { exportToCSV, exportToPNG, exportToPDF } from "@/lib/exportUtils";
import { toast } from "sonner";

interface ExportButtonsProps {
  csvData?: Record<string, unknown>[];
  csvFilename?: string;
  dashboardId?: string;
  dashboardFilename?: string;
}

export function ExportButtons({ csvData, csvFilename = "dados", dashboardId, dashboardFilename = "dashboard" }: ExportButtonsProps) {
  const handleCSV = () => {
    if (!csvData || csvData.length === 0) {
      toast.error("Sem dados para exportar");
      return;
    }
    exportToCSV(csvData, csvFilename);
    toast.success("CSV exportado com sucesso");
  };

  const handlePNG = async () => {
    if (!dashboardId) return;
    await exportToPNG(dashboardId, dashboardFilename);
    toast.success("Imagem exportada");
  };

  const handlePDF = async () => {
    if (!dashboardId) return;
    await exportToPDF(dashboardId, dashboardFilename);
    toast.success("PDF exportado");
  };

  return (
    <div className="flex items-center gap-1.5">
      {csvData && (
        <Button variant="outline" size="sm" onClick={handleCSV} className="text-[11px] h-7 gap-1">
          <Download className="h-3 w-3" /> Excel
        </Button>
      )}
      {dashboardId && (
        <>
          <Button variant="outline" size="sm" onClick={handlePNG} className="text-[11px] h-7 gap-1">
            <Image className="h-3 w-3" /> PNG
          </Button>
          <Button variant="outline" size="sm" onClick={handlePDF} className="text-[11px] h-7 gap-1">
            <FileText className="h-3 w-3" /> PDF
          </Button>
        </>
      )}
    </div>
  );
}
