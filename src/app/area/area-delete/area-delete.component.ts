import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../utilities/snackbar.service';
import { AreaServiceService } from '../area-service.service';
import { AreaDeleteInterface } from '../interfaces/area.delete.interface';
import { map } from 'rxjs';
import { SnackbarStatus } from '../../utilities/snackbar.status';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-area-delete',
  templateUrl: './area-delete.component.html',
  styleUrl: './area-delete.component.css'
})
export class AreaDeleteComponent {

  apiLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AreaDeleteComponent>,
    private snackBar: SnackbarService,
    private areaServices: AreaServiceService,
    @Inject(MAT_DIALOG_DATA) public data: AreaDeleteInterface,
  ) {

  }

  onCancel() {
    this.dialogRef.close(false);
  }


  onConfirm(): void {
    this.apiLoading = true;


    this.areaServices.deleteArea(this.data.areaId)
      .pipe(
        map((response) => response.data)
      ).subscribe({
        next: val => {
          const name = this.data.areaName;
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
