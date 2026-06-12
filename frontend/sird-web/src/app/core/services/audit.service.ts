import { Injectable, inject } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { AuditEvent, AuditRegisterRequest } from '../models/audit.models';

const AUDIT_STORAGE_KEY = 'sird_audit_events';

const DEMO_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'AUD-2026-000001',
    date: '2026-06-11T12:02:00',
    user: 'admin_sird',
    userLabel: 'Administrador SIRD',
    action: 'Inicio de sesión',
    module: 'Autenticación',
    resource: 'SIRD',
    result: 'Correcto',
    detail: 'Autenticación válida mediante usuario demo.',
  },
  {
    id: 'AUD-2026-000002',
    date: '2026-06-11T11:58:00',
    user: 'especialista_responsable',
    userLabel: 'Especialista responsable',
    action: 'Solicitud de acceso',
    module: 'Solicitudes',
    resource: 'REP-2026-000004',
    result: 'Advertencia',
    detail: 'Solicitud generada para documento restringido.',
  },
  {
    id: 'AUD-2026-000003',
    date: '2026-06-11T11:45:00',
    user: 'tecnico_administrativo',
    userLabel: 'Técnico administrativo',
    action: 'Intento de descarga',
    module: 'Detalle documental',
    resource: 'REP-2026-000005',
    result: 'Bloqueado',
    detail: 'Descarga bloqueada por estado observado o falta de autorización.',
  },
  {
    id: 'AUD-2026-000004',
    date: '2026-06-11T11:30:00',
    user: 'jefe_dependencia',
    userLabel: 'Jefe de dependencia',
    action: 'Carga de archivo EC',
    module: 'Espacios colaborativos',
    resource: 'acta_reunion_01.docx',
    result: 'Correcto',
    detail: 'Archivo colaborativo cargado en espacio institucional.',
  },
  {
    id: 'AUD-2026-000005',
    date: '2026-06-11T10:55:00',
    user: 'admin_sird',
    userLabel: 'Administrador SIRD',
    action: 'Verificación REP',
    module: 'Verificación REP',
    resource: 'REP-2026-000001',
    result: 'Correcto',
    detail: 'Código REP encontrado con hash registrado.',
  },
  {
    id: 'AUD-2026-000006',
    date: '2026-06-11T10:40:00',
    user: 'tecnico_administrativo',
    userLabel: 'Técnico administrativo',
    action: 'Búsqueda documental',
    module: 'Búsqueda documental',
    resource: 'confidencial',
    result: 'Advertencia',
    detail: 'Consulta realizada con alcance limitado por perfil.',
  },
];

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private readonly authService = inject(AuthService);

  getEvents(): AuditEvent[] {
    const storedEvents = this.readStoredEvents();
    const map = new Map<string, AuditEvent>();

    for (const event of DEMO_AUDIT_EVENTS) {
      map.set(event.id, event);
    }

    for (const event of storedEvents) {
      map.set(event.id, event);
    }

    return Array.from(map.values()).sort(this.sortByDateDesc);
  }

  register(request: AuditRegisterRequest): AuditEvent {
    const session = this.authService.session();
    const currentUser = session?.user;

    const storedEvents = this.readStoredEvents();

    const event: AuditEvent = {
      id: this.generateId(storedEvents),
      date: request.date ?? new Date().toISOString(),
      user: request.user ?? currentUser?.username ?? 'usuario_sird',
      userLabel: request.userLabel ?? currentUser?.fullName ?? 'Usuario SIRD',
      action: request.action,
      module: request.module,
      resource: request.resource,
      result: request.result,
      detail: request.detail,
    };

    storedEvents.push(event);
    this.saveStoredEvents(storedEvents);

    return event;
  }

  clearStoredEvents(): void {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  }

  replaceStoredEvents(events: AuditEvent[]): void {
    this.saveStoredEvents(events);
  }

  private readStoredEvents(): AuditEvent[] {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as AuditEvent[];

      if (!Array.isArray(parsed)) {
        localStorage.removeItem(AUDIT_STORAGE_KEY);
        return [];
      }

      return parsed;
    } catch {
      localStorage.removeItem(AUDIT_STORAGE_KEY);
      return [];
    }
  }

  private saveStoredEvents(events: AuditEvent[]): void {
    const uniqueEvents = this.removeDuplicatedEvents(events);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(uniqueEvents));
  }

  private removeDuplicatedEvents(events: AuditEvent[]): AuditEvent[] {
    const map = new Map<string, AuditEvent>();

    for (const event of events) {
      map.set(event.id, event);
    }

    return Array.from(map.values()).sort(this.sortByDateDesc);
  }

  private generateId(events: AuditEvent[]): string {
    const currentYear = new Date().getFullYear();

    const demoNumbers = DEMO_AUDIT_EVENTS.map((event) =>
      this.extractAuditNumber(event.id),
    );

    const storedNumbers = events.map((event) => this.extractAuditNumber(event.id));

    const maxNumber = Math.max(0, ...demoNumbers, ...storedNumbers);
    const nextNumber = maxNumber + 1;

    return `AUD-${currentYear}-${String(nextNumber).padStart(6, '0')}`;
  }

  private extractAuditNumber(id: string): number {
    const match = id.match(/^AUD-\d{4}-(\d+)$/);

    if (!match) {
      return 0;
    }

    return Number(match[1]);
  }

  private sortByDateDesc(a: AuditEvent, b: AuditEvent): number {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }
}
