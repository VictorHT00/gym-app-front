import { Cliente } from "../clientes/cliente";
import { Mensualidad } from "../mensualidad/models/mensualidad";

export class Bitacora {
    id: number;
    fecha: string;
    cliente: Cliente;
    mensualidad: Mensualidad;
    estado: number;
    operacion: number;
}