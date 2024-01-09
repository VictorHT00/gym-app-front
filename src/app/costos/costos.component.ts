import { Component, OnInit } from '@angular/core';
import { CostoPlan } from './costoPlan';
import { ClienteService } from '../clientes/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-costos',
  templateUrl: './costos.component.html',
  styleUrls: ['./costos.component.css']
})
export class CostosComponent implements OnInit{

  costoPlanes: CostoPlan[];

  constructor(
    private clienteService: ClienteService){}

  ngOnInit(): void {
    this.clienteService.getCostos().subscribe(costos => {
      this.costoPlanes = costos;
      console.log(this.costoPlanes);
    });
  }

  update(costoPlan: CostoPlan): void {
    this.clienteService.updateCostos(costoPlan).subscribe(
      costo => {
        Swal.fire({
          title: 'Precio Actualizado',
          text: `El precio ha sido actualizado con éxito`,
          icon: 'success',
        });
      }
    );
  }
}
