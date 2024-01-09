import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { Rol } from '../usuarios/models/rol';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  let role = route.data['role'] as string;

  if (authService.hasRole(role)) {
    return true;
  }

  Swal.fire({
    title: "Acceso denegado",
    text: `Hola ${authService.usuario.nombre} no tienes acceso a este recurso!`,
    icon: 'warning',
  });

  router.navigate(['/clientes']);
  
  return false;
};
