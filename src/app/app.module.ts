import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AreaListComponent } from './area/area-list/area-list.component';
import { AreaCreateComponent } from './area/area-create/area-create.component';
import { AreaUpdateComponent } from './area/area-update/area-update.component';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeCreateComponent } from './employee/employee-create/employee-create.component';
import { EmployeeUpdateComponent } from './employee/employee-update/employee-update.component';
import { MaterialAppModule } from "./material-app/material-app.module";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MenuAppComponent } from './shared/menu-app/menu-app.component';
import { SideBarComponent } from './shared/side-bar/side-bar.component';

import { HttpClientModule } from '@angular/common/http';
import { LoaderAppComponent } from './shared/loader-app/loader-app.component';
import { AreaDeleteComponent } from './area/area-delete/area-delete.component';
import { EmployeeDeleteComponent } from './employee/employee-delete/employee-delete.component';
// import { SnackbarAppComponent } from './shared/snackbar-app/snackbar-app.component';

@NgModule({
  declarations: [
    AppComponent,
    AreaListComponent,
    AreaCreateComponent,
    AreaUpdateComponent,
    EmployeeListComponent,
    EmployeeCreateComponent,
    EmployeeUpdateComponent,
    MenuAppComponent,
    SideBarComponent,
    LoaderAppComponent,
    AreaDeleteComponent,
    EmployeeDeleteComponent,
    // SnackbarAppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialAppModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
