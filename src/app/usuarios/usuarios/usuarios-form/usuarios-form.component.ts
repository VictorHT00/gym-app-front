import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../../usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.css']
})
export class UsuariosFormComponent implements OnInit{

  public usuario: Usuario = new Usuario();
  public cambiarPass: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute){}

    ngOnInit(): void {
      this.cargarUsuario();
    }

    cargarUsuario(): void{
      this.activatedRoute.params.subscribe(params => {
        let id = params['id']
        if(id){
          this.usuarioService.getUsuario(id).subscribe(usuario => this.usuario = usuario)
        }
      });
    }

  public create():void{
    this.usuario.enabled = true;
    this.usuario.roles = [{id: 1, name: "ROLE_USER"}];
    console.log(this.usuario);
    this.usuarioService.create(this.usuario).subscribe(
      usuario => {
        this.router.navigate(['/usuarios']);
        Swal.fire({
          title: 'Nuevo usuario',
          text: `El usuario ${usuario.nombre} ${usuario.apellido} ha sido creado con éxito!`,
          icon: 'success',
        });
      }
    )
  }

  public update(): void{
    this.usuarioService.update(this.usuario).subscribe(
      usuario => {
        this.router.navigate(['/usuarios']);
        Swal.fire({
          title: 'Usuario Actualizado',
          text: `El usuario ${usuario.nombre} ${usuario.apellido} ha sido actualizado`,
          icon: 'success',
        });
      }
    )
  }

  public updatePassword(): void{
    this.usuarioService.updatePassword(this.usuario).subscribe(
      usuario => {
        Swal.fire({
          title: 'Contraseña Actualizada',
          text: `La contraseña del usuario ${usuario.nombre} ${usuario.apellido} ha sido actualizada`,
          icon: 'success',
        });
      }
    )
  }
}
