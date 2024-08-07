import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavigation {}
