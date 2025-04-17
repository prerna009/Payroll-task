import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TaskDataSource } from '../../../../core/datasource/task.datasource';
import { MatPaginator } from '@angular/material/paginator';
import { merge, Subscription, tap } from 'rxjs';
import { TaskService } from '../../../../core/services/task.service';
import { LayoutUtilsService } from '../../../../core/shared/services/layout-utils.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assigned-by-me',
  templateUrl: './assigned-by-me.component.html',
  styleUrl: './assigned-by-me.component.scss',
})
export class AssignedByMeComponent implements OnInit, AfterViewInit {
  dataSource!: TaskDataSource;
  tasks = [
    'Title',
    'CustomerName',
    'AssignedBy',
    'AssignedDate',
    'DueDate',
    'Priority',
    'Status',
    'Action'
  ];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('searchInput') search!: ElementRef;
  subscriptions: Subscription[] = [];

  assignedByMeData: any;

  constructor(
    private taskService: TaskService,
    private layoutUtilsService: LayoutUtilsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.assignedByMeData = this.taskService.getDefaultTaskParams();
    this.paginator.pageSize = 10;
    this.dataSource = new TaskDataSource(this.taskService);
    this.loadAssignedByMe();
  }

  ngAfterViewInit(): void {
    const paginatorSubscription = merge(this.paginator.page)
      .pipe(tap(() => this.loadAssignedByMe()))
      .subscribe();

    this.subscriptions.push(paginatorSubscription);
  }

  searchLoad() {
    this.paginator.pageIndex = 0;
    this.assignedByMeData.title = this.search.nativeElement.value.trim();
    this.loadAssignedByMe();
  }

  loadAssignedByMe() {
    this.assignedByMeData.from =
      this.paginator.pageIndex * this.paginator.pageSize + 1;
    this.assignedByMeData.to =
      (this.paginator.pageIndex + 1) * this.paginator.pageSize;
    this.dataSource.loadAssignedByMe(this.assignedByMeData);
  }

  deleteTask(Id: number) {
    const title = 'DELETE TASK';
    const message = 'Do you want to delete this Task?';
    const waitMessage = 'Task is deleting...';
    const dialogRef = this.layoutUtilsService.deleteElement(
      title,
      message,
      waitMessage
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.taskService.deleteTask(Id).subscribe({
          next: () => {
            this.toastr.success('Task Deleted Successfully');
            this.loadAssignedByMe();
          },
          error: () => {
            this.toastr.error('Something went wrong while deleting.');
          },
        });
      }
    });
  }

  archiveTask(Id: number) {
    const title = 'ARCHIVE TASK';
    const message = 'Do you want to archive this Task?';
    const waitMessage = 'Task is archiving...';
    const dialogRef = this.layoutUtilsService.confirmElement(title, message, waitMessage);
  
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.taskService.archiveTask(Id, true).subscribe({
          next: () => {
            this.toastr.success('Task Archived Successfully');
            this.loadAssignedByMe();
          },
          error: () => {
            this.toastr.error('Something went wrong while deleting.');
          }
        });
      }
    });
  }

  viewTaskCoverage(taskId: number){
    this.layoutUtilsService.viewTask(taskId);
  }

  editTask(taskId: number) {
    const params = {
      Action: 'Edit',
      Button: 'Edit',
      UserId: taskId,
    };
    const dialogRef = this.layoutUtilsService.editTask(params);
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) return;
      this.toastr.success('Task Updated Successfully');
      this.loadAssignedByMe();
    });
  }
}
