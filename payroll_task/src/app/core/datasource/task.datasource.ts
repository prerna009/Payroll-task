import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  Observable,
  of,
  skip,
  Subscription,
  tap,
} from 'rxjs';
import { TaskService } from '../services/task.service';

export class TaskDataSource {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private taskSubject = new BehaviorSubject<boolean>(true);
  taskSubject$ = this.taskSubject.asObservable();

  private paginatorTotalSubject = new BehaviorSubject<number>(0);
  paginatorTotal$ = this.paginatorTotalSubject.asObservable();

  private entitySubject = new BehaviorSubject<any[]>([]);
  tasks$ = this.entitySubject.asObservable();

  private hasItemsSubject = new BehaviorSubject<boolean>(false);
  hasItems$ = this.hasItemsSubject.asObservable();

  totalRecordNumber: number = 0;

  private subscriptions: Subscription[] = [];

  constructor(private taskService: TaskService) {
    const hasItemsSubscription = this.paginatorTotal$
      .pipe(
        tap((res) => this.totalRecordNumber = res),
        distinctUntilChanged(),
        skip(1)
      )
      .subscribe((res) => {
        this.hasItemsSubject.next(res > 0);
      });

    this.subscriptions.push(hasItemsSubscription);
    this.paginatorTotalSubject.next(this.totalRecordNumber);
  }

  loadMyTask(data: any): void {
    const params = {
        from: data.from,
        to: data.to,
        title: data.title,
        userId: data.userId,
        isArchive: data.isArchive,
        userIds: data.userIds,
        priority: data.priority,
        statusIds: data.statusIds,
        fromDate: data.fromDate,
        toDate: data.toDate,
        sortColumn: data.sortColumn,
        sortOrder: data.sortOrder
    };
    this.loadingSubject.next(true);

    this.taskService
      .getMyTask(params)
      .pipe(
        map((res: any) => {
          this.paginatorTotalSubject.next(res.data.TotalCount || 0);
          this.entitySubject.next(res.data.TaskList || []);
        }),
        catchError((error) => {
          console.error('Error loading tasks:', error);
          this.paginatorTotalSubject.next(0);
          this.entitySubject.next([]);
          return of(null);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
          this.taskSubject.next(false);
        })
      )
      .subscribe();
  }

  loadCC() {}

  loadAssignedByMe() {}

  loadArchiveList() {}

  connect(): Observable<any[]> {
    return this.tasks$;
  }

  disconnect(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.entitySubject.complete();
    this.loadingSubject.complete();
    this.paginatorTotalSubject.complete();
    this.taskSubject.complete();
    this.hasItemsSubject.complete();
  }
}
