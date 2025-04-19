import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  loadSubject = new BehaviorSubject<boolean>(false);
  load$ = this.loadSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  private createParams(data: any, extraParams: any = {}) {
    return {
      From: data.from,
      To: data.to,
      Title: data.title,
      UserId: data.userId || this.authService.getUserId() || 0,
      IsArchive: data.isArchive || false,
      UserIds: data.userIds || [],
      Priority: data.priority || '',
      TaskStatus: data.StatusIds || '',
      FromDueDate: data.FromDate || '',
      ToDueDate: data.ToDate || '',
      SortByDueDate: data.SortByDueDate || '',
      SortColumn: data.SortColumn || '',
      SortOrder: data.SortOrder || '',
      ...extraParams,
    };
  }

  getDefaultTaskParams() {
    return this.createParams({ from: 1, to: 10, title: '' });
  }

  getMyTask(data: any): Observable<any> {
    const params = this.createParams(data);
    return this.http.post('api/Task/UserTasksAssignedToMe', params);
  }

  getCC(data: any): Observable<any> {
    const params = this.createParams(data);
    return this.http.post('api/Task/OwnerTasks', params);
  }

  getAssignedByMeTask(data: any): Observable<any> {
    const params = this.createParams(data);
    return this.http.post('api/Task/UserTasksAssignedByMe', params);
  }

  getArchiveListTask(data: any): Observable<any> {
    const params = this.createParams(data, { IsArchive: true });
    return this.http.post('api/Task/UserTasksAssignedByMe', params);
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.get(`api/Task/DeleteTask?taskId=${taskId}`);
  }

  archiveTask(taskId: number, isArchive: boolean): Observable<any> {
    const params = { IsArchive: isArchive, TaskId: taskId };
    return this.http.post('api/Task/Archive', params);
  }

  updateTaskStatus(taskId: number, statusIds: number): Observable<any> {
    const params = { TaskId: taskId, TaskStatusValue: statusIds };
    return this.http.post('api/Task/UpdateTaskStatus', params);
  }

  getPartialTaskStatus(): Observable<any> {
    return this.http.get<any>('api/Task/UserTaskStatusMaster');
  }

  getViewTask(taskId: number): Observable<any> {
    return this.http.get<any>(`api/Task/StatusReport?taskId=${taskId}`);
  }

  getTaskDetails(userId: any): Observable<any> {
    return this.http.get<any>(`api/Task/UserTaskDetails?taskId=${userId}`);
  }

  getCustomerList(params: any): Observable<any> {
    return this.http.post('api/CRM/Leads', params);
  }

  updateOwnerTask(taskId: number, taskOwners: any): Observable<any> {
    const params = { Id: taskId, TaskOwners: taskOwners };
    return this.http.post('api/Task/AddOwnersToTask', params);
  }

  addUsersExistingTask(taskId: number, userIds: any): Observable<any> {
    const params = { Id: taskId, IntercomGroupIds: [], UserIds: userIds };
    return this.http.post('api/Task/AddUsersToExistingTask', params);
  }

  addTask(taskDetails: any): Observable<any> {
    return this.http.post('api/Task/AssignTask', taskDetails);
  }

  updateTask(taskDetails: any): Observable<any> {
    return this.http.post('api/Task/UpdateTaskDetails', taskDetails);
  }

  getCompanyMembers(from: any, to: any, text: any): Observable<any> {
    return this.http.get(`api/CompanyMembers?from=${from}&text=${text}&to=${to}`);
  }

  removeOwnerTask(Id: string, TaskOwners: any[]): Observable<any> {
    return this.http.post(`/api/Task/RemoveOwnersFromExistingTask`, { Id, TaskOwners });
  }

  removeUsersExistingTask(Id: string, UserIds: any[]): Observable<any> {
    return this.http.post(`/api/Task/RemoveUsersFromExistingTask`, { Id, UserIds });
  }

  getFileInfo(filePath: string): { name: string, extension: string } {
    const name = /[^/]*$/.exec(filePath)?.[0] || '';
    const extension = /[^.]*$/.exec(filePath)?.[0] || '';
    return { name, extension };
  }
}
