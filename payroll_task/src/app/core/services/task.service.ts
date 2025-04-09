import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  load = new BehaviorSubject<boolean>(false)
  $load = this.load.asObservable();

  constructor(private http: HttpClient) { }

  getMyTask(data: any){
    const params = {
      From: data.from || 1,
      To: data.to || 10,
      Title: data.title || '',
      UserId: data.userId || 0,
      IsArchive: data.isArchive || false,
      UserIds: data.userIds || '',
      Priority: data.priority || '',
      TaskStatus: data.StatusIds || '',
      FromDueDate: data.FromDate || '',
      ToDueDate: data.ToDate || '',
      SortByDueDate: '',
      SortColumn: data.SortColumn || '',
      SortOrder: data.SortOrder || ''
    }
    return this.http.post('api/Task/UserTasksAssignedToMe', params).pipe(
      map(res => res)
    );

  }
}
