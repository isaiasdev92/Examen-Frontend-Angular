import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { AreaListComponent } from './area/area-list/area-list.component';

const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'area/list', component: AreaListComponent },
  { path: '**', redirectTo: '' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
