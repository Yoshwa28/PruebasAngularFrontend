import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { AuditService } from '../../core/services/audit.service';
import { DocumentService } from '../../core/services/document.service';
import { includesAnyFlexible, includesFlexible } from '../../core/utils/text-normalizer';
import {
  DocumentClassification,
  DocumentStatus,
  SirdDocument,
} from '../../core/models/document.models';

type ClassificationFilter = 'TODOS' | DocumentClassification;
type StatusFilter = 'TODOS' | DocumentStatus;

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  private readonly documentService = inject(DocumentService);
  private readonly authService = inject(AuthService);
  private readonly auditService = inject(AuditService);
  private readonly router = inject(Router);

  query = '';
  repCode = '';
  classification: ClassificationFilter = 'TODOS';
  status: StatusFilter = 'TODOS';
  dependency = '';

  results: SirdDocument[] = [];
  dependencies = this.documentService.getDependencies();

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

  private readonly sessionWatcher = effect(() => {
    const session = this.session();

    if (!session) {
      this.results = [];
      return;
    }

    this.applySearch();
  });

  ngOnInit(): void {
    this.applySearch();
  }

  search(): void {
    this.applySearch();
    this.auditSearch();
  }

  onFilterChange(): void {
    this.applySearch();
  }

  clear(): void {
    this.query = '';
    this.repCode = '';
    this.classification = 'TODOS';
    this.status = 'TODOS';
    this.dependency = '';

    this.applySearch();
  }

  openDetail(document: SirdDocument): void {
    this.auditService.register({
      module: 'Búsqueda documental',
      action: 'Apertura de detalle documental',
      resource: document.repCode,
      result: 'Correcto',
      detail: `Documento abierto desde búsqueda documental: ${document.title}.`,
    });

    this.router.navigate(['/app/detalle-documental'], {
      queryParams: {
        id: document.id,
        rep: document.repCode,
      },
    });
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

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  }

  private applySearch(): void {
    const documents = this.documentService.getDocuments();
    const scopedDocuments = this.applyRoleScope(documents);

    this.results = scopedDocuments.filter((document) => {
      const matchesQuery = this.matchesTextQuery(document);
      const matchesRep = this.matchesRepCode(document);
      const matchesClassification =
        this.classification === 'TODOS' ||
        document.classification === this.classification;
      const matchesStatus =
        this.status === 'TODOS' || document.status === this.status;
      const matchesDependency =
        !this.dependency || document.dependency === this.dependency;

      return (
        matchesQuery &&
        matchesRep &&
        matchesClassification &&
        matchesStatus &&
        matchesDependency
      );
    });
  }

  private matchesTextQuery(document: SirdDocument): boolean {
    return includesAnyFlexible(
      [
        document.title,
        document.summary,
        document.dependency,
        document.author,
        document.repCode,
        document.classification,
        document.status,
        ...document.tags,
      ],
      this.query,
    );
  }

  private matchesRepCode(document: SirdDocument): boolean {
    return includesFlexible(document.repCode, this.repCode);
  }

  private applyRoleScope(documents: SirdDocument[]): SirdDocument[] {
    const user = this.currentUser();
    const role = this.currentRole();

    if (!user || !role) {
      return [];
    }

    if (role.id === 'ADMIN_SIRD' || role.id === 'GERENTE') {
      return documents;
    }

    return documents.filter((document) => {
      if (document.classification === 'PUBLICO') {
        return true;
      }

      if (document.classification === 'INTERNO') {
        return (
          document.dependency === user.dependency ||
          document.author === user.fullName
        );
      }

      if (document.classification === 'RESTRINGIDO') {
        return (
          document.author === user.fullName ||
          (role.id === 'JEFE_DEPENDENCIA' &&
            document.dependency === user.dependency)
        );
      }

      if (document.classification === 'CONFIDENCIAL') {
        return document.author === user.fullName;
      }

      return false;
    });
  }

  private auditSearch(): void {
    const user = this.currentUser();
    const role = this.currentRole();

    if (!user || !role) {
      return;
    }

    const resource = this.getSearchResourceLabel();
    const filters = this.getSearchFiltersLabel();

    this.auditService.register({
      module: 'Búsqueda documental',
      action: 'Consulta documental',
      resource,
      result: this.results.length > 0 ? 'Correcto' : 'Advertencia',
      detail:
        this.results.length > 0
          ? `Consulta realizada con ${this.results.length} resultado(s). ${filters}`
          : `Consulta sin resultados visibles para el perfil ${role.label}. ${filters}`,
    });
  }

  private getSearchResourceLabel(): string {
    const parts: string[] = [];

    if (this.query.trim()) {
      parts.push(`Texto: ${this.query.trim()}`);
    }

    if (this.repCode.trim()) {
      parts.push(`REP: ${this.repCode.trim()}`);
    }

    if (this.classification !== 'TODOS') {
      parts.push(`Clasificación: ${this.getClassificationLabel(this.classification)}`);
    }

    if (this.status !== 'TODOS') {
      parts.push(`Estado: ${this.getStatusLabel(this.status)}`);
    }

    if (this.dependency.trim()) {
      parts.push(`Dependencia: ${this.dependency.trim()}`);
    }

    if (parts.length === 0) {
      return 'Consulta general';
    }

    return parts.join(' | ');
  }

  private getSearchFiltersLabel(): string {
    const filters = {
      texto: this.query.trim() || 'Sin texto',
      rep: this.repCode.trim() || 'Sin REP',
      clasificacion: this.classification,
      estado: this.status,
      dependencia: this.dependency.trim() || 'Todas',
      resultados: this.results.length,
    };

    return `Filtros: ${JSON.stringify(filters)}.`;
  }
}
