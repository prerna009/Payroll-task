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

  private paginatorTotalSubject = new BehaviorSubject<number>(0);
  paginatorTotal$ = this.paginatorTotalSubject.asObservable();

  private entitySubject = new BehaviorSubject<any[]>([]);
  tasks$ = this.entitySubject.asObservable();

  private hasItemsSubject = new BehaviorSubject<boolean>(false);
  hasItems$ = this.hasItemsSubject.asObservable();

  private subscriptions: Subscription[] = [];

  constructor(private taskService: TaskService) {
    const hasItemsSubscription = this.paginatorTotal$
      .pipe(
        tap((total) => this.hasItemsSubject.next(total > 0)),
        distinctUntilChanged(),
        skip(1)
      )
      .subscribe();
    this.subscriptions.push(hasItemsSubscription);
  }

  loadMyTask(params: any): void {
    this.loadingSubject.next(true);
    this.taskService
      .getMyTask(params)
      .pipe(
        map((res: any) => {
          this.paginatorTotalSubject.next(res.data?.TotalCount || 0);
          this.entitySubject.next(res.data?.TaskList || []);
        }),
        catchError((error) => {
          console.error('Error loading tasks:', error);
          this.paginatorTotalSubject.next(0);
          this.entitySubject.next([]);
          return of(null);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      )
      .subscribe();
  }

  loadCC(params: any): void {
    this.loadingSubject.next(true);
    this.taskService
      .getCC(params)
      .pipe(
        map((res: any) => {
          this.paginatorTotalSubject.next(res.data?.TotalCount || 0);
          this.entitySubject.next(res.data?.TaskList || []);
        }),
        catchError((error) => {
          console.error('Error loading tasks:', error);
          this.paginatorTotalSubject.next(0);
          this.entitySubject.next([]);
          return of(null);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      )
      .subscribe();
  }

  loadAssignedByMe(params: any): void {
    this.loadingSubject.next(true);
    this.taskService
      .getAssignedByMeTask(params)
      .pipe(
        map((res: any) => {
          this.paginatorTotalSubject.next(res.data?.TotalCount || 0);
          this.entitySubject.next(res.data?.TaskList || []);
        }),
        catchError((error) => {
          console.error('Error loading tasks:', error);
          this.paginatorTotalSubject.next(0);
          this.entitySubject.next([]);
          return of(null);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      )
      .subscribe();
  }

  loadArchiveList(params: any): void {
    this.loadingSubject.next(true);
    this.taskService
      .getArchiveListTask(params)
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
        })
      )
      .subscribe();
  }

  connect(): Observable<any[]> {
    return this.tasks$;
  }

  disconnect(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.entitySubject.complete();
    this.loadingSubject.complete();
    this.paginatorTotalSubject.complete();
    this.hasItemsSubject.complete();
  }
}
