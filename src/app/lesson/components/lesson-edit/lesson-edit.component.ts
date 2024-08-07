import { Component, Inject, OnInit } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { LessonService } from '../../../../core/lesson/lesson.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UIService } from '../../../../core/common/services/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'edit-lesson',
  templateUrl: './lesson-edit.component.html',
  styleUrls: ['./lesson-edit.component.css'],
})
export class LessonEditComponent implements OnInit {
  lessonId: number;

  constructor(
    private lessonService: LessonService,
    private ui: UIService,
    private router: Router,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, any>
  ) {
    this.lessonId = this.context.data.lessonId;
  }

  ngOnInit(): void {}

  onFormSubmit(lesson: any): void {
    this.lessonService.editLesson(this.lessonId, lesson).subscribe(
      () => {
        this.ui.showAlert('Урок успешно обновлен!');
        this.router.navigate(['/lessons']);
      },
      (error: HttpErrorResponse) => {
        console.error('Ошибка при обновлении урока:', error);
        this.showErrorMessage();
      }
    );
  }

  showErrorMessage(): void {
    this.ui.showAlert('Произошла ошибка при обновлении урока.', true);
  }
}
