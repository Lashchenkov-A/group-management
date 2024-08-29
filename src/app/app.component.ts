import { Component, OnDestroy, OnInit, Injector, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { AuthModalComponent } from './components/auth/auth-modal/auth-modal.component';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { AuthService } from '../core/auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Редактирование сущностей';
  isAuthenticated$!: Observable<boolean>;
  private routerSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        map((route) => route.snapshot.data['title'])
      )
      .subscribe((title) => {
        this.pageTitle = title || 'Редактирование сущностей';
      });
    this.isAuthenticated$ = this.authService.userRoles$.pipe(
      map((roles) => roles.length > 0)
    );
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  openAuthModal() {
    this.dialogs
      .open(new PolymorpheusComponent(AuthModalComponent, this.injector))
      .subscribe((dialogRef: any) => {
        if (dialogRef && dialogRef.componentRef) {
          dialogRef.componentRef.instance.setDialogRef(dialogRef);
        }
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
