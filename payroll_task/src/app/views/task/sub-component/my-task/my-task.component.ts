import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { TaskDataSource } from '../../../../core/datasource/task.datasource';
import { TaskService } from '../../../../core/services/task.service';
import { merge, Subscription, tap } from 'rxjs';
import { LayoutUtilsService } from '../../../../core/shared/services/layout-utils.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrl: './my-task.component.scss',
})
export class MyTaskComponent implements OnInit, AfterViewInit {
  dataSource!: TaskDataSource;
  tasks = [
    'Title',
    'CustomerName',
    'AssignedBy',
    'AssignedDate',
    'DueDate',
    'Priority',
    'Status',
    'Action',
  ];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('searchInput') search!: ElementRef;
  subscriptions: Subscription[] = [];
  taskData: any;

  constructor(
    private taskService: TaskService,
    private layoutUtilsService: LayoutUtilsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.taskData = this.taskService.getDefaultTaskParams();
    this.paginator.pageSize = 10;

    this.dataSource = new TaskDataSource(this.taskService);
    this.loadMyTask();
  }

  ngAfterViewInit(): void {
    const paginatorSubscription = merge(this.paginator.page)
      .pipe(tap(() => this.loadMyTask()))
      .subscribe();
    this.subscriptions.push(paginatorSubscription);
  }

  searchLoad() {
    this.paginator.pageIndex = 0;
    this.taskData.title = this.search.nativeElement.value.trim();
    this.loadMyTask();
  }

  loadMyTask() {
    this.taskData.from = this.paginator.pageIndex * this.paginator.pageSize + 1;
    this.taskData.to = (this.paginator.pageIndex + 1) * this.paginator.pageSize;
    this.dataSource.loadMyTask(this.taskData);
  }

  deleteTask(taskId: number) {
    const title = 'DELETE TASK';
    const message = 'Do you want to delete this Task?';
    const waitMessage = 'Task is deleting...';
    const dialogRef = this.layoutUtilsService.deleteElement(title, message, waitMessage);
  
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.taskService.deleteTask(taskId).subscribe({
          next: () => {
            this.toastr.success('Task Deleted Successfully');
            this.loadMyTask();
          },
          error: () => {
            this.toastr.error('Something went wrong while deleting.');
          }
        });
      }
    });
  } 
  
  archiveTask(taskId: number) {
    const title = 'ARCHIVE TASK';
    const message = 'Do you want to archive this Task?';
    const waitMessage = 'Task is archiving...';
    const dialogRef = this.layoutUtilsService.confirmElement(title, message, waitMessage);
  
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.taskService.archiveTask(taskId, true).subscribe({
          next: () => {
            this.toastr.success('Task Archived Successfully');
            this.loadMyTask();
          },
          error: () => {
            this.toastr.error('Something went wrong while archiving.');
          }
        });
      }
    });
  }

  acceptTask(taskId: number) {
    this.taskService.updateTaskStatus(taskId, 0).subscribe({
      next:() => {
        this.toastr.success('Task Accepted Successfully');
        this.loadMyTask();
      },
      error:() => {
        this.toastr.error('Something went wrong while accepting.');
      }
    });
  }

  completeTask(Id: number) {
    const title = 'COMPLETE TASK';
    const message = 'Are you sure this Task is complete?';
    const waitMessage = 'Task is updating...';
    const dialogRef = this.layoutUtilsService.confirmElement(title, message, waitMessage);
  
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.taskService.updateTaskStatus(Id, 100).subscribe({
          next: () => {
            this.toastr.success('Task Completed Successfully');
            this.loadMyTask();
          },
          error: () => {
            this.toastr.error('Something went wrong while completing.');
          }
        });
      }
    });
  }

  partialCompleteTask(taskId: number, CompletionPercentage: number) {
    const dialogRef = this.layoutUtilsService.partialElement(taskId, CompletionPercentage);
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.toastr.success('Partial Complete Task Updated Successfully');
        this.loadMyTask();
      }
    });
  }

  viewTaskCoverage(taskId: number){
    this.layoutUtilsService.viewTask(taskId);
  }
}
