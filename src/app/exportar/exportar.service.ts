import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportarService {

  private urlEndPoint: string = 'http://localhost:8085/api/exportar';

  constructor(private http: HttpClient) { }

  exportarBaseDatos(): Observable<Blob>{
    return this.http.get(this.urlEndPoint, {responseType: 'blob'});
  }
}
