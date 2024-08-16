import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavigation implements OnInit {
  isAdmin$!: Observable<boolean>;
  isAuthenticated$!: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin$ = this.authService.userRoles$.pipe(
      map((roles) => roles.includes('Admin'))
    );

    this.isAuthenticated$ = this.authService.userRoles$.pipe(
      map((roles) => roles.length > 0)
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
