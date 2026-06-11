import { Component } from '@angular/core';

interface DashboardMetric {
  label: string;
  value: string;
  help: string;
  tone: 'primary' | 'info' | 'success' | 'warning' | 'danger';
}

interface AlertItem {
  title: string;
  description: string;
  tone: 'primary' | 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  metrics: DashboardMetric[] = [
    {
      label: 'Documentos custodiados',
      value: '11',
      help: 'Documentos visibles',
      tone: 'info',
    },
    {
      label: 'Solicitudes pendientes',
      value: '1',
      help: 'Todas',
      tone: 'primary',
    },
    {
      label: 'Espacios visibles',
      value: '4',
      help: 'Según asignación',
      tone: 'success',
    },
    {
      label: 'Alertas TRD',
      value: '2',
      help: 'Vencidas o transferidas',
      tone: 'danger',
    },
    {
      label: 'Integraciones activas',
      value: '4',
      help: 'De 25 registradas',
      tone: 'success',
    },
    {
      label: 'Eventos M06',
      value: '8',
      help: 'Log inmutable',
      tone: 'warning',
    },
  ];

  alerts: AlertItem[] = [
    {
      title: 'Alcance activo',
      description: 'Administrador SIRD: Todas las dependencias.',
      tone: 'primary',
    },
    {
      title: 'Solicitudes pendientes',
      description:
        '1 solicitudes requieren seguimiento visible para el perfil.',
      tone: 'warning',
    },
    {
      title: 'Alertas TRD',
      description:
        '2 documentos visibles están vencidos o transferidos.',
      tone: 'danger',
    },
    {
      title: 'Integraciones',
      description:
        '4 integraciones activas reportan comunicación reciente.',
      tone: 'info',
    },
  ];
}
