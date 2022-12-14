import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  showSuccessNotification(message: string) {
    const config = this.getNotificationBaseConfig();
    config.panelClass = 'success-notification';
    this.snackBar.open(message, 'X', config);
  }

  showErrorNotification(message: string) {
    const config = this.getNotificationBaseConfig();
    config.panelClass = 'error-notification';
    this.snackBar.open(message, 'X', config);
  }

  private getNotificationBaseConfig(): MatSnackBarConfig {
    const matSnackBarConfig = new MatSnackBarConfig();
    matSnackBarConfig.verticalPosition = 'top';
    matSnackBarConfig.horizontalPosition = 'right';
    matSnackBarConfig.duration = 6000;
    
    return matSnackBarConfig; 
  }
}