import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  UserId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usernameSubject = new BehaviorSubject<string | null>(
    sessionStorage.getItem('username')
  );
  username$ = this.usernameSubject.asObservable();

  private userIdSubject = new BehaviorSubject<number | null>(null);
  userId$ = this.userIdSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = sessionStorage.getItem('referralToken');
    if (token) {
      this.setUserId(token);
    }
  }

  login(data: any) {
    return this.http.post('api/account/authenticate', data);
  }

  isAuthenticated(): boolean {
    return (
      typeof window !== 'undefined' && !!sessionStorage.getItem('authToken')
    );
  }

  setUsername(name: string): void {
    if (name !== sessionStorage.getItem('username')) {
      this.usernameSubject.next(name);
      sessionStorage.setItem('username', name);
    }
  }

  getUsername(): string | null {
    return sessionStorage.getItem('username');
  }

  setUserId(token: string | null) {
    if (!token) {
      this.userIdSubject.next(null);
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentId = parseInt(decoded.UserId, 10);

      if (!isNaN(currentId) && currentId !== this.userIdSubject.getValue()) {
        this.userIdSubject.next(currentId);
      }
    } catch (error) {
      this.userIdSubject.next(null);
    }
  }

  getUserId(): number | null {
    return this.userIdSubject.getValue();
  }

  logout() {
    this.usernameSubject.next(null);
    this.userIdSubject.next(null);
    sessionStorage.clear();
  }
}
