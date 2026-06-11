import { Component } from '@angular/core';

interface IntegratedSystem {
  name: string;
  dependency: string;
  status: string;
  lastConnection: string;
  contract: string;
}

@Component({
  selector: 'app-integrated-systems',
  imports: [],
  templateUrl: './integrated-systems.html',
  styleUrl: './integrated-systems.css',
})
export class IntegratedSystems {
  systems: IntegratedSystem[] = [
    {
      name: 'Trámite Documentario Regional',
      dependency: 'Gerencia General Regional',
      status: 'Activo',
      lastConnection: '10/06/2026 09:15',
      contract: 'A-1, A-2, A-5',
    },
    {
      name: 'Planeamiento Regional',
      dependency: 'Gerencia General Regional',
      status: 'Activo',
      lastConnection: '10/06/2026 08:30',
      contract: 'A-1, A-4',
    },
    {
      name: 'Gestión de Inversiones',
      dependency: 'Gerencia Regional de Infraestructura',
      status: 'Activo',
      lastConnection: '10/06/2026 08:05',
      contract: 'A-1, A-3, A-5',
    },
    {
      name: 'Control Institucional',
      dependency: 'Órgano de Control Institucional',
      status: 'Activo',
      lastConnection: '09/06/2026 17:20',
      contract: 'A-1, A-2',
    },
  ];

  renewApiKey(): void {
    console.log('API Key renovada - simulación.');
  }
}
