import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, tap, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + 'auth';
  private userRolesSubject = new BehaviorSubject<string[]>(
    this.getRolesFromLocalStorage()
  );
  public userRoles$ = this.userRolesSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response) => {
          this.saveTokens(response.token, response.refreshToken);
          this.decodeTokenAndSetRoles(response.token);
        })
      );
  }

  register(
    username: string,
    password: string,
    confirmPassword: string
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      username,
      password,
      confirmPassword,
    });
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  saveTokens(token: string, refreshToken: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<any>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        tap((response) => {
          this.saveTokens(response.token, response.refreshToken);
          this.decodeTokenAndSetRoles(response.token);
        }),
        catchError((error) => {
          this.logout();
          return throwError(error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    this.clearRoles();
    this.userRolesSubject.next([]);
  }

  getRolesFromLocalStorage(): string[] {
    const roles = localStorage.getItem('userRoles');
    return roles ? JSON.parse(roles) : [];
  }

  private decodeTokenAndSetRoles(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);

      const rolesClaim =
        decodedToken[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ];
      let roles: string[] = [];

      if (Array.isArray(rolesClaim)) {
        roles = rolesClaim;
      } else if (typeof rolesClaim === 'string') {
        roles = [rolesClaim];
      }
      this.setRoles(roles);
    } catch (error) {
      console.error('Failed to decode token', error);
      this.clearRoles();
    }
  }

  private setRoles(roles: string[]): void {
    this.userRolesSubject.next(roles);
    localStorage.setItem('userRoles', JSON.stringify(roles));
  }

  private clearRoles(): void {
    this.userRolesSubject.next([]);
    localStorage.removeItem('userRoles');
  }
}
