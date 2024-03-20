import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../utilities/snackbar.service';
import { AreaServiceService } from '../area-service.service';
import { map } from 'rxjs';
import { ResponseGeneric } from '../../interfaces/response.generic.interface';
import { AreaDetailsResponse } from '../interfaces/area.details.response.interface';
import { AreaUpdateRequest } from '../interfaces/area.update.request.interface';
import { SnackbarStatus } from '../../utilities/snackbar.status';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-area-update',
  templateUrl: './area-update.component.html',
  styleUrl: './area-update.component.css'
})
export class AreaUpdateComponent implements OnInit {

  isLoading:boolean = true;
  form: FormGroup = this.formBuilder.group({});
  apiLoading: boolean = false;

  details:AreaDetailsResponse  = {
    createdDate: new Date('1979-01-01'),
    lastModifiedDate: new Date('1979-01-01'),
    description: '',
    id: 0,
    name: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AreaUpdateComponent>,
    private snackBar: SnackbarService,
    private areaServices: AreaServiceService,
    @Inject(MAT_DIALOG_DATA) public areaId: number,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [0, {validators: [Validators.required]}],
      name: ['', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)] }],
      description: ['', { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(80)] }],
      createdDate: ['', ],
      lastModifiedDate: ['', ]
    });

    this.areaServices.getById(this.areaId)
      .pipe(
        map((response:ResponseGeneric<AreaDetailsResponse>) => response?.data)
      )
      .subscribe(area => {
        this.isLoading = false;
        this.form.patchValue({
          id: area?.id,
          name: area?.name,
          description: area?.description,
          createdDate: area?.createdDate,
          lastModifiedDate: area?.lastModifiedDate
        })
        return this.details = area!;
      });

  }

  onConfirm(): void {
    this.apiLoading = true;

    const areaRequestUpdate: AreaUpdateRequest = {
      id: this.details.id,
      description: this.form.value['description'],
      name: this.form.value['name']
    };

    this.areaServices.updateArea(areaRequestUpdate)
      .pipe(
        map((response) => response.data)
      ).subscribe({
        next: val => {
          this.snackBar.show(`El área ${val?.name} se creo actualizó correctamente`, SnackbarStatus.success);
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

  onCancel(): void {
    this.dialogRef.close(false);
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
