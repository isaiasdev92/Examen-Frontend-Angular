import { Component, OnInit } from '@angular/core';
import { AreaServiceService } from '../area-service.service';
import { map } from 'rxjs';
import { ResponseGeneric } from '../../interfaces/response.generic.interface';
import { AreaListResponse } from '../interfaces/area.list.response';
import { AreaCreateComponent } from '../area-create/area-create.component';
import { MatDialog } from '@angular/material/dialog';
import { AreaUpdateComponent } from '../area-update/area-update.component';
import { AreaDeleteComponent } from '../area-delete/area-delete.component';
import { AreaDeleteInterface } from '../interfaces/area.delete.interface';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrl: './area-list.component.css'
})
export class AreaListComponent implements OnInit {
  isLoading:boolean = true;
  displayColumns: string[] = ['id', 'name', 'createdDate', 'lastModifiedDate', 'actions'];
  dataSources:AreaListResponse[] = [];

  constructor(private areaService:AreaServiceService, private dialog: MatDialog,) {}

  ngOnInit(): void {
    this.areaService.getAllAreas()
      .pipe(
        map((response:ResponseGeneric<AreaListResponse[]>) => response?.data)
      )
      .subscribe(areas => {
        this.isLoading = false;
        this.dataSources = areas ?? [];
        return this.dataSources;
      });
  }

  openDialogCreate() {
    this.dialog.open( AreaCreateComponent, {
      height: '400px',
      width: '600px',
    });
  }

  openDialogEdit(id:number) {
    this.dialog.open( AreaUpdateComponent, {
      data: id,
      width: '30%',
    });
  }

  openDialogDelete(id:number, name:string) {
    const params: AreaDeleteInterface = {
      areaId: id,
      areaName: name
    };

    this.dialog.open( AreaDeleteComponent, {
      data: params,
      width: '30%',
    });
  }

}
