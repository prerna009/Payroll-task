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

  private userIdSubject = new BehaviorSubject<number | null>(
    this.getDecodedUserIdFromToken()
  );
  userId$ = this.userIdSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post('api/account/authenticate', data);
  }

  isAuthenticated(): boolean {
    return typeof window !== 'undefined' && !!sessionStorage.getItem('authToken');
  }

  setUsername(name: string): void {
    const currentUsername = this.usernameSubject.getValue();
    if (name !== currentUsername) {
      this.usernameSubject.next(name);
      sessionStorage.setItem('username', name);
    }
  }

  getUsername(): string | null {
    return sessionStorage.getItem('username');
  }

  private getDecodedUserIdFromToken(): number | null {
    const token = sessionStorage.getItem('referralToken');
    if (!token) return null;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentId = parseInt(decoded.UserId, 10);
      return !isNaN(currentId) ? currentId : null;
    } catch (error) {
      return null;
    }
  }

  setUserId(token: string | null) {
    if (!token) {
      this.userIdSubject.next(null);
      return;
    }

    const decodedUserId = this.getDecodedUserIdFromToken();
    if (decodedUserId !== null && decodedUserId !== this.userIdSubject.getValue()) {
      this.userIdSubject.next(decodedUserId);
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
