export type SirdRoleId =
  | 'ADMIN_SIRD'
  | 'GERENTE'
  | 'JEFE_DEPENDENCIA'
  | 'ESPECIALISTA_RESPONSABLE'
  | 'TECNICO_ADMINISTRATIVO';

export interface SirdRole {
  id: SirdRoleId;
  label: string;
  description: string;
}

export interface SirdUser {
  id: number;
  fullName: string;
  username: string;
  email: string;
  initials: string;
  dependency: string;
  position: string;
  roleId: SirdRoleId;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: SirdUser;
  role: SirdRole;
  issuedAt: string;
}
