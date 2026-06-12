import { Component, HostListener, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { SirdRole, SirdRoleId, SirdUser } from '../../core/models/auth.models';

interface RoleOption {
  id: SirdRoleId;
  label: string;
}

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  currentTitle = 'Inicio';
  userMenuOpen = false;

  roles: RoleOption[] = this.authService.getRoles().map((role) => ({
    id: role.id,
    label: role.label,
  }));

  session = this.authService.session;

  currentUser = computed<SirdUser | null>(() => {
    return this.session()?.user ?? null;
  });

  currentRole = computed<SirdRole | null>(() => {
    return this.session()?.role ?? null;
  });

  selectedRoleId = computed<SirdRoleId>(() => {
    return this.currentRole()?.id ?? 'ADMIN_SIRD';
  });

  initials = computed<string>(() => {
    return this.currentUser()?.initials ?? 'US';
  });

  fullName = computed<string>(() => {
    return this.currentUser()?.fullName ?? 'Usuario SIRD';
  });

  username = computed<string>(() => {
    return this.currentUser()?.username ?? 'usuario';
  });

  roleLabel = computed<string>(() => {
    return this.currentRole()?.label ?? 'Rol no definido';
  });

  dependency = computed<string>(() => {
    return this.currentUser()?.dependency ?? 'Dependencia no definida';
  });

  position = computed<string>(() => {
    return this.currentUser()?.position ?? 'Cargo no definido';
  });

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

  constructor() {
    this.updateTitle(this.router.url);

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe((event) => {
        this.updateTitle(event.urlAfterRedirects);
        this.userMenuOpen = false;
      });
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.userMenuOpen = false;
  }

  @HostListener('document:click')
  closeOnDocumentClick(): void {
    this.userMenuOpen = false;
  }

  onRoleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SirdRoleId;

    this.authService.changeRole(value);
    this.userMenuOpen = false;
  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  logout(): void {
    this.userMenuOpen = false;
    this.authService.logout();
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
