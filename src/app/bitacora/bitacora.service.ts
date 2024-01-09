import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bitacora } from './bitacora';
import { Cliente } from '../clientes/cliente';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {

  private urlEndPoint: string = 'http://localhost:8085/api/bitacoras';

  constructor( private http: HttpClient) { }

  getBitacoras(): Observable<Bitacora[]>{
    return this.http.get<Bitacora[]>(this.urlEndPoint);
  }

  getBitacorasByFecha(fecha: Date): Observable<Bitacora[]>{
    return this.http.get<Bitacora[]>(`${this.urlEndPoint}/${fecha}`);
  }

  getBitacorasByFechaAndOperacion(operacion: number, fecha: string): Observable<Bitacora[]>{
    return this.http.get<Bitacora[]>(`${this.urlEndPoint}/of?operacion=${operacion}&fecha=${fecha}`);
  }

  create(bitacora: Bitacora): Observable<Bitacora> {
    return this.http.post<Bitacora>(this.urlEndPoint, bitacora);
  }

  updateCliente(cliente: Cliente): Observable<Bitacora>{
    return this.http.put<Bitacora>(`${this.urlEndPoint}/${cliente.id}`, cliente);
  }
}
