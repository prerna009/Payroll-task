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

  private openConfirmationDialog(title: string, message: string, waitMessage: string, confirmedBtn: string = 'Yes') {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title, message, waitMessage, confirmedBtn },
    }).afterClosed();
  }

  deleteTask(taskId: number, onSuccess: () => void) {
    this.openConfirmationDialog('DELETE TASK', 'Do you want to delete this Task?', 'Task is deleting...', 'Delete').subscribe((res) => {
      if(res) {
        this.taskService.deleteTask(taskId).subscribe({
          next: () => {
            this.toastr.success('Task Deleted Successfully');
            onSuccess();
          },
          error: () => {
            this.toastr.error('Something went wrong while deleting.');
          }
        })
      }
    });
  }

  archiveTask(taskId: number, onSuccess: () => void) {
    this.openConfirmationDialog('ARCHIVE TASK', 'Do you want to archive this Task?', 'Task is archiving...').subscribe((res) => {
      if(res) {
        this.taskService.archiveTask(taskId, true).subscribe({
          next: () => {
            this.toastr.success('Task Archived Successfully');
            onSuccess();
          },
          error: () => {
            this.toastr.error('Something went wrong while archiving.');
          }
        })
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
    this.openConfirmationDialog('COMPLETE TASK', 'Are you sure this Task is complete?', 'Task is updating...').subscribe((res) => {
      if(res) {
        this.taskService.deleteTask(taskId).subscribe({
          next: () => {
            this.toastr.success('Task Completed Successfully');
            onSuccess();
          },
          error: () => {
            this.toastr.error('Something went wrong while completing.');
          }
        })
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
    this.openConfirmationDialog('UNARCHIVE TASK', 'Do you want to unarchive this Task?', 'Task is unarchiving...').subscribe((res) => {
      if(res) {
        this.taskService.archiveTask(Id, false).subscribe({
          next: () => {
            this.toastr.success('Task Unarchived Successfully');
            onSuccess();
          },
          error: () => {
            this.toastr.error('Something went wrong while unarchiving.');
          }
        })
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

      const isMultipleUsers = userData.length > 1;
      const isCurrentUserAssigned = userData.includes(currentUserId);

      const selectedIndex = (!isCurrentUserAssigned || isMultipleUsers) ? 0 : 1;
      const tabDisable = !isMultipleUsers && isCurrentUserAssigned ? true : false;

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
