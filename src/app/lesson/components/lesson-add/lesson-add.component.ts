import { Component, Inject, OnInit } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { LessonService } from '../../../../core/lesson/lesson.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UIService } from '../../../../core/common/services/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'add-lesson-dialog',
  templateUrl: './lesson-add.component.html',
  styleUrls: ['./lesson-add.component.css'],
})
export class LessonAddComponent {
  constructor(
    private lessonService: LessonService,
    private ui: UIService,
    private router: Router,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<boolean, any>
  ) {}

  onFormSubmit(lesson: any): void {
    this.lessonService.addLesson(lesson).subscribe(
      () => {
        this.ui.showAlert('Урок успешно добавлен!');
        this.context.completeWith(true);
      },
      (error: HttpErrorResponse) => {
        if (
          error.status === 400 &&
          error.error &&
          error.error.validationErrors
        ) {
          this.ui.showAlert('Заполните все обязательные поля.', true);
        } else {
          this.showErrorMessage();
        }
        console.error('Ошибка при добавлении урока:', error);
      }
    );
  }

  showErrorMessage(): void {
    this.ui.showAlert('Произошла ошибка при добавлении урока.', true);
  }
}
