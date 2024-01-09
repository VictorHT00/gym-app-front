export class Rol {
    id: number;
    name: string;

    static crearDesdeNombre(nombre: string): Rol {
        const rol = new Rol();
        rol.name = nombre;
        return rol;
      }
}