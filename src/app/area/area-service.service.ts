import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseGeneric } from '../interfaces/response.generic.interface';
import { AreaListResponse } from './interfaces/area.list.response';
import { AreaCreateRequest } from './interfaces/area.create.request.interface';
import { AreaCreateResponse } from './interfaces/area.create.response.interface';
import { AreaDetailsResponse } from './interfaces/area.details.response.interface';
import { AreaUpdateRequest } from './interfaces/area.update.request.interface';
import { AreaUpdateResponse } from './interfaces/area.update.response.interface';

@Injectable({
  providedIn: 'root'
})
export class AreaServiceService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllAreas(): Observable<ResponseGeneric<AreaListResponse[]>> {
    return this.http.get<ResponseGeneric<AreaListResponse[]>>(`${this.baseUrl}/Area/GetAll`);
  }

  createArea(area:AreaCreateRequest): Observable<ResponseGeneric<AreaCreateResponse>> {
    return this.http.post<ResponseGeneric<AreaCreateResponse>>(`${this.baseUrl}/Area/CreateArea`, area);
  }

  getById(id:number) : Observable<ResponseGeneric<AreaDetailsResponse>> {
    return this.http.get<ResponseGeneric<AreaDetailsResponse>>(`${this.baseUrl}/Area/GetById?id=${id}`);
  }

  updateArea(areupdateRequest:AreaUpdateRequest): Observable<ResponseGeneric<AreaUpdateResponse>> {
    return this.http.put<ResponseGeneric<AreaUpdateResponse>>(`${this.baseUrl}/Area/UpdateArea`, areupdateRequest);
  }

  deleteArea(id:number): Observable<ResponseGeneric<boolean>> {
    return this.http.delete<ResponseGeneric<boolean>>(`${this.baseUrl}/Area/DeleteArea?id=${id}`);
  }
}
