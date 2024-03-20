import { Component, OnInit } from '@angular/core';
import { EmployeeItemInterface } from '../interfaces/employees.item.interface';
import { EmployeeService } from '../employee.service';
import { filter, map, switchMap, tap } from 'rxjs';
import { ResponseGeneric } from '../../interfaces/response.generic.interface';
import { EmployeeCreateComponent } from '../employee-create/employee-create.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmployeeUpdateComponent } from '../employee-update/employee-update.component';
import { EmployeeDeleteComponent } from '../employee-delete/employee-delete.component';
import { EmployeeDeleteInterface } from '../interfaces/employee.delete.interfaces';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'phoneNumber', 'areaName', 'createdDate', 'lastModifiedDate', 'actions'];
  dataSource:EmployeeItemInterface[] = [];
  isLoading:boolean = true;

  constructor(private employeeService:EmployeeService, private dialog: MatDialog,) {}

  ngOnInit(): void {
    this.employeeService.getEmployeesAll()
    .pipe(
      map((response:ResponseGeneric<EmployeeItemInterface[]>) => response?.data)
    )
    .subscribe(employees => {
      this.isLoading = false;
      return this.dataSource = employees ?? [];
    });
  }

  employeeEdit(id:number) {
    this.dialog.open(EmployeeUpdateComponent, {
      data: id,
      width: '35%',
    });
  }

  openDialogCreate() {
    this.dialog.open( EmployeeCreateComponent, {
      width: '35%',
    });
  }

  openDialoDelete(id:number, name:string) {
    const params: EmployeeDeleteInterface = {
      id: id,
      name: name
    };

    this.dialog.open( EmployeeDeleteComponent, {
      width: '35%',
      data: params
    });
  }

}
