import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
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
}
