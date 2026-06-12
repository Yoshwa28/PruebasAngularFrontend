export type RequestStatus =
  | 'PENDIENTE'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'OBSERVADA';

export interface AccessRequest {
  id: number;
  code: string;
  requester: string;
  dependency: string;
  documentTitle: string;
  reason: string;
  status: RequestStatus;
  createdAt: string;
}
