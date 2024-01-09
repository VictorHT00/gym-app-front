import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { Factura } from 'src/app/facturas/models/factura';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit{

  @Input() cliente: Cliente;

  titulo: string = "Detalle del cliente";
  public fotoSeleccionada: File;
  public progreso: number = 0;

  constructor(
    private clienteService: ClienteService, 
    private facturaService: FacturaService,
    public modalService: ModalService,
    public authService: AuthService){}

  ngOnInit(): void {
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

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Factura): void{
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
        text: `¿Seguro que deseas eliminar la factura ${factura.descripcion}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.facturaService.delete(factura.id).subscribe((response) => {
            swalWithBootstrapButtons.fire({
              title: '¡Factura eliminada!',
              text: `Factura ${factura.descripcion} eliminada con éxito.`,
              icon: 'success',
            });
          });
        }
      });
  }
}
