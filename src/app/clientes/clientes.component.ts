import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';
import { isBefore, isSameDay } from 'date-fns';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  tipoBusqueda: string = "bnombre";
  variable: string;

  susActiva: number = 0;
  susVencida: number = 0;


  constructor(
    private clienteService: ClienteService,
    public modalService: ModalService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {


    this.clienteService.getClientesAll().subscribe(clientes => {
      console.log(clientes);
      clientes.forEach(cliente =>{
        if(this.getEstado(cliente) == 1 || this.getEstado(cliente) == 3){
          this.susActiva++;
        }else{
          this.susVencida++;
        }
      })
      console.log(this.susActiva+"---"+this.susVencida);
    });

    this.getClientesPaginador();

    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if (cliente.id == clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    })
  }

  getClientesPaginador() {
    this.activatedRoute.params.subscribe(params => {
      let page: number = params['page'];
      if (!page) {
        page = 0;
      }

      this.clienteService.getClientes(page).subscribe(response => {
        this.clientes = response.content as Cliente[];
        this.setEstado();
        this.clientes.sort((a, b) => a.noCliente - b.noCliente);
        this.paginador = response;
      });
    });
  }


  getClientesByFiltro() {
    if (this.variable == null || this.variable == "") {
      this.getClientesPaginador();
    } else {
      if(this.tipoBusqueda == "bid"){
        this.clienteService.getClientesById(this.variable).subscribe(response => {
          this.clientes = response;
          this.setEstado();
          this.paginador = null;
        })
      } else if (this.tipoBusqueda == "bnombre") {
        this.clienteService.getClientesByNombre(this.variable).subscribe(response => {
          this.clientes = response;
          this.setEstado();
          this.paginador = null;
        })
      } else if(this.tipoBusqueda == 'bapellido') {
        this.clienteService.getClientesByApellido(this.variable).subscribe(response => {
          this.clientes = response;
          this.setEstado();
          this.paginador = null;
        })
      } else if(this.tipoBusqueda == 'btelefono') {
        this.clienteService.getClientesByTelefono(this.variable).subscribe(response => {
          this.clientes = response;
          this.setEstado();
          this.paginador = null;
        })
      }
    }
  }

  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: '¿Estás seguro?',
        text: `¿Seguro que deseas eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.clienteService.delete(cliente.id).subscribe((response) => {
            this.clientes = this.clientes.filter((cli) => cli !== cliente);
            swalWithBootstrapButtons.fire({
              title: '!Eliminado!',
              text: `Cliente ${cliente.nombre} eliminado con éxito.`,
              icon: 'success',
            });
          });
        }
      });
  }

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

  setEstado(){
    this.clientes.forEach(cliente => {
      cliente.estado = this.getEstado(cliente);
      if ((cliente.estado == 2 || cliente.estado == 4) && cliente.mesesSuscripcion > 0) {
        cliente.mesesSuscripcion = 0;
      }
    })
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
      this.clienteService.update(cliente);

      return 2;
    }
  }

  actualizarTipoBusqueda(): void {

  }
}
