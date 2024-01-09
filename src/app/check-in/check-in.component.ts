import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from '../clientes/cliente';
import { ClienteService } from '../clientes/cliente.service';
import { ModalService } from '../clientes/detalle/modal.service';
import { isBefore, isSameDay } from 'date-fns';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit{
  public clienteS: Cliente;
  public identificador: number;
  telefono: string;

  private sound: HTMLAudioElement;

  constructor(private clienteService: ClienteService,private modalService: ModalService) {
    this.clienteS = new Cliente();
  }

  abrirModal() {
    this.modalService.abrirModal();
  }

  ngOnInit(): void {
  }

  comprobarUsuario(){
    if(this.identificador > 10000){
      this.telefono = this.identificador.toString();
      this.clienteService.getClienteByTelefono(this.telefono).subscribe((cliente) => {
        cliente.estado = this.getEstado(cliente);
        this.clienteS = cliente;
        console.log(cliente);
        this.abrirModal();
        this.sound = new Audio('assets/sounds/correcto.mp3');
        console.log(this.sound);
        this.sound.play();
      },
      err=>{
        Swal.fire({
          title: 'Cliente no encontrado',
          text: 'ID o no. de télefono equivocado',
          icon: 'error',
        });
      });
    }else{
      this.clienteService.getClienteByNoCliente(this.identificador).subscribe((cliente) => {
        cliente.estado = this.getEstado(cliente);
        this.clienteS = cliente;
        console.log(cliente);
        this.abrirModal();
      },
      err=>{
        Swal.fire({
          title: 'Cliente no encontrado',
          text: 'ID o no. de télefono equivocado',
          icon: 'error',
        });
      });
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
        this.sound = new Audio('assets/sounds/correcto.mp3');
        this.sound.play();
        return 4;
      }
    }

    if (cliente.siguientePago == null) {
      this.sound = new Audio('assets/sounds/error.mp3');
      this.sound.play();
      return 5;
    }
    let fechaRenovacion = new Date(cliente.siguientePago);

    fechaRenovacion = new Date(
      fechaRenovacion.setMinutes(fechaRenovacion.getMinutes() + fechaRenovacion.getTimezoneOffset())
    );


    if (isBefore(fechaActual, fechaRenovacion) || fechaActual.getTime() === fechaRenovacion.getTime()) {
      this.sound = new Audio('assets/sounds/correcto.mp3');
      this.sound.play();
      return 1;
    } else if (isSameDay(fechaActual, fechaRenovacion)) {
      this.sound = new Audio('assets/sounds/warning.mp3');
      this.sound.play();
      return 3;
    } else {
      cliente.pagoConsecutivo = false;
      if (cliente.costoPlan.id == 1) {
        cliente.costoPlan.id = 2;
      }
      this.sound = new Audio('assets/sounds/error.mp3');
      this.sound.play();
      return 2;
    }
  }
}
