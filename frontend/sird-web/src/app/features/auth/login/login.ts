import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface LoginRole {
  id: string;
  label: string;
}

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  roles: LoginRole[] = [
    {
      id: 'ADMIN_SIRD',
      label: 'Administrador SIRD',
    },
    {
      id: 'GERENTE',
      label: 'Gerente / Sub Gerente',
    },
    {
      id: 'JEFE_DEPENDENCIA',
      label: 'Jefe de Dependencia / Proyecto',
    },
    {
      id: 'ESPECIALISTA_RESPONSABLE',
      label: 'Especialista Responsable',
    },
    {
      id: 'TECNICO_ADMINISTRATIVO',
      label: 'Técnico / Administrativo',
    },
  ];

  selectedRole = 'ADMIN_SIRD';

  constructor(private router: Router) {}

  onRoleChange(event: Event): void {
    this.selectedRole = (event.target as HTMLSelectElement).value;
  }

  login(): void {
    localStorage.setItem('sird_role', this.selectedRole);
    this.router.navigateByUrl('/app/inicio');
  }

  recoverPassword(): void {
    console.log('Recuperar contraseña - simulación.');
  }
}
