import { Component, OnInit, Inject, Injector, OnDestroy } from '@angular/core';
import { LessonService } from '../../../core/lesson/lesson.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Overlay } from '@angular/cdk/overlay';
import { UIService } from '../../../core/common/services/ui.service';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Paged } from '../../../core/common/models/pages.model';
import { Lesson } from '../../../core/lesson/lesson.model';
import { AddLessonDialogComponent } from '../components/lesson-add/lesson-add.component';

@Component({
  selector: 'app-lesson-list',
  templateUrl: './lesson-list.component.html',
  styleUrls: ['./lesson-list.component.css'],
})
export class LessonListComponent implements OnInit, OnDestroy {
  lessons: Lesson[] = [];
  office: any;
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
    this.fetchLessons();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchLessons(): void {
    this.lessonService.getLessons().subscribe(
      (res) => {
        this.lessons = res;
      },
      (error) => console.error('Ошибка при запросе:', error)
    );
  }

  showDialog(): void {
    const dialogRef = this.dialogs.open<number>(
      new PolymorpheusComponent(AddLessonDialogComponent, this.injector),
      {
        dismissible: true,
        label: 'Добавить пару',
      }
    );

    dialogRef.subscribe({
      next: (data) => {
        console.info(`Dialog emitted data = ${data}`);
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

  editLesson(id: number): void {
    this.router.navigate(['/lessons/edit', id]);
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
              this.fetchLessons();
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
