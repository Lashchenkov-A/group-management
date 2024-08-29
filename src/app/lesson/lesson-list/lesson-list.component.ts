import { Component, OnInit, Inject, Injector, OnDestroy } from '@angular/core';
import { LessonService } from '../../../core/lesson/lesson.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Overlay } from '@angular/cdk/overlay';
import { UIService } from '../../../core/common/services/ui.service';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { Paged } from '../../../core/common/models/pages.model';
import { Lesson } from '../../../core/lesson/lesson.model';
import { LessonAddComponent } from '../components/lesson-add/lesson-add.component';
import { LessonEditComponent } from '../components/lesson-edit/lesson-edit.component';
import { TuiTablePaginationEvent } from '@taiga-ui/addon-table';

@Component({
  selector: 'app-lesson-list',
  templateUrl: './lesson-list.component.html',
  styleUrls: ['./lesson-list.component.css'],
})
export class LessonListComponent implements OnInit, OnDestroy {
  lessons: Lesson[] = [];
  office: any;
  page = 1;
  size = 2;
  loading: { [key: number]: boolean } = {};
  pagingInfo: Paged<void> | null = null;
  private readonly destroy$ = new Subject<void>();

  readonly columns: string[] = ['name', 'actions'];
  console: any;

  constructor(
    private lessonService: LessonService,
    private readonly ui: UIService,
    @Inject(Router) private readonly router: Router,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    private readonly overlay: Overlay
  ) {}

  ngOnInit(): void {
    this.fetchLessons(1, 10);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPagination({ page, size }: TuiTablePaginationEvent): void {
    this.page = page;
    this.size = size;
    this.fetchLessons(this.page, this.size);
  }

  fetchLessons(page: number, pageSize: number): void {
    this.lessonService.getLessons(page + 1, pageSize).subscribe(
      (res) => {
        this.lessons = res.data;
        this.pagingInfo = { ...res, data: [] };
      },
      (error) => console.error('Ошибка при запросе:', error)
    );
  }

  showDialog(): void {
    const dialogRef = this.dialogs.open<number>(
      new PolymorpheusComponent(LessonAddComponent, this.injector),
      {
        dismissible: true,
        label: 'Добавить пару',
      }
    );

    dialogRef.subscribe({
      next: (data) => {},
    });
  }

  showDialogs(lessonId: number): void {
    const dialogRef = this.dialogs.open<number>(
      new PolymorpheusComponent(LessonEditComponent, this.injector),
      {
        dismissible: true,
        label: 'Редактировать пару',
        data: { lessonId },
      }
    );

    dialogRef.subscribe({
      next: (data) => {
        console.info(`Dialog emitted data = ${data}`);
      },
      complete: () => {},
    });
  }

  deleteLesson(lesson: Lesson): void {
    const id = lesson.id;
    this.openConfirmationDialog()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isConfirmed: boolean) => {
        if (isConfirmed) {
          this.loading[id] = true;
          this.lessonService.deleteLesson(id).subscribe({
            next: () => {
              this.ui.showAlert(`Занятие успешно удалено`);
              this.fetchLessons(this.page, this.size);
              delete this.loading[id];
            },
            error: (error) => {
              this.ui.showAlert(`Ошибка при запросе: ${error}`, true);
              console.error(error);
              delete this.loading[id];
            },
          });
        }
      });
  }

  openConfirmationDialog() {
    return this.ui.confirmModal(
      'Подтверждение удаления',
      `Вы действительно хотите удалить занятие?`
    );
  }
}
