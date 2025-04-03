import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(data: any){
    return this.http.post('api/account/authenticate', data);
  }

  isAuthenticated(): boolean{
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem('referraltoken');
    } 
    return false;
  }

  getUserDetail(){
    const user = localStorage.getItem('userDetails');
    return user ? JSON.parse(user) : null;
  }
}
