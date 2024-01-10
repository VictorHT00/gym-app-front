import { isBefore } from "date-fns";
import { Factura } from "../facturas/models/factura";
import { Region } from "./region";
import { CostoPlan } from "../costos/costoPlan";

export class Cliente {
    id: number;
    noCliente: number;
    nombre: string;
    apellido: string;
    telefono: string;
    telefonoEmergencia: string;
    fechaInscripcion: string;
    mesesSuscripcion: number;
    siguientePago: string;
    vigenciaDia: string;
    estado: number;
    pagoConsecutivo: boolean;
    foto: string;
    
    costoPlan: CostoPlan;
}
