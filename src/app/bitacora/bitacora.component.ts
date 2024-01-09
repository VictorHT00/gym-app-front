import { Component, OnInit } from '@angular/core';
import { Bitacora } from './bitacora';
import { BitacoraService } from './bitacora.service';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})
export class BitacoraComponent implements OnInit{
  bitacoras: Bitacora[];
  fecha: string;
  seleccionOperacion: string = 'check-in';
  totalDinero: number;
  totalUsuarios: number;

  constructor(private bitacoraService: BitacoraService){}

  ngOnInit(): void {

    let hoy = new Date();
    this.fecha = this.formatoFecha(hoy);

    this.actualizarOperacion();
    

    /*this.bitacoraService.getBitacoras().subscribe(bitacoras => {
      this.bitacoras = bitacoras;
      console.log(this.bitacoras);
    })*/
  }

  formatoFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1;
    const day = fecha.getDate();

    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dayStr = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${monthStr}-${dayStr}`;
  }



  actualizarOperacion(){
    this.totalDinero = 0;
    this.totalUsuarios = 0;
    if(this.seleccionOperacion == 'check-in'){
      this.bitacoraService.getBitacorasByFechaAndOperacion(3, this.fecha).subscribe(bitacoras=>{
        this.bitacoras = bitacoras;
        bitacoras.forEach(bitacora =>{
          this.totalUsuarios ++;
        })
      });
    }else if(this.seleccionOperacion == 'inscripcion'){
      this.bitacoraService.getBitacorasByFechaAndOperacion(1, this.fecha).subscribe(bitacoras=>{
        this.bitacoras = bitacoras;
        console.log(bitacoras);
        bitacoras.forEach(bitacora =>{
          this.totalDinero += bitacora.mensualidad.total;
          this.totalUsuarios ++;
        })
      });
    }else if(this.seleccionOperacion == 'pago'){
      this.bitacoraService.getBitacorasByFechaAndOperacion(2, this.fecha).subscribe(bitacoras=>{
        this.bitacoras = bitacoras;
        console.log(bitacoras);
        bitacoras.forEach(bitacora =>{
          this.totalDinero += bitacora.mensualidad.total;
          this.totalUsuarios ++;
        })
      });
    }

  }
}
