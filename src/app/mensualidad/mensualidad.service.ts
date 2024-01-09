import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mensualidad } from './models/mensualidad';

@Injectable({
  providedIn: 'root'
})
export class MensualidadService {

  private urlEndPoint: string = 'http://localhost:8085/api/mensualidades';

  constructor( private http: HttpClient) { }

  getMensualidad(id: number): Observable<Mensualidad> {
    return this.http.get<Mensualidad>(`${this.urlEndPoint}/${id}`);
  }

  delete(id: number): Observable<void>{
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  create(mensualidad: Mensualidad): Observable<Mensualidad> {
    return this.http.post<Mensualidad>(this.urlEndPoint, mensualidad);
  }
}