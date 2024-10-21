import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../servicios/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: ApiService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLogin) {  // Verifica si el usuario está logueado
      this.router.navigate(['/inicio']); // Redirige a la página home o cualquier otra que quieras
      return false; // Evita la navegación a la página si el usuario está logueado
    }
    return true; // Permite el acceso si no está logueado
  }
}