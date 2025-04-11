import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../views/task/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class LayoutUtilsService {
  constructor(private dialog: MatDialog) {}

  deleteElement(title: string, description: string, waitMessage: string, confirmedBtn: string = 'Delete') {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title, description, waitMessage, confirmedBtn },
    });
  }

  confirmElement(title: string, description: string, waitMessage: string, confirmedBtn: string = 'Yes'){
    return this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title, description, waitMessage, confirmedBtn },
    });
  }
}
