import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../views/task/confirm-dialog/confirm-dialog.component';
import { PartialCompleteStatusComponent } from '../../../views/task/partial-complete-status/partial-complete-status.component';
import { ViewTaskCoverageComponent } from '../../../views/task/view-task-coverage/view-task-coverage.component';
import { AddTaskDialogComponent } from '../../../views/task/add-task-dialog/add-task-dialog.component';

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

  partialElement(taskId: number, CompletionPercentage: number){
    return this.dialog.open(PartialCompleteStatusComponent, {
      width: '400px',
      data: { taskId, CompletionPercentage }
    });
  }

  viewTask(taskId: number) {
    return this.dialog.open(ViewTaskCoverageComponent, {
      width: '400px',
      data: { taskId }
    });
  }

  editTask(params: any) {
    return this.dialog.open(AddTaskDialogComponent, {
      width: '500px',
      data: params
    });
  }
}
