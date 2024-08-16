import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    let isAdmin = false;

    this.authService.userRoles$.subscribe((roles) => {
      isAdmin = roles.includes('Admin');
    });

    if (!isAdmin) {
      this.router.navigate(['/home']);
    }

    return isAdmin;
  }
}
