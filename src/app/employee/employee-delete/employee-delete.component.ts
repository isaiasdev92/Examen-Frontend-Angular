import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../utilities/snackbar.service';
import { EmployeeService } from '../employee.service';
import { EmployeeDeleteInterface } from '../interfaces/employee.delete.interfaces';
import { map } from 'rxjs';
import { SnackbarStatus } from '../../utilities/snackbar.status';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-employee-delete',
  templateUrl: './employee-delete.component.html',
  styleUrl: './employee-delete.component.css'
})
export class EmployeeDeleteComponent {

  apiLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EmployeeDeleteComponent>,
    private snackBar: SnackbarService,
    private employeeServices: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDeleteInterface,
  ) { }

  onCancel() {
    this.dialogRef.close(false);
  }


  onConfirm(): void {
    this.apiLoading = true;


    this.employeeServices.deleteEmployee(this.data.id)
      .pipe(
        map((response) => response.data)
      ).subscribe({
        next: val => {
          const name = this.data.name;
          this.snackBar.show(`El área ${name} se creo eliminó correctamente`, SnackbarStatus.success);
        },
        error: (responseError: HttpErrorResponse) => {
          if (responseError.status == 400) {
            this.snackBar.show(responseError.error.Errors[0], SnackbarStatus.error);
          } else if (responseError.status == 500) {
            this.snackBar.show(responseError.error.Errors[0], SnackbarStatus.error);
          } else {
            this.snackBar.show(responseError.message, SnackbarStatus.error);

          }
          this.apiLoading = false;
        },
        complete: () => {
          this.apiLoading = false;
          this.dialogRef.close(true);
          location.reload();
        },
      });

   }
}
