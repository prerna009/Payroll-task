import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TaskDataSource } from '../../../../core/datasource/task.datasource';
import { MatPaginator } from '@angular/material/paginator';
import { merge, Subscription, tap } from 'rxjs';
import { TaskService } from '../../../../core/services/task.service';
import { LayoutUtilsService } from '../../../../core/shared/services/layout-utils.service';

@Component({
  selector: 'app-cc',
  templateUrl: './cc.component.html',
  styleUrl: './cc.component.scss',
  standalone: false
})
export class CcComponent implements OnInit, AfterViewInit, OnDestroy {
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
  subscriptions: Subscription[] = [];
  ccData: any;

  constructor(
    private taskService: TaskService,
    private layoutUtilsService: LayoutUtilsService,
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

  deleteTask(taskId: number) {
    this.layoutUtilsService.deleteTask(taskId, () => this.loadMyCC());
  }

  archiveTask(taskId: number) {
    this.layoutUtilsService.archiveTask(taskId, () => this.loadMyCC());
  }

  viewTaskCoverage(taskId: number){
    this.layoutUtilsService.viewTask(taskId);
  }

  editTask(taskId: number) {
    this.layoutUtilsService.editTask(taskId, () => {
      this.loadMyCC(); 
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
