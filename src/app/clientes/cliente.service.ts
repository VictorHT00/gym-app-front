import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe, formatDate } from '@angular/common';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';
import { CostoPlan } from '../costos/costoPlan';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8085/api/clientes';

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap 1');
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
      })
    )

  };

  create(cliente: Cliente): Observable<any> {
    return this.http.post<any>(this.urlEndPoint, cliente).pipe(
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }

        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {

    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {

        if (e.status != 401 && e.error.mensaje) {
          //this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    )
  }

  getClienteByTelefono(telefono):Observable<Cliente> {

    return this.http.get<Cliente>(`${this.urlEndPoint}/check-in/${telefono}`).pipe(
      catchError(e => {

        if (e.status != 401 && e.error.mensaje) {
          console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    )
  }

  getClienteByNoCliente(noCliente: number):Observable<Cliente> {

    return this.http.get<Cliente>(`${this.urlEndPoint}/check-in/nocliente/${noCliente}`).pipe(
      catchError(e => {

        if (e.status != 401 && e.error.mensaje) {
          console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    )
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError((e) => {

        if (e.status == 400) {
          return throwError(e);
        }

        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {

        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }

  getCostos(): Observable<CostoPlan[]> {
    return this.http.get<CostoPlan[]>(this.urlEndPoint + '/costos');
  }

  getCosto(id: number): Observable<CostoPlan>{
    return this.http.get<CostoPlan>(`${this.urlEndPoint}/costos/${id}`);
  }

  updateCostos(costoPlan: CostoPlan): Observable<CostoPlan>{
    return this.http.put<any>(`${this.urlEndPoint}/costos/${costoPlan.id}`, costoPlan);
  }
} 
