import { Component } from "@angular/core";
import { AuthService } from "../usuarios/auth.service";
import { Router } from "@angular/router";
import { ExportarService } from "../exportar/exportar.service";
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {

    constructor(
        public authService: AuthService,
        private exportarService: ExportarService, 
        private router: Router
        ) { }

    exportarBaseDatos(): void{
        this.exportarService.exportarBaseDatos().subscribe(
            (data: Blob) => {
                saveAs(data, `base_datos_${this.fecha()}.sql`);
            },
            error => {
                console.error('Error al exportar la base de datos', error);
            }
        )
    }

    fecha(): string{
        let fecha = new Date();

        const year = fecha.getFullYear();
        const month = fecha.getMonth() + 1;
        const day = fecha.getDate();

        const monthStr = month < 10 ? `0${month}` : `${month}`;
        const dayStr = day < 10 ? `0${day}` : `${day}`;

        return `${year}-${monthStr}-${dayStr}`;
    }

    logout(): void {
        let username = this.authService.usuario.username
        this.authService.logout();
        this.router.navigate(['/check-in']);
    }
}