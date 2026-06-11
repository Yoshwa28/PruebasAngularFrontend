import { Component } from '@angular/core';

interface SirdUser {
  username: string;
  name: string;
  dependency: string;
  profile: string;
}

@Component({
  selector: 'app-users-roles',
  imports: [],
  templateUrl: './users-roles.html',
  styleUrl: './users-roles.css',
})
export class UsersRoles {
  users: SirdUser[] = [
    {
      username: 'admin_sird',
      name: 'María Rodríguez Quispe',
      dependency: 'Oficina de Tecnologías de la Información',
      profile: 'Administrador SIRD',
    },
    {
      username: 'gerente_regional',
      name: 'Carlos Huamán Paredes',
      dependency: 'Gerencia Regional de Infraestructura',
      profile: 'Gerente / Sub Gerente',
    },
    {
      username: 'jefe_dependencia',
      name: 'Lucía Quispe Mamani',
      dependency: 'Sub Gerencia de Obras',
      profile: 'Jefe de Dependencia / Proyecto',
    },
    {
      username: 'especialista_responsable',
      name: 'Alberto Pérez Ccama',
      dependency: 'Sub Gerencia de Obras',
      profile: 'Especialista Responsable',
    },
    {
      username: 'tecnico_administrativo',
      name: 'Tomás Condori Huillca',
      dependency: 'Mesa de Servicios Administrativos',
      profile: 'Técnico / Administrativo',
    },
  ];

  search(): void {
    console.log('Buscar usuario - simulación.');
  }

  clear(): void {
    console.log('Limpiar búsqueda - simulación.');
  }
}
