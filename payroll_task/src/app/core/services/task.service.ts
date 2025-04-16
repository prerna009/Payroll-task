import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  load = new BehaviorSubject<boolean>(false);
  load$ = this.load.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getDefaultTaskParams() {
    return {
      from: 1,
      to: 10,
      title: '',
      userId: this.authService.getUserId() || 0,
      isArchive: false,
      userIds: [],
      priority: '',
      statusIds: '',
      fromDate: '',
      toDate: '',
      sortColumn: '',
      sortOrder: '',
    };
  }

  getMyTask(data: any) {
    const params = {
      From: data.from,
      To: data.to,
      Title: data.title,
      UserId: data.userId,
      IsArchive: data.isArchive,
      UserIds: data.userIds,
      Priority: data.priority,
      TaskStatus: data.StatusIds,
      FromDueDate: data.FromDate,
      ToDueDate: data.ToDate,
      SortByDueDate: '',
      SortColumn: data.SortColumn,
      SortOrder: data.SortOrder,
    };
    return this.http
      .post('api/Task/UserTasksAssignedToMe', params)
      .pipe(map((res) => res));
  }

  getCC(data: any) {
    const params = {
      From: data.from,
      To: data.to,
      Title: data.title,
      UserId: data.userId,
      IsArchive: data.isArchive,
      UserIds: data.userIds,
      TaskStatus: data.StatusIds,
      Priority: data.priority,
    };

    return this.http
      .post('api/Task/OwnerTasks', params)
      .pipe(map((res) => res));
  }

  getAssignedByMeTask(data: any) {
    const params = {
      From: data.from,
      To: data.to,
      Title: data.title,
      UserId: data.userId,
      IsArchive: data.isArchive,
      UserIds: data.userIds,
      Priority: data.priority,
      TaskStatus: data.StatusIds,
      FromDueDate: data.FromDate,
      ToDueDate: data.ToDate,
      SortByDueDate: '',
    };

    return this.http
      .post('api/Task/UserTasksAssignedByMe', params)
      .pipe(map((res) => res));
  }

  getArchiveListTask(data: any) {
    const params = {
      From: data.from,
      To: data.to,
      Title: data.title,
      UserId: data.userId,
      IsArchive: true,
      UserIds: data.userIds,
    };

    return this.http
      .post('api/Task/UserTasksAssignedByMe', params)
      .pipe(map((res) => res));
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http
      .get('api/Task/DeleteTask?taskId=' + taskId)
      .pipe(map((res) => res));
  }

  archiveTask(taskId: number, isArchive: boolean): Observable<any> {
    const params = {
      IsArchive: isArchive,
      TaskId: taskId,
    };
    return this.http.post('api/Task/Archive', params).pipe(map((res) => res));
  }

  updateTaskStatus(taskId: number, statusIds: number): Observable<any> {
    const params = {
      TaskId: taskId,
      TaskStatusValue: statusIds,
    };
    return this.http
      .post('api/Task/UpdateTaskStatus', params)
      .pipe(map((res) => res));
  }

  getPartialTaskStatus(): Observable<any> {
    return this.http
      .get<any>('api/Task/UserTaskStatusMaster')
      .pipe(map((res) => res));
  }

  getViewTask(taskId: number): Observable<any> {
    return this.http
      .get<any>('api/Task/StatusReport?taskId=' + taskId)
      .pipe(map((res) => res));
  }

  getTaskDetails(userId: any): Observable<any> {
    return this.http
      .get<any>('api/Task/UserTaskDetails?taskId=' + userId)
      .pipe(map((res) => res));
  }

  getCustomerList(params: any): Observable<any> {
    return this.http.post('api/CRM/Leads', params).pipe(map((res) => res));
  }

  updateOwnerTask(taskId: number, taskOwners: any): Observable<any> {
    const params = {
      Id: taskId,
      TaskOwners: taskOwners,
    };
    return this.http
      .post('api/Task/AddOwnersToTask', params)
      .pipe(map((res) => res));
  }

  addUsersExistingTask(taskId: number, taskOwners: any): Observable<any> {
    const params = {
      Id: taskId,
      IntercomGroupIds: [],
      UserIds: taskOwners,
    };
    return this.http
      .post('api/Task/AddUsersToExistingTask', params)
      .pipe(map((res) => res));
  }

  addTask(taskDetails: any): Observable<any> {
    return this.http
      .post('api/Task/AssignTask', taskDetails)
      .pipe(map((res) => res));
  }

  updateTask(taskDetails: any): Observable<any> {
    return this.http
      .post('api/Task/UpdateTaskDetails', taskDetails)
      .pipe(map((res) => res));
  }

  getCompanyMembers(from:any, to:any, text:any): Observable<any> {
    return this.http.get('api/CompanyMembers?from=' + from + '&text=' + text + '&to=' + to)
      .pipe(
        map(res => res)
      );
  }

  removeOwnerTask(taskId: string, removeList: any[]) {
    return this.http.post(`/api/task/removeOwner`, { taskId, removeList });
  }

  removeUsersExistingTask(taskId: string, removeList: any[]) {
    return this.http.post(`/api/task/removeUsers`, { taskId, removeList });
  }

  getName(name: any): any {
    let filename = /[^/]*$/.exec(name);
    let updated_name = filename && filename.length ? filename[0] : '';
    return updated_name;
  }
  getExtension(extention: any): any {
    let fileextention = /[^.]*$/.exec(extention);
    let updated_fileExtention =
      fileextention && fileextention.length ? fileextention[0] : '';
    return updated_fileExtention;
  }
}
