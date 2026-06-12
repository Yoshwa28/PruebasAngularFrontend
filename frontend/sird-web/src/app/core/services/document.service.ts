import { Injectable } from '@angular/core';

import { SIRD_DOCUMENTS } from '../data/demo-documents.data';
import {
  DocumentSearchFilters,
  SirdDocument,
} from '../models/document.models';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  getDocuments(): SirdDocument[] {
    return SIRD_DOCUMENTS;
  }

  getDocumentById(id: number): SirdDocument | undefined {
    return SIRD_DOCUMENTS.find((item) => item.id === id);
  }

  getDocumentByRepCode(repCode: string): SirdDocument | undefined {
    const normalized = repCode.trim().toUpperCase();

    return SIRD_DOCUMENTS.find(
      (item) => item.repCode.toUpperCase() === normalized,
    );
  }

  searchDocuments(filters: DocumentSearchFilters): SirdDocument[] {
    const query = filters.query.trim().toLowerCase();

    return SIRD_DOCUMENTS.filter((document) => {
      const matchesQuery =
        !query ||
        document.title.toLowerCase().includes(query) ||
        document.summary.toLowerCase().includes(query) ||
        document.repCode.toLowerCase().includes(query) ||
        document.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesClassification =
        filters.classification === 'TODOS' ||
        document.classification === filters.classification;

      const matchesStatus =
        filters.status === 'TODOS' || document.status === filters.status;

      const matchesDependency =
        !filters.dependency ||
        document.dependency === filters.dependency;

      return (
        matchesQuery &&
        matchesClassification &&
        matchesStatus &&
        matchesDependency
      );
    });
  }

  getDependencies(): string[] {
    return Array.from(
      new Set(SIRD_DOCUMENTS.map((document) => document.dependency)),
    ).sort();
  }

  getDashboardMetrics(): {
    totalDocuments: number;
    signedDocuments: number;
    restrictedDocuments: number;
    pendingDocuments: number;
  } {
    return {
      totalDocuments: SIRD_DOCUMENTS.length,
      signedDocuments: SIRD_DOCUMENTS.filter(
        (item) => item.status === 'FIRMADO' || item.status === 'INMUTABLE',
      ).length,
      restrictedDocuments: SIRD_DOCUMENTS.filter(
        (item) =>
          item.classification === 'RESTRINGIDO' ||
          item.classification === 'CONFIDENCIAL',
      ).length,
      pendingDocuments: SIRD_DOCUMENTS.filter(
        (item) => item.status === 'PENDIENTE',
      ).length,
    };
  }
}
