import { Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../core/auth/auth.service';
import { AuditService } from '../../core/services/audit.service';
import {
  AuditEvent,
  AuditExportPayload,
  AuditModule,
  AuditResult,
} from '../../core/models/audit.models';
import { includesAnyFlexible } from '../../core/utils/text-normalizer';

type AuditResultFilter = 'Todos' | AuditResult;
type AuditModuleFilter = 'Todos' | AuditModule;

interface AuditMetric {
  label: string;
  value: string;
  help: string;
  tone: 'info' | 'success' | 'warning' | 'danger';
}

@Component({
  selector: 'app-audit',
  imports: [FormsModule],
  templateUrl: './audit.html',
  styleUrl: './audit.css',
})
export class Audit implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly auditService = inject(AuditService);

  events: AuditEvent[] = [];
  filteredEventsList: AuditEvent[] = [];
  selected: AuditEvent | null = null;

  userFilter = '';
  moduleFilter: AuditModuleFilter = 'Todos';
  resultFilter: AuditResultFilter = 'Todos';

  exportMessage = '';

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

  roleLabel = computed(() => {
    return this.currentRole()?.label ?? 'Rol no definido';
  });

  canExport = computed(() => {
    const role = this.currentRole();

    return role?.id === 'ADMIN_SIRD' || role?.id === 'GERENTE';
  });

  metrics = computed<AuditMetric[]>(() => {
    const visible = this.filteredEventsList;

    const success = visible.filter((event) => event.result === 'Correcto').length;
    const warnings = visible.filter((event) => event.result === 'Advertencia').length;
    const blocked = visible.filter((event) => event.result === 'Bloqueado').length;

    return [
      {
        label: 'Eventos visibles',
        value: String(visible.length),
        help: 'Según filtros activos',
        tone: 'info',
      },
      {
        label: 'Correctos',
        value: String(success),
        help: 'Sin alerta',
        tone: 'success',
      },
      {
        label: 'Advertencias',
        value: String(warnings),
        help: 'Requieren revisión',
        tone: warnings > 0 ? 'warning' : 'success',
      },
      {
        label: 'Bloqueados',
        value: String(blocked),
        help: 'Acceso denegado',
        tone: blocked > 0 ? 'danger' : 'info',
      },
    ];
  });

  ngOnInit(): void {
    this.reloadEvents();
  }

  reloadEvents(): void {
    this.events = this.auditService.getEvents();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredEventsList = this.events.filter((event) => {
      const matchesText = includesAnyFlexible(
        [
          event.id,
          event.user,
          event.userLabel,
          event.action,
          event.module,
          event.resource,
          event.result,
          event.detail,
        ],
        this.userFilter,
      );

      const matchesModule =
        this.moduleFilter === 'Todos' || event.module === this.moduleFilter;

      const matchesResult =
        this.resultFilter === 'Todos' || event.result === this.resultFilter;

      return matchesText && matchesModule && matchesResult;
    });

    this.selected = this.filteredEventsList[0] ?? null;
    this.exportMessage = '';
  }

  search(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.userFilter = '';
    this.moduleFilter = 'Todos';
    this.resultFilter = 'Todos';

    this.applyFilters();
  }

  selectEvent(event: AuditEvent): void {
    this.selected = event;
  }

  exportLog(): void {
    if (!this.canExport()) {
      this.exportMessage =
        'Exportación bloqueada: solo Administrador SIRD o Gerente pueden exportar el log.';
      return;
    }

    const payload: AuditExportPayload = {
      exportedAt: new Date().toISOString(),
      exportedBy: this.currentUser()?.username ?? 'usuario_sird',
      role: this.currentRole()?.id ?? 'ROL_NO_DEFINIDO',
      filters: {
        user: this.userFilter,
        module: this.moduleFilter,
        result: this.resultFilter,
      },
      total: this.filteredEventsList.length,
      events: this.filteredEventsList,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `sird-audit-log-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();

    URL.revokeObjectURL(url);

    this.auditService.register({
      module: 'Auditoría',
      action: 'Exportación de log',
      resource: 'M06',
      result: 'Correcto',
      detail: `Exportación JSON realizada con ${this.filteredEventsList.length} evento(s).`,
    });

    this.reloadEvents();
    this.exportMessage = 'Log M06 exportado correctamente en formato JSON.';
  }

  getResultTone(result: AuditResult): 'success' | 'warning' | 'danger' {
    if (result === 'Correcto') {
      return 'success';
    }

    if (result === 'Advertencia') {
      return 'warning';
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
}
