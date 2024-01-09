import { Component, Input } from '@angular/core';
import { Bitacora } from 'src/app/bitacora/bitacora';
import { BitacoraService } from 'src/app/bitacora/bitacora.service';
import { Cliente } from 'src/app/clientes/cliente';
import { ClienteService } from 'src/app/clientes/cliente.service';
import { ModalService } from 'src/app/clientes/detalle/modal.service';

@Component({
  selector: 'check-in-detalle',
  templateUrl: './check-in-detalle.component.html',
  styleUrls: ['./check-in-detalle.component.css']
})
export class CheckInDetalleComponent {
  @Input() cliente: Cliente;

  titulo: string = "Detalle del cliente";
  public fotoSeleccionada: File;

  constructor(
    private bitacoraService: BitacoraService,
    public modalService: ModalService
  ){}

  cerrarModal(confirmado: boolean){
    if(confirmado){
      let bitacora: Bitacora = new Bitacora();
      let fechaHoy: Date = new Date();
      bitacora.fecha = this.formatoFecha(fechaHoy);
      bitacora.cliente = this.cliente;
      bitacora.estado = this.cliente.estado;
      bitacora.operacion = 3;
      
      this.bitacoraService.create(bitacora).subscribe(s=>{console.log('exito')});
    }

    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
  }

  formatoFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1;
    const day = fecha.getDate();

    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dayStr = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${monthStr}-${dayStr}`;
  }
}