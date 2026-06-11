import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

interface RoleOption {
  id: string;
  label: string;
  user: string;
  username: string;
  initials: string;
}

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  currentTitle = 'Inicio';
  userMenuOpen = false;

  roles: RoleOption[] = [
    {
      id: 'ADMIN_SIRD',
      label: 'Administrador SIRD',
      user: 'María Rodríguez Quispe',
      username: 'admin_sird',
      initials: 'MR',
    },
    {
      id: 'GERENTE',
      label: 'Gerente / Sub Gerente',
      user: 'Carlos Huamán Paredes',
      username: 'gerente_regional',
      initials: 'CH',
    },
    {
      id: 'JEFE_DEPENDENCIA',
      label: 'Jefe de Dependencia / Proyecto',
      user: 'Lucía Quispe Mamani',
      username: 'jefe_dependencia',
      initials: 'LQ',
    },
    {
      id: 'ESPECIALISTA_RESPONSABLE',
      label: 'Especialista Responsable',
      user: 'Alberto Pérez Ccama',
      username: 'especialista_responsable',
      initials: 'AP',
    },
    {
      id: 'TECNICO_ADMINISTRATIVO',
      label: 'Técnico / Administrativo',
      user: 'Tomás Condori Huillca',
      username: 'tecnico_administrativo',
      initials: 'TC',
    },
  ];

  selectedRole = this.roles[0];

  private routeTitles: Record<string, string> = {
    '/app/inicio': 'Inicio',
    '/app/busqueda-documental': 'Búsqueda documental',
    '/app/detalle-documental': 'Detalle documental',
    '/app/solicitudes': 'Solicitudes y notificaciones',
    '/app/verificacion-rep': 'Verificación de autenticidad por REP',
    '/app/espacios-colaborativos': 'Espacios colaborativos',
    '/app/configuracion': 'Configuración del sistema',
    '/app/usuarios-roles': 'Usuarios y roles',
    '/app/sistemas-integrados': 'Sistemas integrados',
    '/app/auditoria': 'Auditoría',
    '/app/reportes': 'Reportes del SIRD',
    '/app/acceso-no-autorizado': 'Acceso no autorizado',
  };

  constructor(private router: Router) {
    const storedRole = localStorage.getItem('sird_role');
    const role = this.roles.find((item) => item.id === storedRole);

    if (role) {
      this.selectedRole = role;
    }

    this.updateTitle(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateTitle(event.urlAfterRedirects);
        this.userMenuOpen = false;
      });
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.userMenuOpen = false;
  }

  onRoleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const role = this.roles.find((item) => item.id === value);

    if (role) {
      this.selectedRole = role;
      localStorage.setItem('sird_role', role.id);
      this.userMenuOpen = false;
    }
  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  logout(): void {
    localStorage.removeItem('sird_role');
    this.userMenuOpen = false;
    this.router.navigateByUrl('/login');
  }

  resetData(): void {
    console.log('Datos restablecidos en simulación.');
  }

  showAlerts(): void {
    console.log('Panel de avisos en simulación.');
  }

  private updateTitle(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0];
    this.currentTitle = this.routeTitles[cleanUrl] ?? 'Inicio';
  }
}
