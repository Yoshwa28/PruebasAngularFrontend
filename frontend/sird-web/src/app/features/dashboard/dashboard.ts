import { Component, computed, inject } from '@angular/core';

import { AuthService } from '../../core/auth/auth.service';
import { DocumentService } from '../../core/services/document.service';
import { SirdDocument } from '../../core/models/document.models';

type DashboardTone = 'primary' | 'info' | 'success' | 'warning' | 'danger';

interface DashboardMetric {
  label: string;
  value: string;
  help: string;
  tone: DashboardTone;
}

interface AlertItem {
  title: string;
  description: string;
  tone: DashboardTone;
}

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly authService = inject(AuthService);
  private readonly documentService = inject(DocumentService);

  private readonly documents = this.documentService.getDocuments();

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

  dependency = computed(() => {
    return this.currentUser()?.dependency ?? 'Dependencia no definida';
  });

  position = computed(() => {
    return this.currentUser()?.position ?? 'Cargo no definido';
  });

  visibleDocuments = computed<SirdDocument[]>(() => {
    const user = this.currentUser();
    const role = this.currentRole();

    if (!user || !role) {
      return [];
    }

    if (role.id === 'ADMIN_SIRD' || role.id === 'GERENTE') {
      return this.documents;
    }

    return this.documents.filter((document) => {
      return document.dependency === user.dependency || document.author === user.fullName;
    });
  });

  dashboardSummary = computed(() => {
    const documents = this.visibleDocuments();

    const signedDocuments = documents.filter((document) => {
      return document.status === 'FIRMADO' || document.status === 'INMUTABLE';
    }).length;

    const restrictedDocuments = documents.filter((document) => {
      return (
        document.classification === 'RESTRINGIDO' ||
        document.classification === 'CONFIDENCIAL'
      );
    }).length;

    const pendingDocuments = documents.filter((document) => {
      return document.status === 'PENDIENTE' || document.status === 'OBSERVADO';
    }).length;

    const dependencies = new Set(documents.map((document) => document.dependency));

    return {
      totalDocuments: documents.length,
      signedDocuments,
      restrictedDocuments,
      pendingDocuments,
      visibleDependencies: dependencies.size,
      immutableEvents: signedDocuments + restrictedDocuments,
    };
  });

  metrics = computed<DashboardMetric[]>(() => {
    const summary = this.dashboardSummary();

    return [
      {
        label: 'Documentos visibles',
        value: String(summary.totalDocuments),
        help: 'Según alcance del perfil actual',
        tone: 'info',
      },
      {
        label: 'Documentos firmados',
        value: String(summary.signedDocuments),
        help: 'Firmados o inmutables',
        tone: 'success',
      },
      {
        label: 'Pendientes / observados',
        value: String(summary.pendingDocuments),
        help: 'Requieren seguimiento',
        tone: summary.pendingDocuments > 0 ? 'warning' : 'success',
      },
      {
        label: 'Acceso restringido',
        value: String(summary.restrictedDocuments),
        help: 'Restringidos o confidenciales',
        tone: summary.restrictedDocuments > 0 ? 'danger' : 'info',
      },
      {
        label: 'Dependencias visibles',
        value: String(summary.visibleDependencies),
        help: 'Ámbito documental disponible',
        tone: 'primary',
      },
      {
        label: 'Eventos M06',
        value: String(summary.immutableEvents),
        help: 'Simulación de trazabilidad',
        tone: 'warning',
      },
    ];
  });

  latestDocuments = computed<SirdDocument[]>(() => {
    return [...this.visibleDocuments()]
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 4);
  });

  alerts = computed<AlertItem[]>(() => {
    const summary = this.dashboardSummary();
    const role = this.currentRole();

    const alerts: AlertItem[] = [
      {
        title: 'Alcance activo',
        description: `${role?.label ?? 'Rol actual'}: ${summary.totalDocuments} documentos visibles para este perfil.`,
        tone: 'primary',
      },
    ];

    if (summary.pendingDocuments > 0) {
      alerts.push({
        title: 'Seguimiento documental',
        description: `${summary.pendingDocuments} documento(s) pendiente(s) u observado(s) requieren revisión.`,
        tone: 'warning',
      });
    }

    if (summary.restrictedDocuments > 0) {
      alerts.push({
        title: 'Documentos restringidos',
        description: `${summary.restrictedDocuments} documento(s) tienen clasificación restringida o confidencial.`,
        tone: 'danger',
      });
    }

    alerts.push({
      title: 'Trazabilidad',
      description: `${summary.immutableEvents} evento(s) simulados disponibles para auditoría M06.`,
      tone: 'info',
    });

    return alerts;
  });

  getMetricClass(tone: DashboardTone): Record<string, boolean> {
    return {
      primary: tone === 'primary',
      info: tone === 'info',
      success: tone === 'success',
      warning: tone === 'warning',
      danger: tone === 'danger',
    };
  }

  getAlertClass(tone: DashboardTone): Record<string, boolean> {
    return {
      primary: tone === 'primary',
      info: tone === 'info',
      success: tone === 'success',
      warning: tone === 'warning',
      danger: tone === 'danger',
    };
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  }
}
