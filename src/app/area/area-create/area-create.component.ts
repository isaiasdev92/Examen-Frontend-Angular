import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../utilities/snackbar.service';
import { SnackbarStatus } from '../../utilities/snackbar.status';
import { AreaServiceService } from '../area-service.service';
import { AreaCreateRequest } from '../interfaces/area.create.request.interface';
import { map } from 'rxjs';
import { HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-area-create',
  templateUrl: './area-create.component.html',
  styleUrl: './area-create.component.css'
})
export class AreaCreateComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({});
  apiLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AreaCreateComponent>,
    private snackBar: SnackbarService,
    private areaServices: AreaServiceService
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)] }],
      description: ['', { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(80)] }],
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.apiLoading = true;

    const areaItem: AreaCreateRequest = {
      description: this.form.value['description'],
      name: this.form.value['name']
    };

    this.areaServices.createArea(areaItem)
      .pipe(
        map((response) => response.data)
      ).subscribe({
        next: val => {
          this.snackBar.show(`El área ${val?.name} se creo exitosamente con el ID ${val?.id}`, SnackbarStatus.success);
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
          this.dialogRef.close(true)
          location.reload();

        },
      });
  }

  getErrorName() {
    const nameField = this.form?.get('name');

    if (nameField?.hasError('required')) {
      return 'El campo nombre es requerido';
    }

    if (nameField?.hasError('minlength')) {
      return 'La longitud minima es de 2 caracteres';
    }

    if (nameField?.hasError('maxlength')) {
      return 'La longitud máxim es de 50 caracteres';
    }

    return '';
  }

  getErrorDescription() {
    const nameField = this.form?.get('description');

    if (nameField?.hasError('required')) {
      return 'El campo descripción es requerido';
    }

    if (nameField?.hasError('minlength')) {
      return 'La longitud minima es de 1 caracteres';
    }

    if (nameField?.hasError('maxlength')) {
      return 'La longitud máxim es de 80 caracteres';
    }

    return '';
  }

}
