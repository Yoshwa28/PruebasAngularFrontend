import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { SirdRoleId, SirdUser } from '../../../core/models/auth.models';

interface LoginRoleOption {
  id: SirdRoleId;
  label: string;
  username: string;
}

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = 'admin_sird';
  password = '123456';
  selectedRole: SirdRoleId = 'ADMIN_SIRD';

  loading = false;
  errorMessage = '';
  infoMessage = 'Usuario demo: admin_sird / Contraseña: 123456';

  roles: LoginRoleOption[] = [
    {
      id: 'ADMIN_SIRD',
      label: 'Administrador SIRD',
      username: 'admin_sird',
    },
    {
      id: 'GERENTE',
      label: 'Gerente / Sub Gerente',
      username: 'gerente_regional',
    },
    {
      id: 'JEFE_DEPENDENCIA',
      label: 'Jefe de Dependencia / Proyecto',
      username: 'jefe_dependencia',
    },
    {
      id: 'ESPECIALISTA_RESPONSABLE',
      label: 'Especialista Responsable',
      username: 'especialista_responsable',
    },
    {
      id: 'TECNICO_ADMINISTRATIVO',
      label: 'Técnico / Administrativo',
      username: 'tecnico_administrativo',
    },
  ];

  demoUsers: SirdUser[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.demoUsers = this.authService.getDemoUsers();
  }

  onRoleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SirdRoleId;
    this.selectedRole = value;

    const role = this.roles.find((item) => item.id === value);

    if (role) {
      this.username = role.username;
      this.password = '123456';
      this.errorMessage = '';
      this.infoMessage = `Usuario demo seleccionado: ${role.username} / Contraseña: 123456`;
    }
  }

  login(): void {
    this.errorMessage = '';
    this.loading = true;

    const success = this.authService.login({
      username: this.username,
      password: this.password,
    });

    if (!success) {
      this.loading = false;
      this.errorMessage =
        'Credenciales inválidas. Use un usuario demo y la contraseña 123456.';
      return;
    }

    this.loading = false;
    this.router.navigateByUrl('/app/inicio');
  }

  useDemoUser(username: string): void {
    const user = this.demoUsers.find((item) => item.username === username);

    if (!user) {
      return;
    }

    this.username = user.username;
    this.password = '123456';
    this.selectedRole = user.roleId;
    this.errorMessage = '';
    this.infoMessage = `Usuario demo seleccionado: ${user.username} / Contraseña: 123456`;
  }

  recoverPassword(): void {
    this.errorMessage = '';
    this.infoMessage =
      'Recuperación de contraseña simulada. En producción se integrará con correo institucional.';
  }
}
