import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarStatus } from './snackbar.status';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) { }

  show( message: string, status:SnackbarStatus ):void {

    let classStatus:string = '';
    switch (status) {
      case SnackbarStatus.success:
        classStatus = 'success-app';
        break;
      case SnackbarStatus.error:
        classStatus = 'error-app';
        break;
      default:
        classStatus = '';
        break;
    }

    this.snackbar.open( message, 'ok', {
      duration: 5000,
      panelClass: classStatus.length > 0 ? [classStatus] : []
    });

    //'error-app'
  }
}
