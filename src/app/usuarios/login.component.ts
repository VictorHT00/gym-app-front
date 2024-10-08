import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuarios/models/usuario';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  titulo: String = 'Login';

  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      Swal.fire({
        title: 'Login',
        text: `Hola ${this.authService.usuario.username} ya estás autenticado`,
        icon: 'info',
      });

      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire({
        title: 'Error Login',
        text: 'Username o password vacías!',
        icon: 'error',
      });
      return;
    }

    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);

      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      let usuario = this.authService.usuario;

      this.router.navigate(['/clientes']);
      Swal.fire({
        title: 'Login',
        text: `Hola ${usuario.nombre}, has iniciado sesión con éxito!`,
        icon: 'success',
      });
    }, err => {
      if(err.status == 400){
        Swal.fire({
          title: 'Error Login',
          text: `Usuario o clave incorrecta!`,
          icon: 'error',
        });
      }
    })
  }
}
