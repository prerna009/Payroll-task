import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usernameSubject = new BehaviorSubject<string | null>(sessionStorage.getItem('username'));
  username$ = this.usernameSubject.asObservable();

  private userIdSubject = new BehaviorSubject<string | null>(null);
  userId$ = this.userIdSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(data: any){
    return this.http.post('api/account/authenticate', data);
  }

  isAuthenticated(): boolean{
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!sessionStorage.getItem('referraltoken');
    } 
    return false;
  }

  setUsername(name: string) {
    this.usernameSubject.next(name);
    sessionStorage.setItem('username', name);
  }

  getUsername(): string | null {
    return sessionStorage.getItem('username');
  }

  setUserId(userId: string){
    this.userIdSubject.next(userId);
  }

  getUserId(): string | null {
    return this.userIdSubject.value;
  }

  clearUsername(){
    this.usernameSubject.next(null);
    sessionStorage.removeItem('username');
  }

  logout(){
    this.usernameSubject.next(null);
    this.userIdSubject.next(null);
    sessionStorage.clear();
  }
}
