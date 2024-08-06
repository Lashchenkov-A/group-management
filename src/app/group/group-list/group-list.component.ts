import {
  Component,
  OnInit,
  Inject,
  Injector,
  ComponentRef,
} from '@angular/core';
import { GroupService } from '../../../core/group/group.service';
import { Group } from '../../../core/group/group.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { UIService } from '../../../core/common/services/ui.service';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { GroupEditComponent } from '../components/group-edit/group-edit.component';
import { Paged } from '../../../core/common/models/pages.model';
import { GroupAddComponent } from '../components/group-add/group-add.component';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit {
  group: any;
  showDialog() {
    throw new Error('Method not implemented.');
  }
  groups: Group[] = [];
  pagingInfo: Paged<void> | null = null;
  loading: { [key: number]: boolean } = {};
  private readonly destroy$ = new Subject<void>();

  readonly columns: string[] = ['name', 'actions'];

  constructor(
    private groupService: GroupService,
    private readonly ui: UIService,
    @Inject(Router) private readonly router: Router,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    private readonly overlay: Overlay
  ) {}

  ngOnInit(): void {
    this.fetchGroups(1, 2);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(data: number) {
    if (this.pagingInfo) {
      this.fetchGroups(data + 1, this.pagingInfo.pageSize);
    }
  }

  onSizeChange(data: number) {
    if (this.pagingInfo) {
      this.pagingInfo.pageSize = data;
    }
  }

  fetchGroups(page: number, pageSize: number): void {
    this.groupService.getGroups(page, pageSize).subscribe(
      (res) => {
        this.groups = res.data;
        this.pagingInfo = { ...res, data: [] };
      },
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
              this.fetchGroups(
                this.pagingInfo!.page,
                this.pagingInfo!.pageSize
              );
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

  openEditGroup(group: Group) {
    if (!group) {
      return;
    }

    this.dialogs
      .open<number>(
        new PolymorpheusComponent(GroupEditComponent, this.injector),
        {
          data: {
            groupId: group.id,
          },
        }
      )
      .subscribe({
        next: (data) => {
          this.fetchGroups(this.pagingInfo!.page, this.pagingInfo!.pageSize);
        },
      });
  }
  openAddGroup(group: Group) {
    this.dialogs
      .open<number>(new PolymorpheusComponent(GroupAddComponent, this.injector))
      .subscribe({});
  }
}
