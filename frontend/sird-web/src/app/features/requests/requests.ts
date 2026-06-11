import { Component } from '@angular/core';

interface RequestItem {
  code: string;
  type: string;
  document: string;
  requester: string;
  date: string;
  status: 'Pendiente' | 'Aprobada' | 'Rechazada';
}

@Component({
  selector: 'app-requests',
  imports: [],
  templateUrl: './requests.html',
  styleUrl: './requests.css',
})
export class Requests {
  requests: RequestItem[] = [
    {
      code: 'S-2026-001',
      type: 'Acceso restringido',
      document: 'REP-2026-000188',
      requester: 'especialista_responsable',
      date: '10/06/2026',
      status: 'Pendiente',
    },
    {
      code: 'S-2026-002',
      type: 'Acceso temporal',
      document: 'REP-2026-000222',
      requester: 'especialista_responsable',
      date: '09/06/2026',
      status: 'Aprobada',
    },
  ];

  selected = this.requests[0];

  selectRequest(item: RequestItem): void {
    this.selected = item;
  }

  approve(): void {
    this.selected.status = 'Aprobada';
  }

  reject(): void {
    this.selected.status = 'Rechazada';
  }
}
