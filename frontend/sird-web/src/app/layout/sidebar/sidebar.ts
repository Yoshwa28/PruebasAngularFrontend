import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface SidebarItem {
  code: string;
  label: string;
  mobileLabel: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  menuItems: SidebarItem[] = [
    {
      code: 'IN',
      label: 'Inicio',
      mobileLabel: 'Inicio',
      route: '/app/inicio',
    },
    {
      code: 'BD',
      label: 'Búsqueda documental',
      mobileLabel: 'Buscar',
      route: '/app/busqueda-documental',
    },
    {
      code: 'DD',
      label: 'Detalle documental',
      mobileLabel: 'Detalle',
      route: '/app/detalle-documental',
    },
    {
      code: 'SN',
      label: 'Solicitudes y notificaciones',
      mobileLabel: 'Solic.',
      route: '/app/solicitudes',
    },
    {
      code: 'VR',
      label: 'Verificación REP',
      mobileLabel: 'Verif.',
      route: '/app/verificacion-rep',
    },
    {
      code: 'EC',
      label: 'Espacios colaborativos',
      mobileLabel: 'Espacios',
      route: '/app/espacios-colaborativos',
    },
    {
      code: 'CF',
      label: 'Configuración',
      mobileLabel: 'Config.',
      route: '/app/configuracion',
    },
    {
      code: 'UR',
      label: 'Usuarios y roles',
      mobileLabel: 'Usuarios',
      route: '/app/usuarios-roles',
    },
    {
      code: 'SI',
      label: 'Sistemas integrados',
      mobileLabel: 'Sistemas',
      route: '/app/sistemas-integrados',
    },
    {
      code: 'AU',
      label: 'Auditoría',
      mobileLabel: 'Auditoría',
      route: '/app/auditoria',
    },
    {
      code: 'RP',
      label: 'Reportes',
      mobileLabel: 'Reportes',
      route: '/app/reportes',
    },
  ];
}
