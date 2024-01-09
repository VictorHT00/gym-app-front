import { Cliente } from "src/app/clientes/cliente";

export class Mensualidad {
    id: number;
    cliente: Cliente;
    fechaPago: string;
    dias: number;
    meses: number;
    cobro: number;
    total: number;
}