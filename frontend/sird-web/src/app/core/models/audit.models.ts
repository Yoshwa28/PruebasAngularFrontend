export type AuditResult = 'Correcto' | 'Advertencia' | 'Bloqueado';

export type AuditModule =
  | 'Autenticación'
  | 'Búsqueda documental'
  | 'Detalle documental'
  | 'Verificación REP'
  | 'Solicitudes'
  | 'Espacios colaborativos'
  | 'Reportes'
  | 'Configuración'
  | 'Usuarios y roles'
  | 'Sistemas integrados'
  | 'Auditoría';

export interface AuditEvent {
  id: string;
  date: string;
  user: string;
  userLabel: string;
  action: string;
  module: AuditModule;
  resource: string;
  result: AuditResult;
  detail: string;
}

export interface AuditRegisterRequest {
  module: AuditModule;
  action: string;
  resource: string;
  result: AuditResult;
  detail: string;
  user?: string;
  userLabel?: string;
  date?: string;
}

export interface AuditExportPayload {
  exportedAt: string;
  exportedBy: string;
  role: string;
  filters: {
    user: string;
    module: string;
    result: string;
  };
  total: number;
  events: AuditEvent[];
}
