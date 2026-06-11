import { Component } from '@angular/core';

interface ReportItem {
  name: string;
  scope: string;
  frequency: string;
  format: string;
}

@Component({
  selector: 'app-reports',
  imports: [],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {
  reports: ReportItem[] = [
    {
      name: 'Inventario documental',
      scope: 'Documentos visibles por perfil',
      frequency: 'Bajo demanda',
      format: 'PDF / XLSX',
    },
    {
      name: 'Estado TRD',
      scope: 'Vigentes, vencidos y transferidos',
      frequency: 'Mensual',
      format: 'PDF',
    },
    {
      name: 'Actividad de espacios colaborativos',
      scope: 'Archivos, firmas y cierres',
      frequency: 'Semanal',
      format: 'XLSX',
    },
    {
      name: 'Auditoría M06',
      scope: 'Eventos críticos del sistema',
      frequency: 'Bajo demanda',
      format: 'CSV / PDF',
    },
  ];

  generateReport(name: string): void {
    console.log(`Generar reporte: ${name}`);
  }

  exportDashboard(): void {
    console.log('Exportar tablero - simulación.');
  }
}
