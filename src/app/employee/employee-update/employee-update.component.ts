import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeItemInterface } from '../interfaces/employees.item.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../utilities/snackbar.service';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { AreaListResponse } from '../../area/interfaces/area.list.response';
import { map } from 'rxjs';
import { AreaServiceService } from '../../area/area-service.service';
import { ResponseGeneric } from '../../interfaces/response.generic.interface';
import { EmployeeUpdateRequest } from '../interfaces/employee.update.request';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarStatus } from '../../utilities/snackbar.status';

@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrl: './employee-update.component.css'
})
export class EmployeeUpdateComponent implements OnInit {

  isLoading: boolean = true;
  form: FormGroup = this.formBuilder.group({});
  apiLoading: boolean = false;
  areaList: AreaListResponse[] = [];

  details: EmployeeItemInterface = {
    id: 0,
    name: '',
    areaId: 0,
    createdDate: new Date('1979-01-01'),
    lastModifiedDate: new Date('1979-01-01'),
    areaName: '',
    email: '',
    phoneNumber: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeUpdateComponent>,
    private snackBar: SnackbarService,
    private areaServices: AreaServiceService,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public employeeId: number,
    private router: Router
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
        map((response: ResponseGeneric<AreaListResponse[]>) => response.data)
      )
      .subscribe(areasList => {
        this.areaList = areasList ?? [];
      });

      this.employeeService.getEmployeeById(this.employeeId)
        .pipe(
          map((response:ResponseGeneric<EmployeeItemInterface>) => response.data)
        )
        .subscribe(employeeDetails => {
          this.isLoading = false;
          this.details = employeeDetails!;
          this.form.patchValue({
            id: employeeDetails?.id,
            name: employeeDetails?.name,
            areaId: employeeDetails?.areaId,
            email: employeeDetails?.email,
            phoneNumber: employeeDetails?.phoneNumber,
            createdDate: employeeDetails?.createdDate,
            lastModifiedDate: employeeDetails?.lastModifiedDate
          })
        });
  }

  onConfirm() {
    this.apiLoading = true;

    const updateRequest: EmployeeUpdateRequest = {
      id:  this.employeeId,
      name: this.form.value['name'],
      email: this.form.value['email'],
      phoneNumber: this.form.value['phoneNumber'],
      areaId: this.form.value['areaId'],
    };

    this.employeeService.updateEmployee(updateRequest)
      .pipe(
        map((response) => response.data)
      ).subscribe({
        next: val => {
          this.snackBar.show(`El empleado ${val?.name} se actualizó correctamente`, SnackbarStatus.success);
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
