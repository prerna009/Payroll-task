import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../views/task/confirm-dialog/confirm-dialog.component';
import { PartialCompleteStatusComponent } from '../../../views/task/partial-complete-status/partial-complete-status.component';
import { ViewTaskCoverageComponent } from '../../../views/task/view-task-coverage/view-task-coverage.component';
import { AddTaskDialogComponent } from '../../../views/task/add-task-dialog/add-task-dialog.component';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class LayoutUtilsService {
  constructor(private dialog: MatDialog, private taskService: TaskService, private authService: AuthService, private toastr: ToastrService) {}

  deleteTask(taskId: number, onSuccess: () => void) {
    const title = 'DELETE TASK';
    const message = 'Do you want to delete this Task?';
    const waitMessage = 'Task is deleting...';
    const confirmedBtn = 'Delete';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title, message, waitMessage, confirmedBtn },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.taskService.deleteTask(taskId).subscribe({
          next: () => {
            this.toastr.success('Task Deleted Successfully');
            onSuccess();
          },
          error: () => {
            this.toastr.error('Something went wrong while deleting.');
          }
        });
      }
    });
  }

  archiveTask(taskId: number, onSuccess: () => void) {
    const title = 'ARCHIVE TASK';
    const message = 'Do you want to archive this Task?';
    const waitMessage = 'Task is archiving...';
    const confirmedBtn = 'Yes';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title, message, waitMessage, confirmedBtn },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.taskService.archiveTask(taskId, true).subscribe({
          next: () => {
            this.toastr.success('Task Archived Successfully');
            onSuccess();
          },
          error: () => {
            this.toastr.error('Something went wrong while archiving.');
          }
        });
      }
    });
  }

  acceptTask(taskId: number, onSuccess: () => void) {
    this.taskService.updateTaskStatus(taskId, 0).subscribe({
      next: () => {
        this.toastr.success('Task Accepted Successfully');
        onSuccess();
      },
      error: () => {
        this.toastr.error('Something went wrong while accepting.');
      }
    });
  }

  completeTask(taskId: number, onSuccess: () => void) {
    const title = 'COMPLETE TASK';
    const message = 'Are you sure this Task is complete?';
    const waitMessage = 'Task is updating...';
    const confirmedBtn = 'Yes';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title, message, waitMessage, confirmedBtn },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.taskService.updateTaskStatus(taskId, 100).subscribe({
          next: () => {
            this.toastr.success('Task Completed Successfully');
            onSuccess();
          },
          error: () => {
            this.toastr.error('Something went wrong while completing.');
          }
        });
      }
    });
  }

  partialCompleteTask(taskId: number, CompletionPercentage: number, onSuccess: () => void) {
    const dialogRef = this.dialog.open(PartialCompleteStatusComponent, {
      width: '400px',
      data: { taskId, CompletionPercentage }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.toastr.success('Partial Task Updated Successfully');
        onSuccess();
      }
    });
  }

  unarchiveTask(Id: number, onSuccess: () => void) {
    const title = 'UNARCHIVE TASK';
    const message = 'Do you want to unarchive this Task?';
    const waitMessage = 'Task is unarchiving...';
    const confirmedBtn = 'Yes';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title, message, waitMessage, confirmedBtn },
    });
  
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.taskService.archiveTask(Id, false).subscribe({
          next: () => {
            this.toastr.success('Task Unarchived Successfully');
            onSuccess();
          },
          error: () => {
            this.toastr.error('Something went wrong while deleting.');
          }
        });
      }
    });
  }

  viewTask(taskId: number) {
    return this.dialog.open(ViewTaskCoverageComponent, {
      width: '400px',
      data: { taskId }
    });
  }

  editTask(taskId: number, onClose: () => void) {
    this.taskService.getTaskDetails(taskId).subscribe((res: any) => {
      const taskDetails = res.data;
      const currentUserId = this.authService.getUserId();
      const userData = taskDetails.AssignedToUserIds;

      let selectedIndex = 0;
      let tabDisable = false;

      if (
        (userData.includes(currentUserId) && userData.length > 1) ||
        (!userData.includes(currentUserId) && userData.length >= 1)
      ) {
        selectedIndex = 0;
        tabDisable = false;
      } else {
        selectedIndex = 1;
        tabDisable = true;
      }

      const dialogRef = this.dialog.open(AddTaskDialogComponent, {
        width: '500px',
        data: {
          Action: 'Edit',
          Button: 'Edit',
          UserId: taskId,
          selectedIndex,
          tabDisable,
          taskDetails
        }
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (!res) return;
        this.toastr.success('Task Updated Successfully');
        onClose();
      });
    });
  }
}
