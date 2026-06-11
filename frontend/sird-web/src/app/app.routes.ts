import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';

import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { Search } from './features/search/search';
import { Requests } from './features/requests/requests';
import { Verification } from './features/verification/verification';
import { Workspaces } from './features/workspaces/workspaces';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'app',
    component: MainLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio',
      },
      {
        path: 'inicio',
        component: Dashboard,
        title: 'Inicio | SIRD',
      },
      {
        path: 'busqueda-documental',
        component: Search,
        title: 'Búsqueda documental | SIRD',
      },
      {
        path: 'solicitudes',
        component: Requests,
        title: 'Solicitudes y notificaciones | SIRD',
      },
      {
        path: 'verificacion-rep',
        component: Verification,
        title: 'Verificación REP | SIRD',
      },
      {
        path: 'espacios-colaborativos',
        component: Workspaces,
        title: 'Espacios colaborativos | SIRD',
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('./features/configuration/configuration').then(
            (m) => m.Configuration,
          ),
        title: 'Configuración | SIRD',
      },
      {
        path: 'usuarios-roles',
        loadComponent: () =>
          import('./features/users-roles/users-roles').then(
            (m) => m.UsersRoles,
          ),
        title: 'Usuarios y roles | SIRD',
      },
      {
        path: 'sistemas-integrados',
        loadComponent: () =>
          import('./features/integrated-systems/integrated-systems').then(
            (m) => m.IntegratedSystems,
          ),
        title: 'Sistemas integrados | SIRD',
      },
      {
        path: 'auditoria',
        loadComponent: () =>
          import('./features/audit/audit').then((m) => m.Audit),
        title: 'Auditoría | SIRD',
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/reports/reports').then((m) => m.Reports),
        title: 'Reportes | SIRD',
      },
      {
        path: 'detalle-documental',
        loadComponent: () =>
          import('./features/document-detail/document-detail').then(
            (m) => m.DocumentDetail,
          ),
        title: 'Detalle documental | SIRD',
      },
      {
        path: 'acceso-no-autorizado',
        loadComponent: () =>
          import('./features/unauthorized/unauthorized').then(
            (m) => m.Unauthorized,
          ),
        title: 'Acceso no autorizado | SIRD',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
