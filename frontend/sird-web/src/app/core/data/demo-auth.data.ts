import { SirdRole, SirdUser } from '../models/auth.models';

export const SIRD_ROLES: SirdRole[] = [
  {
    id: 'ADMIN_SIRD',
    label: 'Administrador SIRD',
    description: 'Administra usuarios, roles, configuraciones y auditoría.',
  },
  {
    id: 'GERENTE',
    label: 'Gerente / Sub Gerente',
    description: 'Consulta información institucional y reportes ejecutivos.',
  },
  {
    id: 'JEFE_DEPENDENCIA',
    label: 'Jefe de Dependencia / Proyecto',
    description: 'Gestiona documentos y solicitudes de su dependencia.',
  },
  {
    id: 'ESPECIALISTA_RESPONSABLE',
    label: 'Especialista Responsable',
    description: 'Registra, clasifica y verifica documentación técnica.',
  },
  {
    id: 'TECNICO_ADMINISTRATIVO',
    label: 'Técnico / Administrativo',
    description: 'Consulta documentos y registra solicitudes operativas.',
  },
];

export const SIRD_USERS: SirdUser[] = [
  {
    id: 1,
    fullName: 'María Rodríguez Quispe',
    username: 'admin_sird',
    email: 'admin.sird@regioncusco.gob.pe',
    initials: 'MR',
    dependency: 'Oficina de Tecnologías de la Información',
    position: 'Administradora del SIRD',
    roleId: 'ADMIN_SIRD',
  },
  {
    id: 2,
    fullName: 'Carlos Huamán Paredes',
    username: 'gerente_regional',
    email: 'gerencia@regioncusco.gob.pe',
    initials: 'CH',
    dependency: 'Gerencia Regional',
    position: 'Gerente Regional',
    roleId: 'GERENTE',
  },
  {
    id: 3,
    fullName: 'Lucía Quispe Mamani',
    username: 'jefe_dependencia',
    email: 'jefatura@regioncusco.gob.pe',
    initials: 'LQ',
    dependency: 'Gerencia Regional de Infraestructura',
    position: 'Jefa de Dependencia',
    roleId: 'JEFE_DEPENDENCIA',
  },
  {
    id: 4,
    fullName: 'Alberto Pérez Ccama',
    username: 'especialista_responsable',
    email: 'especialista@regioncusco.gob.pe',
    initials: 'AP',
    dependency: 'Archivo Central',
    position: 'Especialista Responsable',
    roleId: 'ESPECIALISTA_RESPONSABLE',
  },
  {
    id: 5,
    fullName: 'Tomás Condori Huillca',
    username: 'tecnico_administrativo',
    email: 'tecnico@regioncusco.gob.pe',
    initials: 'TC',
    dependency: 'Mesa de Partes',
    position: 'Técnico Administrativo',
    roleId: 'TECNICO_ADMINISTRATIVO',
  },
];
