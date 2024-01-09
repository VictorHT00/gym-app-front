import { Component, OnInit } from '@angular/core';
import { Usuario } from './models/usuario';
import { UsuarioService } from '../usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit{

  usuarios: Usuario[];

  constructor(
    private usuarioService: UsuarioService
  ){}

  ngOnInit(): void {
    let arr:string =JSON.parse('[{"id": 1, "name": "ROLE_USER"}]');
    console.log(arr);
    this.usuarioService.getUsuarios().subscribe(response => {
      this.usuarios = response;
      console.log(this.usuarios);
    })
  }

  delete(usuario: Usuario): void{
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
        text: `¿Seguro que deseas eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.delete(usuario.id).subscribe((response) => {
            this.usuarios = this.usuarios.filter((us) => us !== usuario);
            swalWithBootstrapButtons.fire({
              title: '!Eliminado!',
              text: `Usuario ${usuario.nombre} ${usuario.apellido} eliminado con éxito.`,
              icon: 'success',
            });
          });
        }
      });
  }
}
