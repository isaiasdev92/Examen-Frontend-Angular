import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../utilities/snackbar.service';
import { EmployeeService } from '../employee.service';
import { map } from 'rxjs';
import { ResponseGeneric } from '../../interfaces/response.generic.interface';
import { EmployeeItemInterface } from '../interfaces/employees.item.interface';
import { AreaServiceService } from '../../area/area-service.service';
import { AreaListResponse } from '../../area/interfaces/area.list.response';
import { EmployeeCreateRequest } from '../interfaces/employee.create.request';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarStatus } from '../../utilities/snackbar.status';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.css'
})
export class EmployeeCreateComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({});
  apiLoading:boolean = false;
  apiLoadingArea:boolean = true;
  areaList:AreaListResponse[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeCreateComponent>,
    private snackBar: SnackbarService,
    private areaServices: AreaServiceService,
    private employeeService:EmployeeService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        name: ['', {validators: [Validators.required, Validators.maxLength(20)]}],
        email: ['', {validators: [Validators.required, Validators.email]}],
        phoneNumber: ['', {validators: [Validators.required, Validators.minLength(10), Validators.maxLength(20)]}],
        areaId: [0, {validators: [Validators.required]}]
      });

      this.areaServices.getAllAreas()
        .pipe(
          map((response:ResponseGeneric<AreaListResponse[]>) => response.data)
        )
        .subscribe(areasList => {
          this.areaList = areasList ?? [];
        });
  }


  onConfirm(): void {
    this.apiLoading = true;

    const createRequest: EmployeeCreateRequest = {
      name: this.form.value['name'],
      email: this.form.value['email'],
      phoneNumber: this.form.value['phoneNumber'],
      areaId: this.form.value['areaId'],
    };

    this.employeeService.createEmployee(createRequest)
      .pipe(
        map((response) => response.data)
      ).subscribe({
        next: val => {
          this.snackBar.show(`El empleado ${val?.name} se creo exitosamente con el ID ${val?.id}`, SnackbarStatus.success);
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



  onCancel(): void {
    this.dialogRef.close(false);
  }

  getErrorName() {
    const nameField = this.form?.get('name');

    if (nameField?.hasError('required')) {
      return 'El campo nombre es requerido';
    }

    if (nameField?.hasError('maxlength')) {
      return 'La longitud máxima es de 50 caracteres';
    }

    return '';
  }

  getErrorEmail() {
    const nameField = this.form?.get('email');

    if (nameField?.hasError('required')) {
      return 'El campo correo electrónico es requerido';
    }

    if (nameField?.hasError('email')) {
      return 'El correo electrónico no es valido';
    }

    return '';
  }

  getErrorPhoneNumber() {
    const nameField = this.form?.get('phoneNumber');

    if (nameField?.hasError('required')) {
      return 'El campo nombre es requerido';
    }

    if (nameField?.hasError('minlength')) {
      return 'La longitud máxima es de 10 caracteres';
    }

    if (nameField?.hasError('maxlength')) {
      return 'La longitud máxima es de 20 caracteres';
    }


    return '';
  }


  getErrorArea() {
    const nameField = this.form?.get('areaId');

    if (nameField?.hasError('required')) {
      return 'El campo área es requerido';
    }


    return '';
  }



}
