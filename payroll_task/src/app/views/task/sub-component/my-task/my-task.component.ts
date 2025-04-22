import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { TaskDataSource } from '../../../../core/datasource/task.datasource';
import { TaskService } from '../../../../core/services/task.service';
import { merge, Subscription, tap } from 'rxjs';
import { LayoutUtilsService } from '../../../../core/shared/services/layout-utils.service';
@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrl: './my-task.component.scss',
  standalone: false
})
export class MyTaskComponent implements OnInit, AfterViewInit, OnDestroy {
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
  subscriptions: Subscription[] = [];
  taskData: any;

  constructor(
    private taskService: TaskService,
    private layoutUtilsService: LayoutUtilsService,
  ) {}

  ngOnInit(): void {
    this.taskData = this.taskService.getDefaultTaskParams();
    this.paginator.pageSize = 10;

    this.dataSource = new TaskDataSource(this.taskService);
    this.loadMyTask();
    this.taskService.loadSubject.subscribe(res=> {
      if(res) {
        this.loadMyTask();
      }
    });
  }

  ngAfterViewInit(): void {
    const paginatorSubscription = merge(this.paginator.page)
      .pipe(tap(() => this.loadMyTask()))
      .subscribe();
    this.subscriptions.push(paginatorSubscription);
  }

  loadMyTask() {
    this.taskData.from = this.paginator.pageIndex * this.paginator.pageSize + 1;
    this.taskData.to = (this.paginator.pageIndex + 1) * this.paginator.pageSize;
    this.dataSource.loadMyTask(this.taskData);
  }

  deleteTask(taskId: number) {
    this.layoutUtilsService.deleteTask(taskId, () => this.loadMyTask());
  }

  archiveTask(taskId: number) {
    this.layoutUtilsService.archiveTask(taskId, () => this.loadMyTask());
  }

  acceptTask(taskId: number) {
    this.layoutUtilsService.acceptTask(taskId, () => this.loadMyTask());
  }

  completeTask(taskId: number) {
    this.layoutUtilsService.completeTask(taskId, () => this.loadMyTask());
  }

  partialCompleteTask(taskId: number, CompletionPercentage: number) {
    this.layoutUtilsService.partialCompleteTask(
      taskId,
      CompletionPercentage,
      () => this.loadMyTask()
    );
  }

  viewTaskCoverage(taskId: number) {
    this.layoutUtilsService.viewTask(taskId);
  }

  editTask(taskId: number) {
    this.layoutUtilsService.editTask(taskId, () => {
      this.loadMyTask();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
