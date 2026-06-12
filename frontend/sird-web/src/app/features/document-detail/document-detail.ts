import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { DocumentService } from '../../core/services/document.service';
import {
  DocumentClassification,
  DocumentStatus,
  SirdDocument,
} from '../../core/models/document.models';

type DetailAction =
  | 'openViewer'
  | 'download'
  | 'viewRep'
  | 'viewHistory'
  | 'requestAccess';

interface StoredAccessRequest {
  code: string;
  type: string;
  document: string;
  documentTitle: string;
  requester: string;
  requesterName: string;
  dependency: string;
  justification: string;
  date: string;
  status: 'Pendiente' | 'Aprobada' | 'Rechazada';
  createdByCurrentUser?: boolean;
}

const ACCESS_REQUEST_STORAGE_KEY = 'sird_access_requests';

@Component({
  selector: 'app-document-detail',
  imports: [],
  templateUrl: './document-detail.html',
  styleUrl: './document-detail.css',
})
export class DocumentDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly documentService = inject(DocumentService);
  private readonly authService = inject(AuthService);

  document: SirdDocument | null = null;
  actionMessage = '';

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

  hasDocument = computed(() => {
    return this.document !== null;
  });

  hasAccess = computed(() => {
    const document = this.document;
    const user = this.currentUser();
    const role = this.currentRole();

    if (!document || !user || !role) {
      return false;
    }

    if (role.id === 'ADMIN_SIRD' || role.id === 'GERENTE') {
      return true;
    }

    if (document.classification === 'PUBLICO') {
      return true;
    }

    if (document.classification === 'INTERNO') {
      return document.dependency === user.dependency || document.author === user.fullName;
    }

    if (document.classification === 'RESTRINGIDO') {
      return document.author === user.fullName || role.id === 'JEFE_DEPENDENCIA';
    }

    return document.author === user.fullName;
  });

  canDownload = computed(() => {
    const document = this.document;

    if (!document) {
      return false;
    }

    return this.hasAccess() && document.status !== 'OBSERVADO';
  });

  accessLabel = computed(() => {
    if (!this.document) {
      return 'Documento no encontrado';
    }

    return this.hasAccess() ? 'Acceso autorizado' : 'Acceso restringido';
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const idParam = params.get('id');
      const repParam = params.get('rep');

      if (idParam) {
        const id = Number(idParam);
        this.document = Number.isNaN(id)
          ? null
          : this.documentService.getDocumentById(id) ?? null;
        return;
      }

      if (repParam) {
        this.document = this.documentService.getDocumentByRepCode(repParam) ?? null;
        return;
      }

      this.document = this.documentService.getDocuments()[0] ?? null;
    });
  }

  openViewer(): void {
    this.handleAction('openViewer');
  }

  download(): void {
    this.handleAction('download');
  }

  viewRep(): void {
    this.handleAction('viewRep');
  }

  viewHistory(): void {
    this.handleAction('viewHistory');
  }

  requestAccess(): void {
    try {
      this.createAccessRequest();
      this.handleAction('requestAccess');
    } catch {
      // El mensaje ya fue definido por createAccessRequest().
    }
  }

  goBackToSearch(): void {
    this.router.navigate(['/app/busqueda-documental']);
  }

  getClassificationLabel(classification: DocumentClassification): string {
    const labels: Record<DocumentClassification, string> = {
      PUBLICO: 'Público',
      INTERNO: 'Interno',
      RESTRINGIDO: 'Restringido',
      CONFIDENCIAL: 'Confidencial',
    };

    return labels[classification];
  }

  getStatusLabel(status: DocumentStatus): string {
    const labels: Record<DocumentStatus, string> = {
      PENDIENTE: 'Pendiente',
      FIRMADO: 'Firmado',
      INMUTABLE: 'Inmutable',
      OBSERVADO: 'Observado',
    };

    return labels[status];
  }

  getPkiLabel(status: DocumentStatus): string {
    if (status === 'FIRMADO' || status === 'INMUTABLE') {
      return 'Firmado';
    }

    return 'Sin firma';
  }

  getTrdLabel(status: DocumentStatus): string {
    if (status === 'PENDIENTE' || status === 'OBSERVADO') {
      return 'Por revisar';
    }

    return 'Vigente';
  }

  getClassificationTone(classification: DocumentClassification): string {
    const tones: Record<DocumentClassification, string> = {
      PUBLICO: 'success',
      INTERNO: 'info',
      RESTRINGIDO: 'warning',
      CONFIDENCIAL: 'danger',
    };

    return tones[classification];
  }

  getStatusTone(status: DocumentStatus): string {
    if (status === 'FIRMADO' || status === 'INMUTABLE') {
      return 'success';
    }

    if (status === 'PENDIENTE') {
      return 'warning';
    }

    return 'danger';
  }

  formatDate(value: string | undefined): string {
    if (!value) {
      return 'No registrado';
    }

    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  }

  shortHash(hash: string): string {
    if (hash.length <= 24) {
      return hash;
    }

    return `${hash.slice(0, 12)}...${hash.slice(-12)}`;
  }

  private createAccessRequest(): void {
    const document = this.document;
    const user = this.currentUser();

    if (!document || !user) {
      this.actionMessage = 'No se pudo registrar la solicitud de acceso.';
      throw new Error('ACCESS_REQUEST_CONTEXT_NOT_FOUND');
    }

    const stored = localStorage.getItem(ACCESS_REQUEST_STORAGE_KEY);
    const requests: StoredAccessRequest[] = stored
      ? (JSON.parse(stored) as StoredAccessRequest[])
      : [];

    const alreadyExists = requests.some((request) => {
      return (
        request.document === document.repCode &&
        request.requester === user.username &&
        request.status === 'Pendiente'
      );
    });

    if (alreadyExists) {
      this.actionMessage =
        'Ya existe una solicitud pendiente para este documento.';
      throw new Error('DUPLICATED_ACCESS_REQUEST');
    }

    const nextNumber = this.getNextRequestNumber(requests);
    const code = `S-2026-${String(nextNumber).padStart(3, '0')}`;

    const request: StoredAccessRequest = {
      code,
      type:
        document.classification === 'CONFIDENCIAL'
          ? 'Acceso confidencial'
          : 'Acceso restringido',
      document: document.repCode,
      documentTitle: document.title,
      requester: user.username,
      requesterName: user.fullName,
      dependency: user.dependency,
      justification:
        'Solicitud generada desde el detalle documental para revisión del responsable autorizado.',
      date: new Date().toISOString(),
      status: 'Pendiente',
      createdByCurrentUser: true,
    };

    requests.push(request);
    localStorage.setItem(ACCESS_REQUEST_STORAGE_KEY, JSON.stringify(requests));
  }

  private getNextRequestNumber(requests: StoredAccessRequest[]): number {
    const storedNumbers = requests
      .map((request) => {
        const match = request.code.match(/^S-2026-(\d+)$/);
        return match ? Number(match[1]) : 0;
      })
      .filter((value) => value > 0);

    const maxStoredNumber = storedNumbers.length > 0 ? Math.max(...storedNumbers) : 2;

    return maxStoredNumber + 1;
  }

  private handleAction(action: DetailAction): void {
    const document = this.document;

    if (!document) {
      this.actionMessage = 'No hay documento seleccionado.';
      return;
    }

    if (action !== 'requestAccess' && !this.hasAccess()) {
      this.actionMessage =
        'Acción bloqueada: este documento requiere autorización previa.';
      return;
    }

    if (action === 'download' && !this.canDownload()) {
      this.actionMessage =
        'Descarga no disponible para este estado documental.';
      return;
    }

    const messages: Record<DetailAction, string> = {
      openViewer: `Visor abierto en simulación para ${document.repCode}.`,
      download: `Descarga simulada: ${document.fileName}.`,
      viewRep: `Validación REP simulada para ${document.repCode}.`,
      viewHistory: `Historial de trazabilidad simulado para ${document.repCode}.`,
      requestAccess: `Solicitud de acceso registrada en simulación para ${document.repCode}.`,
    };

    this.actionMessage = messages[action];
  }
}
