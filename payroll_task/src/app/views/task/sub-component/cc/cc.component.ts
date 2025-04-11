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
  selector: 'app-cc',
  templateUrl: './cc.component.html',
  styleUrl: './cc.component.scss',
})
export class CcComponent implements OnInit, AfterViewInit {
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
  ccData: any;

  constructor(
    private taskService: TaskService,
    private layoutUtilsService: LayoutUtilsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.ccData = this.taskService.getDefaultTaskParams();
    this.paginator.pageSize = 10;
    this.dataSource = new TaskDataSource(this.taskService);
    this.loadMyCC();
  }

  ngAfterViewInit(): void {
    const paginatorSubscription = merge(this.paginator.page)
      .pipe(tap(() => this.loadMyCC()))
      .subscribe();
    this.subscriptions.push(paginatorSubscription);
  }

  loadMyCC() {
    this.ccData.from = this.paginator.pageIndex * this.paginator.pageSize + 1;
    this.ccData.to = (this.paginator.pageIndex + 1) * this.paginator.pageSize;
    this.dataSource.loadCC(this.ccData);
  }

  searchLoad() {
    this.paginator.pageIndex = 0;
    this.ccData.title = this.search.nativeElement.value.trim();
    this.loadMyCC();
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
            this.loadMyCC();
          },
          error: () => {
            this.toastr.error('Something went wrong while deleting.');
          }
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
            this.loadMyCC();
          },
          error: () => {
            this.toastr.error('Something went wrong while deleting.');
          }
        });
      }
    });
  }
}
