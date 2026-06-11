import { Component } from '@angular/core';

interface AuditEvent {
  date: string;
  user: string;
  action: string;
  module: string;
  resource: string;
  result: 'Correcto' | 'Advertencia' | 'Bloqueado';
}

@Component({
  selector: 'app-audit',
  imports: [],
  templateUrl: './audit.html',
  styleUrl: './audit.css',
})
export class Audit {
  events: AuditEvent[] = [
    {
      date: '11/06/2026 12:02',
      user: 'admin_sird',
      action: 'Inicio de sesión',
      module: 'Autenticación',
      resource: 'SIRD',
      result: 'Correcto',
    },
    {
      date: '11/06/2026 11:58',
      user: 'especialista_responsable',
      action: 'Solicitud de acceso',
      module: 'Solicitudes',
      resource: 'REP-2026-000222',
      result: 'Advertencia',
    },
    {
      date: '11/06/2026 11:45',
      user: 'tecnico_administrativo',
      action: 'Intento de descarga',
      module: 'Detalle documental',
      resource: 'REP-2026-000900',
      result: 'Bloqueado',
    },
    {
      date: '11/06/2026 11:30',
      user: 'jefe_dependencia',
      action: 'Carga de archivo EC',
      module: 'Espacios colaborativos',
      resource: 'acta_reunion_01.docx',
      result: 'Correcto',
    },
  ];

  search(): void {
    console.log('Buscar eventos de auditoría - simulación.');
  }

  exportLog(): void {
    console.log('Exportar log M06 - simulación.');
  }
}
