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
import { TaskService } from '../../../../core/services/task.service';
import { merge, Subscription, tap } from 'rxjs';
import { LayoutUtilsService } from '../../../../core/shared/services/layout-utils.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-archive-list',
  templateUrl: './archive-list.component.html',
  styleUrl: './archive-list.component.scss',
  standalone: false
})
export class ArchiveListComponent implements OnInit, AfterViewInit, OnDestroy {
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
  archiveListData: any;

  constructor(
    private taskService: TaskService,
    private layoutUtilsService: LayoutUtilsService,
  ) {}

  ngOnInit(): void {
    this.archiveListData = this.taskService.getDefaultTaskParams();
    this.paginator.pageSize = 10;
    this.dataSource = new TaskDataSource(this.taskService);
    this.loadArchiveList();
  }

  ngAfterViewInit(): void {
    const paginatorSubscription = merge(this.paginator.page)
      .pipe(tap(() => this.loadArchiveList()))
      .subscribe();

    this.subscriptions.push(paginatorSubscription);
  }

  loadArchiveList() {
    this.archiveListData.from =
      this.paginator.pageIndex * this.paginator.pageSize + 1;
    this.archiveListData.to =
      (this.paginator.pageIndex + 1) * this.paginator.pageSize;
    this.dataSource.loadArchiveList(this.archiveListData);
  }

  searchLoad() {
    this.paginator.pageIndex = 0;
    this.archiveListData.title = this.search.nativeElement.value.trim();
    this.loadArchiveList();
  }

  unarchiveTask(taskId: number) {
    this.layoutUtilsService.unarchiveTask(taskId, () => {
      this.loadArchiveList(); 
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
