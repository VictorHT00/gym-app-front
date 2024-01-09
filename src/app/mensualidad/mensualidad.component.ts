import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Mensualidad } from './models/mensualidad';
import { MensualidadService } from './mensualidad.service';
import Swal from 'sweetalert2';
import { addDays, addMonths, isBefore, isSameDay } from 'date-fns';
import { CostoPlan } from '../costos/costoPlan';
import { Cliente } from '../clientes/cliente';
import { Bitacora } from '../bitacora/bitacora';
import { BitacoraService } from '../bitacora/bitacora.service';

@Component({
  selector: 'app-mensualidad',
  templateUrl: './mensualidad.component.html'
})
export class MensualidadComponent implements OnInit {

  siguientePago: string;
  titulo: string = 'Pago';
  mensualidad: Mensualidad;
  seleccionModo: string = 'r-m';
  costoPlanes: CostoPlan[];

  mostrarDate: boolean = false;
  cobrarInscripcion: boolean = true;

  public errores: string[];

  constructor(private clienteService: ClienteService,
    private mensualidadService: MensualidadService,
    private bitacoraService: BitacoraService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let clienteId = params['id'];
      this.clienteService.getCliente(clienteId).subscribe(cliente => {
        this.mensualidad = new Mensualidad();
        this.mensualidad.cliente = cliente;
        this.mensualidad.cliente.estado = this.getEstado(this.mensualidad.cliente);
        const fechaLocal = new Date();
        this.mensualidad.fechaPago = this.formatoFecha(fechaLocal);
        this.mensualidad.dias = 0;
        this.mensualidad.meses = 1;
        this.mensualidad.cobro = cliente.costoPlan.costo;
        console.log(this.mensualidad.cliente)
        this.calcularFecha(1, true);
        
      });
    })

    this.clienteService.getCostos().subscribe(costos => {
      this.costoPlanes = costos;
    });
  }

  calcularFecha(aumento: number, isMensualidad: boolean) {
    const d = new Date(this.mensualidad.cliente.fechaInscripcion);

    let f2023 = new Date('2023-12-31');
    f2023 = new Date(
      f2023.setMinutes(f2023.getMinutes() + f2023.getTimezoneOffset())
    );
    /*const dia = new Date(
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset())
    );*/

    let fecha;
    if (this.mensualidad.cliente.siguientePago != null) {
      fecha = new Date(this.mensualidad.cliente.siguientePago);
      fecha = new Date(
        fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset())
      );
    } else {
      let fComp = new Date(this.mensualidad.cliente.fechaInscripcion);
      fComp = new Date(
        fComp.setMinutes(fComp.getMinutes() + fComp.getTimezoneOffset())
      );

      if(isBefore(fComp, f2023)){
        fecha = new Date('2024-01-01');
        fecha = new Date(
          fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset())
        );
        fecha.setDate(fComp.getDate());
      }else{
        fecha = new Date(this.mensualidad.cliente.fechaInscripcion);
        fecha = new Date(
          fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset())
        );
      }
    }
    //fecha.setDate(dia.getDate());

    let fechaRenovacion;
    if (isMensualidad) {
      fechaRenovacion = addMonths(fecha, aumento);
      this.siguientePago = this.formatoFecha(fechaRenovacion);
      this.mensualidad.cliente.vigenciaDia = null;
    } else {
      let fechaLocal = new Date();
      fechaRenovacion = addDays(fechaLocal, aumento);
      this.mensualidad.cliente.vigenciaDia = this.formatoFecha(fechaRenovacion);
      this.siguientePago = null;
    }
    //fechaRenovacion.setDate(dia.getDate());
    
    //this.mensualidad.cliente.siguientePago = fechaRenovacion.toISOString();
  }

  formatoFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1;
    const day = fecha.getDate();

    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dayStr = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${monthStr}-${dayStr}`;
  }

  actualizarModo() {
    if (this.seleccionModo == 'r-m') {
      this.mensualidad.meses = 1;
      this.mensualidad.dias = 0;
      this.mensualidad.cobro = this.mensualidad.cliente.costoPlan.costo;
      this.calcularFecha(1, true);
    } else if (this.seleccionModo == 'r-d') {
      this.mensualidad.dias = 1;
      this.mensualidad.meses = 0;
      this.mensualidad.cobro = this.costoPlanes[2].costo;
      this.calcularFecha(1, false);
    }
  }

  calcularTotal(): number{
    this.mensualidad.total = (this.mensualidad.dias + this.mensualidad.meses) * this.mensualidad.cobro;
    if(this.mensualidad.cliente.costoPlan.id == 2 && this.mensualidad.total == 6000){
      this.mensualidad.total = 5000;
    }
    if(((this.mensualidad.cliente.costoPlan.id == 2 && this.mensualidad.cliente.siguientePago == null) || this.mensualidad.cliente.estado == 2) && this.cobrarInscripcion){
      this.mensualidad.total += this.costoPlanes[3].costo;
    }
    return this.mensualidad.total;
  }

  validarCantidad() {
    if (isNaN(this.mensualidad.meses) || this.mensualidad.meses < 1) {
      this.mensualidad.meses = 0;
    }
    if (isNaN(this.mensualidad.dias) || this.mensualidad.dias < 1) {
      this.mensualidad.dias = 0;
    }

  }

  getEstado(cliente: Cliente): number {
    const fechaActual = new Date();
    if (cliente.vigenciaDia != null) {
      let fechaVigencia = new Date(cliente.vigenciaDia);
      fechaVigencia = new Date(
        fechaVigencia.setMinutes(fechaVigencia.getMinutes() + fechaVigencia.getTimezoneOffset())
      );
      if (isBefore(fechaActual, fechaVigencia) || isSameDay(fechaActual, fechaVigencia)) {
        return 4;
      }
    }

    if (cliente.siguientePago == null) {
      return 5;
    }
    let fechaRenovacion = new Date(cliente.siguientePago);

    fechaRenovacion = new Date(
      fechaRenovacion.setMinutes(fechaRenovacion.getMinutes() + fechaRenovacion.getTimezoneOffset())
    );


    if (isBefore(fechaActual, fechaRenovacion) || fechaActual.getTime() === fechaRenovacion.getTime()) {
      return 1;
    } else if (isSameDay(fechaActual, fechaRenovacion)) {
      return 3;
    } else {
      cliente.pagoConsecutivo = false;
      if (cliente.costoPlan.id == 1) {
        cliente.costoPlan.id = 2;
      }
      this.clienteService.update(cliente).subscribe(json => console.log(json.cliente));

      return 2;
    }
  }

  create(mensualidadForm): void {
    console.log(this.mensualidad);

    if (mensualidadForm.form.valid) {
      if (this.calcularTotal() < 1) {
        Swal.fire({
          title: 'Error',
          text: 'El total no puede ser 0',
          icon: 'error',
        });
      } else {

        this.mensualidad.cliente.estado = 1;
        this.mensualidad.cliente.mesesSuscripcion = this.mensualidad.meses;

        let operacion;
        if(this.mensualidad.cliente.siguientePago){
          operacion = 2;
        }else{
          operacion = 1;
        }
       

        if(this.siguientePago != null){
          this.mensualidad.cliente.siguientePago = this.siguientePago;
        }

        
        this.clienteService.update(this.mensualidad.cliente).subscribe(
          json => {
            console.log('Hecho');
          },
          err => {
            this.errores = err.error.errors as string[];
            console.error(err.error.errors);
          }
        );

        this.mensualidadService.create(this.mensualidad).subscribe(mensualidad => {
          Swal.fire({
            title: this.titulo,
            text: `El pago del cliente ${mensualidad.cliente.nombre} ${mensualidad.cliente.apellido} fue realizado con éxito!`,
            icon: 'success',
          });
          let bitacora: Bitacora = new Bitacora();
        let fechaHoy: Date = new Date();
        bitacora.fecha = this.formatoFecha(fechaHoy);
        bitacora.operacion = operacion;
        this.mensualidadService.getMensualidad(mensualidad.id).subscribe(mensualidad =>{
          bitacora.mensualidad = mensualidad;
          this.bitacoraService.create(bitacora).subscribe(s=>{console.log('exito')});
        });
          this.router.navigate(['/clientes']);
          //this.router.navigate(['/facturas', factura.id]);
        });
      }
    }
  }


}
