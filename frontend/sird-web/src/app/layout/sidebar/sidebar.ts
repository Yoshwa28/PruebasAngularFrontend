import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface SidebarItem {
  code: string;
  label: string;
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
      route: '/app/inicio',
    },
    {
      code: 'BD',
      label: 'Búsqueda documental',
      route: '/app/busqueda-documental',
    },
    {
      code: 'DD',
      label: 'Detalle documental',
      route: '/app/detalle-documental',
    },
    {
      code: 'SN',
      label: 'Solicitudes y notificaciones',
      route: '/app/solicitudes',
    },
    {
      code: 'VR',
      label: 'Verificación REP',
      route: '/app/verificacion-rep',
    },
    {
      code: 'EC',
      label: 'Espacios colaborativos',
      route: '/app/espacios-colaborativos',
    },
    {
      code: 'CF',
      label: 'Configuración',
      route: '/app/configuracion',
    },
    {
      code: 'UR',
      label: 'Usuarios y roles',
      route: '/app/usuarios-roles',
    },
    {
      code: 'SI',
      label: 'Sistemas integrados',
      route: '/app/sistemas-integrados',
    },
    {
      code: 'AU',
      label: 'Auditoría',
      route: '/app/auditoria',
    },
    {
      code: 'RP',
      label: 'Reportes',
      route: '/app/reportes',
    },
  ];
}
