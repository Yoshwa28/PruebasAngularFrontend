export type DocumentClassification =
  | 'PUBLICO'
  | 'INTERNO'
  | 'RESTRINGIDO'
  | 'CONFIDENCIAL';

export type DocumentStatus =
  | 'PENDIENTE'
  | 'FIRMADO'
  | 'INMUTABLE'
  | 'OBSERVADO';

export interface SirdDocument {
  id: number;
  repCode: string;
  title: string;
  summary: string;
  dependency: string;
  author: string;
  classification: DocumentClassification;
  status: DocumentStatus;
  createdAt: string;
  signedAt?: string;
  hash: string;
  fileName: string;
  fileSize: string;
  tags: string[];
}

export interface DocumentSearchFilters {
  query: string;
  classification: 'TODOS' | DocumentClassification;
  status: 'TODOS' | DocumentStatus;
  dependency: string;
}
