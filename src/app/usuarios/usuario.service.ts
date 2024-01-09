import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuarios/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlEndPoint: string = 'http://localhost:8085/api/usuarios';
  constructor( private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.urlEndPoint);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlEndPoint}/${id}`);
  }

  create(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.urlEndPoint, usuario);
  }

  update(usuario: Usuario): Observable<Usuario>{
    return this.http.put<Usuario>(`${this.urlEndPoint}/${usuario.id}`, usuario);
  }

  updatePassword(usuario: Usuario): Observable<Usuario>{
    return this.http.put<Usuario>(`${this.urlEndPoint}/password/${usuario.id}`, usuario);
  }

  delete(id: number): Observable<Usuario>{
    return this.http.delete<Usuario>(`${this.urlEndPoint}/${id}`);
  }
}
