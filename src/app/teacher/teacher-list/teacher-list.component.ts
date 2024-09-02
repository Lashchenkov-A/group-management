import { Component, OnInit, Inject, Injector } from '@angular/core';
import { TeacherService } from '../../../core/teacher/teacher.service';
import { Teacher } from '../../../core/teacher/teacher.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { UIService } from '../../../core/common/services/ui.service';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { Paged } from '../../../core/common/models/pages.model';
import { TeacherEditComponent } from '../component/teacher-edit/teacher-edit.component';
import { TeacherAddComponent } from '../component/teacher-add/teacher-add.component';
import { TuiTablePaginationEvent } from '@taiga-ui/addon-table';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.css',
})
export class TeacherListComponent implements OnInit {
  teacher: any;
  page = 1;
  size = 20;
  showDialog() {
    throw new Error('Method not implemented.');
  }
  teachers: Teacher[] = [];
  pagingInfo: Paged<void> | null = null;
  loading: { [key: number]: boolean } = {};
  private readonly destroy$ = new Subject<void>();

  readonly columns: string[] = [
    'firstName',
    'secondName',
    'lastName',
    'jobRole',
    'actions',
  ];

  constructor(
    private teacherService: TeacherService,
    private readonly ui: UIService,
    @Inject(Router) private readonly router: Router,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    private readonly overlay: Overlay
  ) {}

  ngOnInit(): void {
    this.fetchTeachers(1, 20);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPagination({ page, size }: TuiTablePaginationEvent): void {
    this.page = page + 1;
    this.size = size;
    this.fetchTeachers(this.page, this.size);
  }

  fetchTeachers(page: number, pageSize: number): void {
    this.teacherService.getTeachers(this.page, this.size).subscribe(
      (res) => {
        this.teachers = res.data;
        this.pagingInfo = { ...res, data: [] };
      },
      (error) => console.error('Ошибка при запросе:', error)
    );
  }

  deleteTeacher(teacher: Teacher): void {
    this.openConfirmationDialog(teacher)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isConfirmed: boolean) => {
        if (isConfirmed) {
          const id = teacher.id;
          this.loading[id] = true;
          this.teacherService.deleteTeacher(id).subscribe({
            next: () => {
              this.ui.showAlert(
                `Преподаватель "${teacher.jobRole} ${teacher.firstName} ${teacher.secondName} ${teacher.lastName}" успешно удален`
              );
              this.fetchTeachers(this.page, this.size);
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

  openConfirmationDialog(teacher: Teacher) {
    return this.ui.confirmModal(
      'Подтверждение удаления',
      `Вы действительно хотите удалить преподавателя "${teacher.jobRole} ${teacher.firstName} ${teacher.secondName} ${teacher.lastName}"?`
    );
  }

  openEditTeacher(teacher: Teacher) {
    if (!teacher) {
      return;
    }

    this.dialogs
      .open<number>(
        new PolymorpheusComponent(TeacherEditComponent, this.injector),
        {
          data: {
            teacherId: teacher.id,
          },
        }
      )
      .subscribe({
        next: (data) => {
          this.fetchTeachers(this.page, this.size);
        },
      });
  }
  openAddTeacher(teacher: Teacher) {
    this.dialogs
      .open<number>(
        new PolymorpheusComponent(TeacherAddComponent, this.injector)
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.fetchTeachers(this.page, this.size);
          }
        },
      });
  }
}
