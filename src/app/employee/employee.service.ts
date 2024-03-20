import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseGeneric } from '../interfaces/response.generic.interface';
import { EmployeeItemInterface } from './interfaces/employees.item.interface';
import { EmployeeCreateRequest } from './interfaces/employee.create.request';
import { EmployeeCreateResponse } from './interfaces/employee.create.response';
import { EmployeeUpdateRequest } from './interfaces/employee.update.request';
import { EmployeeUpdateResponse } from './interfaces/employee.update.response';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createEmployee(request:EmployeeCreateRequest):Observable<ResponseGeneric<EmployeeCreateResponse>> {
    return this.http.post<ResponseGeneric<EmployeeCreateResponse>>(`${this.baseUrl}/Employee/CreateEmployee`, request);
  }

  updateEmployee (request:EmployeeUpdateRequest):Observable<ResponseGeneric<EmployeeUpdateResponse>> {
    return this.http.put<ResponseGeneric<EmployeeUpdateResponse>>(`${this.baseUrl}/Employee/UpdateEmployee`, request);
  }

  deleteEmployee(id:number):Observable<ResponseGeneric<boolean>> {
    return this.http.delete<ResponseGeneric<boolean>>(`${this.baseUrl}/Employee/DeleteEmployee?id=${id}`);
  }

  getEmployeesAll():Observable<ResponseGeneric<EmployeeItemInterface[]>> {
    return this.http.get<ResponseGeneric<EmployeeItemInterface[]>>(`${this.baseUrl}/Employee/GetAll`);
  }

  getEmployeeById(id:number) {
    return this.http.get<ResponseGeneric<EmployeeItemInterface>>(`${this.baseUrl}/Employee/GetById?id=${id}`);
  }
}
