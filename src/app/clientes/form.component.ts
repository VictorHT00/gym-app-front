import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from './region';
import { CostoPlan } from '../costos/costoPlan';
import { isBefore } from 'date-fns';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './detalle/modal.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit{
  public titulo: string = 'Crear Cliente';
  public cliente: Cliente = new Cliente();
  public errores: string[];

  public fotoSeleccionada: File;
  public progreso: number = 0;

  constructor(
    private clienteService: ClienteService, 
    public modalService: ModalService,
    private router: Router, 
    private activatedRoute: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.cliente.noCliente = null;
    let hoy = new Date();
    this.cliente.fechaInscripcion = this.formatoFecha(hoy);
    this.cargarCliente();
  }

  cargarCliente(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }
    });
  }

  seleccionarFoto(event): void{
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire({
        title: 'Error al seleccionar imagen:',
        text: 'El archivo debe ser del tipo imagen',
        icon: 'error',
      });
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(): void{
    if(!this.fotoSeleccionada){
      Swal.fire({
        title: 'Error de subida:',
        text: 'Debe seleccionar una foto',
        icon: 'error',
      });
    } else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        } else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;

          this.modalService.notificarUpload.emit(this.cliente);

          Swal.fire({
            title: 'La foto se ha subido completamente',
            text: response.mensaje,
            icon: 'success',
          });
        }
      })
    }
  }

  public create(): void {
    this.cliente.mesesSuscripcion = 0;
    this.cliente.estado = 3;
    this.cliente.pagoConsecutivo = true;
    this.clienteService.getCosto(this.setCostoPlan()).subscribe(
      costo =>{
        this.cliente.costoPlan = costo;
        this.clienteService.create(this.cliente).subscribe(
          json => {
            console.log(json.cliente);
            this.router.navigate(['/mensualidad/form', json.cliente.id]);
            Swal.fire({
              title: 'Nuevo cliente',
              text: `${json.mensaje}: ${json.cliente.nombre}`,
              icon: 'success',
            });
          },
          err => {
            this.errores = err.error.errors as string[];
            console.error(err.error.errors);
          }
        );
      }
    )    
  }

  update(): void{
    console.log(this.cliente);
    this.clienteService.update(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes']);
        Swal.fire({
          title: 'Cliente Actualizado',
          text: `${json.mensaje}: ${json.cliente.nombre}`,
          icon: 'success',
        });
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error(err.error.errors);
      }
    );
  }

  compararRegion(o1: Region, o2:Region): boolean{
    if(o1 === undefined && o2 === undefined){
      return true
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false: o1.id === o2.id;
  }

  formatoFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1;
    const day = fecha.getDate();

    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dayStr = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${monthStr}-${dayStr}`;
  }

  setCostoPlan(): number {
    let fechaRegistro = new Date(this.cliente.fechaInscripcion);
    let fecha2023 = new Date("2023-12-31");

    console.log(fechaRegistro);
    console.log(fecha2023);

    fechaRegistro = new Date(
      fechaRegistro.setMinutes(fechaRegistro.getMinutes() + fechaRegistro.getTimezoneOffset())
    );

    fecha2023 = new Date(
      fecha2023.setMinutes(fecha2023.getMinutes() + fecha2023.getTimezoneOffset())
    );

    console.log(fechaRegistro);
    console.log(fecha2023);

    if (isBefore(fechaRegistro, fecha2023) || fechaRegistro.getTime() === fecha2023.getTime()) {
      return 1;
    } else {
      return 2;
    }
  }
}
