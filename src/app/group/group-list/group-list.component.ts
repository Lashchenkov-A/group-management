import {
  Component,
  OnInit,
  Inject,
  Injector,
  ComponentRef,
} from '@angular/core';
import { GroupService } from '../../../core/group/group.service';
import { Group } from '../../../core/group/group.model';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TuiDialogService } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { UIService } from '../../../core/common/ui.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit {
  groups: Group[] = [];
  loading: { [key: number]: boolean } = {};
  private readonly destroy$ = new Subject<void>();

  constructor(
    private groupService: GroupService,
    private readonly ui: UIService,
    @Inject(Router) private readonly router: Router,
    @Inject(Injector) private readonly injector: Injector,
    private readonly overlay: Overlay
  ) {}

  ngOnInit(): void {
    this.fetchGroups();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchGroups(): void {
    this.groupService.getGroups().subscribe(
      (groups) => (this.groups = groups),
      (error) => console.error('Ошибка при запросе:', error)
    );
  }

  deleteGroup(group: Group): void {
    const id = group.id;
    this.openConfirmationDialog(group.name)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isConfirmed: boolean) => {
        if (isConfirmed) {
          this.loading[id] = true;
          this.groupService.deleteGroup(id).subscribe({
            next: () => {
              this.ui.showAlert(`Группа ${group.name} успешно удалена`);
              this.fetchGroups();
              delete this.loading[id];
            },
            error: (error) => {
              this.ui.showAlert(`Ошибка при запросе:${error}`, true);
              console.error(error);
              delete this.loading[id];
            },
          });
        }
      });
  }

  openConfirmationDialog(groupName: string) {
    return this.ui.confirmModal(
      'Подтверждение удаления',
      `Вы действительно хотите удалить группу "${groupName}"?`
    );
  }
}
