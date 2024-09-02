import { Component, OnInit, Inject, Injector } from '@angular/core';
import { GroupService } from '../../../core/group/group.service';
import { Group } from '../../../core/group/group.model';
import { forkJoin, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { UIService } from '../../../core/common/services/ui.service';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { GroupEditComponent } from '../components/group-edit/group-edit.component';
import { Paged } from '../../../core/common/models/pages.model';
import { GroupAddComponent } from '../components/group-add/group-add.component';
import { TuiTablePaginationEvent } from '@taiga-ui/addon-table';
import { GroupReplaceComponent } from '../components/group-replace/group-replace/group-replace.component';
import { LessonService } from '../../../core/lesson/lesson.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit {
  group: any;
  page = 1;
  size = 20;
  showDialog() {
    throw new Error('Method not implemented.');
  }
  groups: Group[] = [];
  pagingInfo: Paged<void> | null = null;
  loading: { [key: number]: boolean } = {};
  private readonly destroy$ = new Subject<void>();

  readonly columns: string[] = ['name', 'actions'];

  constructor(
    private lessonService: LessonService,
    private groupService: GroupService,
    private readonly ui: UIService,
    @Inject(Router) private readonly router: Router,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    private readonly overlay: Overlay
  ) {}

  ngOnInit(): void {
    this.fetchGroups(1, 20);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPagination({ page, size }: TuiTablePaginationEvent): void {
    this.page = page + 1;
    this.size = size;
    this.fetchGroups(this.page, this.size);
  }

  fetchGroups(page: number, pageSize: number): void {
    this.groupService.getGroups(this.page, this.size).subscribe(
      (res) => {
        this.groups = res.data;
        this.pagingInfo = { ...res, data: [] };
      },
      (error) => console.error('Ошибка при запросе:', error)
    );
  }

  deleteGroup(group: Group): void {
    const id = group.id;
    this.groupService.checkGroupUsage(id).subscribe((result) => {
      if (result.used) {
        this.dialogs
          .open<number | boolean>(
            new PolymorpheusComponent(GroupReplaceComponent, this.injector),
            {
              data: result.lessons,
              label: `Внимание!`,
              size: 'm',
            }
          )
          .subscribe((newGroupId) => {
            if (newGroupId === true) {
              this.groupService.deleteGroup(id).subscribe({
                next: () => {
                  this.ui.showAlert(
                    `Группа ${group.name} и связанные с ней уроки успешно удалены`
                  );
                  this.fetchGroups(this.page, this.size);
                },
                error: (error) => {
                  this.ui.showAlert(`Ошибка при удалении: ${error}`, true);
                  console.error(error);
                },
              });
            } else if (newGroupId) {
              this.updateLessons(result.lessons, newGroupId).subscribe(() => {
                this.groupService.deleteGroup(id).subscribe({
                  next: () => {
                    this.ui.showAlert(`Группа ${group.name} успешно удалена`);
                    this.fetchGroups(this.page, this.size);
                  },
                  error: (error) => {
                    this.ui.showAlert(`Ошибка при удалении: ${error}`, true);
                    console.error(error);
                  },
                });
              });
            }
          });
      } else {
        this.openConfirmationDialog(group.name)
          .pipe(takeUntil(this.destroy$))
          .subscribe((isConfirmed: boolean) => {
            if (isConfirmed) {
              this.groupService.deleteGroup(id).subscribe({
                next: () => {
                  this.ui.showAlert(`Группа ${group.name} успешно удалена`);
                  this.fetchGroups(this.page, this.size);
                },
                error: (error) => {
                  this.ui.showAlert(`Ошибка при удалении: ${error}`, true);
                  console.error(error);
                },
              });
            }
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
        next: () => {
          this.fetchGroups(this.page, this.size);
        },
      });
  }

  openAddGroup(group: Group) {
    this.dialogs
      .open<number>(new PolymorpheusComponent(GroupAddComponent, this.injector))
      .subscribe({
        next: (result) => {
          if (result) {
            this.fetchGroups(this.page, this.size);
          }
        },
      });
  }

  updateLessons(lessons: any[], newGroupId: number): Observable<any> {
    const lessonObservables = lessons.map((lesson) =>
      this.lessonService.getLessonDetails(lesson.id)
    );

    return forkJoin(lessonObservables).pipe(
      map((fullLessons) =>
        fullLessons.map((fullLesson) => ({
          ...fullLesson,
          groupId: newGroupId,
        }))
      ),
      map((updatedLessons) =>
        updatedLessons.map((updatedLesson) =>
          this.lessonService.editLesson(updatedLesson.id, updatedLesson)
        )
      ),
      switchMap((updateObservables) => forkJoin(updateObservables)),
      tap(() => this.ui.showAlert('Уроки успешно обновлены')),
      catchError((error) => {
        this.ui.showAlert(`Ошибка при обновлении уроков: ${error}`, true);
        return throwError(error);
      })
    );
  }
}
