import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { FacturaService } from './services/factura.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})
export class DetalleFacturaComponent implements OnInit{

  factura: Factura;
  titulo: string = 'Factura';

  constructor(private facturaService: FacturaService, private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params =>{
      let id: number = params['id'];
      this.facturaService.getFactura(id).subscribe(factura => this.factura = factura);
    });
  }

}
