import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private usuarioSubject = new BehaviorSubject<string>('');
  private fotoPerfilSubject = new BehaviorSubject<string>('');

  public usuario$ = this.usuarioSubject.asObservable();
  public fotoPerfil$ = this.fotoPerfilSubject.asObservable();

  updateUsuario(nombre: string): void {
    this.usuarioSubject.next(nombre);
  }

  updateFotoPerfil(fotoUrl: string): void {
    this.fotoPerfilSubject.next(fotoUrl);
  }

  clearUserData(): void {
    this.usuarioSubject.next('');
    this.fotoPerfilSubject.next('');
  }
}
