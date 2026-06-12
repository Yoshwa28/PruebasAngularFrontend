import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { SIRD_ROLES, SIRD_USERS } from '../data/demo-auth.data';
import {
  AuthSession,
  LoginRequest,
  SirdRole,
  SirdRoleId,
  SirdUser,
} from '../models/auth.models';

const SESSION_KEY = 'sird_session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly sessionSignal = signal<AuthSession | null>(
    this.readSession(),
  );

  readonly session = this.sessionSignal.asReadonly();

  constructor(private router: Router) {}

  login(request: LoginRequest): boolean {
    const username = request.username.trim().toLowerCase();

    const user = SIRD_USERS.find((item) => item.username === username);

    if (!user) {
      return false;
    }

    // MVP demo: contraseña simple para todos los usuarios
    if (request.password !== '123456') {
      return false;
    }

    const role = this.getRoleById(user.roleId);

    const session: AuthSession = {
      token: `demo-token-${user.username}-${Date.now()}`,
      user,
      role,
      issuedAt: new Date().toISOString(),
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('sird_role', role.id);

    this.sessionSignal.set(session);

    return true;
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('sird_role');
    this.sessionSignal.set(null);
    this.router.navigateByUrl('/login');
  }

  isAuthenticated(): boolean {
    return this.sessionSignal() !== null;
  }

  getCurrentUser(): SirdUser | null {
    return this.sessionSignal()?.user ?? null;
  }

  getCurrentRole(): SirdRole | null {
    return this.sessionSignal()?.role ?? null;
  }

  changeRole(roleId: SirdRoleId): void {
  const current = this.sessionSignal();

  if (!current) {
    return;
  }

  const role = this.getRoleById(roleId);

  const userForRole = SIRD_USERS.find((user) => user.roleId === roleId);

  const updatedUser: SirdUser = userForRole
    ? userForRole
    : {
        ...current.user,
        roleId,
      };

  const updatedSession: AuthSession = {
    ...current,
    user: updatedUser,
    role,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
  localStorage.setItem('sird_role', role.id);

  this.sessionSignal.set(updatedSession);
}


  getDemoUsers(): SirdUser[] {
    return SIRD_USERS;
  }

  getRoles(): SirdRole[] {
    return SIRD_ROLES;
  }

  private getRoleById(roleId: SirdRoleId): SirdRole {
    const role = SIRD_ROLES.find((item) => item.id === roleId);

    if (!role) {
      throw new Error(`Rol no encontrado: ${roleId}`);
    }

    return role;
  }

  private readSession(): AuthSession | null {
    const raw = localStorage.getItem(SESSION_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }
}
