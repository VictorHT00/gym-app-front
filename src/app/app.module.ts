import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { PaginatorComponent } from './paginator/paginator.component';

import { ClienteService } from './clientes/cliente.service';

import localeMX from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { authGuard } from './usuarios/guards/auth.guard';
import { roleGuard } from './usuarios/guards/role.guard';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MensualidadComponent } from './mensualidad/mensualidad.component';
import { CheckInComponent } from './check-in/check-in.component';
import { CheckInDetalleComponent } from './check-in/check-in-detalle/check-in-detalle.component';
import { UsuariosComponent } from './usuarios/usuarios/usuarios.component';
import { UsuariosFormComponent } from './usuarios/usuarios/usuarios-form/usuarios-form.component';
import { CostosComponent } from './costos/costos.component';
import { BitacoraComponent } from './bitacora/bitacora.component';


registerLocaleData(localeMX, 'es-MX')

const routes: Routes = [
  { path: '', redirectTo: '/check-in', pathMatch: 'full' },
  { path: 'check-in', component: CheckInComponent},
  { path: 'directivas', component: DirectivaComponent },
  { path: 'clientes', component: ClientesComponent , canActivate: [authGuard, roleGuard], data: { role: 'ROLE_USER' } },
  { path: 'clientes/page/:page', component: ClientesComponent },
  { path: 'clientes/form', component: FormComponent, canActivate: [authGuard, roleGuard], data: { role: 'ROLE_USER' } },
  { path: 'clientes/form/:id', component: FormComponent, canActivate: [authGuard, roleGuard], data: { role: 'ROLE_USER' } },
  { path: 'login', component: LoginComponent },
  { path: 'facturas/:id', component: DetalleFacturaComponent, canActivate: [authGuard, roleGuard], data: { role: 'ROLE_USER' } },
  { path: 'facturas/form/:clienteId', component: FacturasComponent, canActivate: [authGuard, roleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'mensualidad/form/:id', component: MensualidadComponent, canActivate: [authGuard, roleGuard], data: { role: 'ROLE_USER' } },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard, roleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'usuarios/form', component: UsuariosFormComponent, canActivate: [authGuard, roleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'usuarios/form/:id', component: UsuariosFormComponent, canActivate: [authGuard, roleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'costos', component: CostosComponent, canActivate: [authGuard, roleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'bitacora', component: BitacoraComponent, canActivate: [authGuard, roleGuard], data: { role: 'ROLE_ADMIN' } }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent,
    MensualidadComponent,
    CheckInComponent,
    CheckInDetalleComponent,
    UsuariosComponent,
    UsuariosFormComponent,
    CostosComponent,
    BitacoraComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe
  ],
  providers: [
    ClienteService,
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
