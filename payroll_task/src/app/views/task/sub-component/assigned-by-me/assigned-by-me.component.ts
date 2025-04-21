import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
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
  standalone: false
})
export class AssignedByMeComponent implements OnInit, AfterViewInit, OnDestroy {
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

  deleteTask(taskId: number) {
    this.layoutUtilsService.deleteTask(taskId, () => this.loadAssignedByMe());
  }

  archiveTask(taskId: number) {
    this.layoutUtilsService.archiveTask(taskId, () => this.loadAssignedByMe());
  }

  viewTaskCoverage(taskId: number){
    this.layoutUtilsService.viewTask(taskId);
  }

  editTask(taskId: number) {
    this.layoutUtilsService.editTask(taskId, () => {
      this.loadAssignedByMe(); 
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
