import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { TaskDataSource } from '../../../../core/datasource/task.datasource';
import { TaskService } from '../../../../core/services/task.service';
import { merge, Subscription, tap } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrl: './my-task.component.scss'
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
  @ViewChild('searchInput', { static: false }) search!: ElementRef;
  subscriptions: Subscription[] = [];

  taskData = {
    from: 1,
    to: 10,
    title: '',
    userId: 0,
    isArchive: false,
    userIds: '',
    priority: '',
    statusIds: '',
    fromDate: '',
    toDate: '',
    sortColumn: '',
    sortOrder: '',
  };

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.taskData.userId = userId;
      this.dataSource = new TaskDataSource(this.taskService);
      this.loadMyTask();
    }
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
}
