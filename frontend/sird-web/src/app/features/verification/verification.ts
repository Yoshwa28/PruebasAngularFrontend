import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DocumentService } from '../../core/services/document.service';
import {
  DocumentClassification,
  DocumentStatus,
  SirdDocument,
} from '../../core/models/document.models';

type VerificationState = 'idle' | 'valid' | 'unsigned' | 'not-found' | 'warning';

interface VerificationMetric {
  label: string;
  value: string;
  tone: 'success' | 'info' | 'warning' | 'danger' | 'neutral';
}

@Component({
  selector: 'app-verification',
  imports: [FormsModule],
  templateUrl: './verification.html',
  styleUrl: './verification.css',
})
export class Verification {
  private readonly documentService = inject(DocumentService);
  private readonly router = inject(Router);

  repCode = '';
  verified = false;
  document: SirdDocument | null = null;
  state: VerificationState = 'idle';
  certificateMessage = '';

  metrics = computed<VerificationMetric[]>(() => {
    const document = this.document;

    if (!this.verified) {
      return [
        {
          label: 'Consulta REP',
          value: 'Pendiente',
          tone: 'neutral',
        },
        {
          label: 'Firma PKI',
          value: 'Sin evaluar',
          tone: 'neutral',
        },
        {
          label: 'Registro',
          value: 'Sin validar',
          tone: 'neutral',
        },
        {
          label: 'Integridad',
          value: 'Sin evaluar',
          tone: 'neutral',
        },
      ];
    }

    if (!document) {
      return [
        {
          label: 'Consulta REP',
          value: 'No encontrado',
          tone: 'danger',
        },
        {
          label: 'Firma PKI',
          value: 'No aplica',
          tone: 'neutral',
        },
        {
          label: 'Registro',
          value: 'Sin registro',
          tone: 'danger',
        },
        {
          label: 'Integridad',
          value: 'No verificable',
          tone: 'danger',
        },
      ];
    }

    return [
      {
        label: 'Consulta REP',
        value: 'Encontrado',
        tone: 'success',
      },
      {
        label: 'Firma PKI',
        value: this.getPkiLabel(document.status),
        tone:
          document.status === 'FIRMADO' || document.status === 'INMUTABLE'
            ? 'success'
            : 'warning',
      },
      {
        label: 'Registro',
        value: this.getStatusLabel(document.status),
        tone: this.getStatusTone(document.status),
      },
      {
        label: 'Integridad',
        value: document.hash ? 'Hash registrado' : 'Sin hash',
        tone: document.hash ? 'success' : 'danger',
      },
    ];
  });

  verify(): void {
    const normalized = this.repCode.trim().toUpperCase();

    this.verified = true;
    this.certificateMessage = '';

    if (!normalized) {
      this.document = null;
      this.state = 'not-found';
      return;
    }

    this.repCode = normalized;
    this.document = this.documentService.getDocumentByRepCode(normalized) ?? null;

    if (!this.document) {
      this.state = 'not-found';
      return;
    }

    if (this.document.status === 'PENDIENTE' || this.document.status === 'OBSERVADO') {
      this.state = 'warning';
      return;
    }

    if (this.document.status === 'FIRMADO' || this.document.status === 'INMUTABLE') {
      this.state = 'valid';
      return;
    }

    this.state = 'unsigned';
  }

  clear(): void {
    this.repCode = '';
    this.verified = false;
    this.document = null;
    this.state = 'idle';
    this.certificateMessage = '';
  }

  generateCertificate(): void {
    if (!this.document || !this.canGenerateCertificate()) {
      this.certificateMessage =
        'La constancia solo está disponible para documentos firmados o inmutables.';
      return;
    }

    this.certificateMessage = `Constancia simulada generada para ${this.document.repCode}.`;
  }

  openDetail(): void {
    if (!this.document) {
      return;
    }

    this.router.navigate(['/app/detalle-documental'], {
      queryParams: {
        id: this.document.id,
        rep: this.document.repCode,
      },
    });
  }

  canGenerateCertificate(): boolean {
    return (
      !!this.document &&
      (this.document.status === 'FIRMADO' || this.document.status === 'INMUTABLE')
    );
  }

  getResultTitle(): string {
    if (!this.verified) {
      return 'Sin verificación';
    }

    if (!this.document) {
      return 'Documento no encontrado';
    }

    if (this.state === 'warning') {
      return 'Documento registrado con observaciones';
    }

    if (this.state === 'valid') {
      return 'Documento verificado correctamente';
    }

    return 'Documento registrado sin firma válida';
  }

  getResultDescription(): string {
    if (!this.verified) {
      return 'Ingrese un código REP y presione Verificar.';
    }

    if (!this.document) {
      return 'El código REP consultado no existe en el repositorio demo del SIRD.';
    }

    if (this.state === 'warning') {
      return 'El código REP existe, pero el documento aún requiere revisión documental o presenta observaciones.';
    }

    if (this.state === 'valid') {
      return 'El código REP corresponde a un documento registrado, con hash disponible y trazabilidad documental simulada.';
    }

    return 'El documento existe, pero aún no cuenta con firma PKI registrada.';
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
      return 'Firma válida';
    }

    return 'Sin firma válida';
  }

  getTrdLabel(status: DocumentStatus): string {
    if (status === 'PENDIENTE' || status === 'OBSERVADO') {
      return 'Por revisar';
    }

    return 'Vigente';
  }

  getStatusTone(status: DocumentStatus): 'success' | 'warning' | 'danger' {
    if (status === 'FIRMADO' || status === 'INMUTABLE') {
      return 'success';
    }

    if (status === 'PENDIENTE') {
      return 'warning';
    }

    return 'danger';
  }

  getResultBadgeLabel(): string {
    if (!this.verified) {
      return 'Sin consulta';
    }

    if (!this.document) {
      return 'No encontrado';
    }

    if (this.state === 'valid') {
      return 'Verificado';
    }

    if (this.state === 'warning') {
      return 'Observado';
    }

    return 'Sin firma';
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
}
