import { Component, OnInit, computed, inject } from '@angular/core';

import { AuthService } from '../../core/auth/auth.service';

type RequestStatus = 'Pendiente' | 'Aprobada' | 'Rechazada';
type RequestTab = 'received' | 'sent' | 'notifications';

interface RequestItem {
  code: string;
  type: string;
  document: string;
  documentTitle: string;
  requester: string;
  requesterName: string;
  dependency: string;
  justification: string;
  date: string;
  status: RequestStatus;
  createdByCurrentUser?: boolean;
}

interface RequestMetric {
  label: string;
  value: string;
  help: string;
  tone: 'info' | 'warning' | 'success' | 'danger';
}

interface NotificationItem {
  code: string;
  title: string;
  description: string;
  date: string;
  tone: 'info' | 'warning' | 'success' | 'danger';
}

const STORAGE_KEY = 'sird_access_requests';

const DEMO_REQUESTS: RequestItem[] = [
  {
    code: 'S-2026-001',
    type: 'Acceso restringido',
    document: 'REP-2026-000004',
    documentTitle: 'Expediente reservado de evaluación contractual',
    requester: 'especialista_responsable',
    requesterName: 'Lucía Quispe Mamani',
    dependency: 'Oficina de Asesoría Jurídica',
    justification:
      'Requiere consultar el documento para completar revisión técnica asignada.',
    date: '2026-06-10T09:10:00',
    status: 'Pendiente',
  },
  {
    code: 'S-2026-002',
    type: 'Acceso temporal',
    document: 'REP-2026-000005',
    documentTitle: 'Reporte de interoperabilidad con sistema de trámite documentario',
    requester: 'tecnico_administrativo',
    requesterName: 'Tomás Condori Huillca',
    dependency: 'Oficina de Tecnologías de la Información',
    justification:
      'Necesita validar el reporte para seguimiento de interoperabilidad institucional.',
    date: '2026-06-09T11:40:00',
    status: 'Aprobada',
  },
];

@Component({
  selector: 'app-requests',
  imports: [],
  templateUrl: './requests.html',
  styleUrl: './requests.css',
})
export class Requests implements OnInit {
  private readonly authService = inject(AuthService);

  requests: RequestItem[] = [];
  selected: RequestItem | null = null;
  activeTab: RequestTab = 'received';

  session = this.authService.session;

  currentUser = computed(() => {
    return this.session()?.user ?? null;
  });

  currentRole = computed(() => {
    return this.session()?.role ?? null;
  });

  fullName = computed(() => {
    return this.currentUser()?.fullName ?? 'Usuario SIRD';
  });

  username = computed(() => {
    return this.currentUser()?.username ?? 'usuario_sird';
  });

  roleLabel = computed(() => {
    return this.currentRole()?.label ?? 'Rol no definido';
  });

  visibleRequests = computed(() => {
    const user = this.currentUser();
    const role = this.currentRole();

    if (!user || !role) {
      return [];
    }

    if (role.id === 'ADMIN_SIRD' || role.id === 'GERENTE') {
      return this.requests;
    }

    if (role.id === 'JEFE_DEPENDENCIA') {
      return this.requests.filter((request) => {
        return request.dependency === user.dependency || request.requester === user.username;
      });
    }

    return this.requests.filter((request) => request.requester === user.username);
  });

  receivedRequests = computed(() => {
    const role = this.currentRole();

    if (role?.id === 'ADMIN_SIRD' || role?.id === 'GERENTE' || role?.id === 'JEFE_DEPENDENCIA') {
      return this.visibleRequests();
    }

    return [];
  });

  sentRequests = computed(() => {
    const username = this.username();

    return this.requests.filter((request) => request.requester === username);
  });

  tableRequests = computed(() => {
    if (this.activeTab === 'sent') {
      return this.sentRequests();
    }

    if (this.activeTab === 'notifications') {
      return [];
    }

    return this.receivedRequests();
  });

  notifications = computed<NotificationItem[]>(() => {
    const visible = this.visibleRequests();

    return visible.slice(0, 5).map((request) => ({
      code: `N-${request.code}`,
      title: `Solicitud ${request.status.toLowerCase()}`,
      description: `${request.document} · ${request.requesterName}`,
      date: request.date,
      tone: this.getStatusTone(request.status),
    }));
  });

  metrics = computed<RequestMetric[]>(() => {
    const visible = this.visibleRequests();
    const pending = visible.filter((item) => item.status === 'Pendiente').length;
    const approved = visible.filter((item) => item.status === 'Aprobada').length;
    const rejected = visible.filter((item) => item.status === 'Rechazada').length;

    return [
      {
        label: 'Visibles',
        value: String(visible.length),
        help: 'Según rol y alcance',
        tone: 'info',
      },
      {
        label: 'Pendientes',
        value: String(pending),
        help: 'Por decidir',
        tone: pending > 0 ? 'warning' : 'success',
      },
      {
        label: 'Aprobadas',
        value: String(approved),
        help: 'Con permiso',
        tone: 'success',
      },
      {
        label: 'Rechazadas',
        value: String(rejected),
        help: 'Con motivo',
        tone: rejected > 0 ? 'danger' : 'info',
      },
      {
        label: 'Notificaciones',
        value: String(this.notifications().length),
        help: 'Eventos recientes',
        tone: 'info',
      },
    ];
  });

  ngOnInit(): void {
    this.requests = this.loadRequests();
    this.selected = this.tableRequests()[0] ?? this.visibleRequests()[0] ?? null;
  }

  setTab(tab: RequestTab): void {
    this.activeTab = tab;

    if (tab === 'notifications') {
      this.selected = null;
      return;
    }

    this.selected = this.tableRequests()[0] ?? null;
  }

  selectRequest(item: RequestItem): void {
    this.selected = item;
  }

  approve(): void {
    if (!this.selected || !this.canDecide()) {
      return;
    }

    this.selected.status = 'Aprobada';
    this.persistRequests();
  }

  reject(): void {
    if (!this.selected || !this.canDecide()) {
      return;
    }

    this.selected.status = 'Rechazada';
    this.persistRequests();
  }

  canDecide(): boolean {
    const role = this.currentRole();

    return (
      this.activeTab === 'received' &&
      this.selected?.status === 'Pendiente' &&
      (role?.id === 'ADMIN_SIRD' ||
        role?.id === 'GERENTE' ||
        role?.id === 'JEFE_DEPENDENCIA')
    );
  }

  getStatusTone(status: RequestStatus): 'info' | 'warning' | 'success' | 'danger' {
    if (status === 'Pendiente') {
      return 'warning';
    }

    if (status === 'Aprobada') {
      return 'success';
    }

    return 'danger';
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  }

  private loadRequests(): RequestItem[] {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [...DEMO_REQUESTS];
    }

    try {
      const parsed = JSON.parse(stored) as RequestItem[];
      return this.mergeDemoWithStored(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return [...DEMO_REQUESTS];
    }
  }

  private mergeDemoWithStored(stored: RequestItem[]): RequestItem[] {
    const map = new Map<string, RequestItem>();

    for (const request of DEMO_REQUESTS) {
      map.set(request.code, request);
    }

    for (const request of stored) {
      map.set(request.code, request);
    }

    return Array.from(map.values()).sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  private persistRequests(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.requests));
  }
}
