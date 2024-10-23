import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private fotoPerfilSubject = new BehaviorSubject<string>('');
  private usuarioSubject = new BehaviorSubject<string>('');
  private appPagesSubject = new BehaviorSubject<any[]>([]);

  public fotoPerfil$ = this.fotoPerfilSubject.asObservable();
  public usuario$ = this.usuarioSubject.asObservable();
  public appPages$ = this.appPagesSubject.asObservable();

  updateFotoPerfil(fotoUrl: string, addToGalery: boolean = true): void {
    this.fotoPerfilSubject.next(fotoUrl);
  }

  updateUsuario(nombre: string): void {
    this.usuarioSubject.next(nombre);
  }

  updateAppPages(rol: string): void {
    let pages = [];
    if (rol === 'alumno') {
      pages = [
        { title: 'Inicio', url: '/inicio', icon: 'home', enabled: true },
        { title: 'Alta', url: '/alta', icon: 'person-add', enabled: true },
        { title: 'Foto', url: '/photo', icon: 'camera', enabled: true },
        { title: 'Galeria', url: '/galeria', icon: 'image', enabled: true },
      ];
    } else if (rol === 'administrador') {
      pages = [
        { title: 'Inicio', url: '/inicio', icon: 'home', enabled: true },
        { title: 'Alta', url: '/alta', icon: 'person-add', enabled: true },
        { title: 'Admin', url: '/panel-admin', icon: 'create', enabled: true },
        {
          title: 'Admin Cursos',
          url: '/panel-admin-cursos',
          icon: 'create',
          enabled: true,
        },
        { title: 'Foto', url: '/photo', icon: 'camera', enabled: true },
        { title: 'Galeria', url: '/galeria', icon: 'image', enabled: true },
        { title: 'Borrar', url: '/borrar', icon: 'trash', enabled: true },
      ];
    } else {
      pages = [
        { title: 'Inicio', url: '/inicio', icon: 'home', enabled: true },
      ];
    }

    this.appPagesSubject.next(pages);
  }

  clearUserData(): void {
    this.fotoPerfilSubject.next('');
    this.usuarioSubject.next('');
    this.appPagesSubject.next([
      { title: 'Inicio', url: '/inicio', icon: 'home', enabled: true },
    ]);
  }
}
