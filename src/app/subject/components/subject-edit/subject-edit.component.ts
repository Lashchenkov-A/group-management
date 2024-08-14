import { Component, Inject, OnInit } from '@angular/core';
import { SubjectService } from '../../../../core/subject/subject.service';
import { Subjects } from '../../../../core/subject/subject.model';
import { SubjectFormModel } from '../subject-form/subject-form.component';
import { TuiDialogContext } from '@taiga-ui/core';
import { UIService } from '../../../../core/common/services/ui.service';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-subject-edit',
  templateUrl: './subject-edit.component.html',
  styleUrls: ['./subject-edit.component.css'],
})
export class SubjectEditComponent implements OnInit {
  subject: Subjects | null = null;

  constructor(
    private SubjectService: SubjectService,
    private readonly ui: UIService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, { subjectId: number }>
  ) {}

  ngOnInit(): void {
    const subjectId = this.context.data.subjectId;
    this.fetchSubjectDetails(subjectId);
  }

  fetchSubjectDetails(subjectId: number): void {
    this.SubjectService.getSubject(subjectId).subscribe(
      (subject) => {
        this.subject = subject;
      },
      (error) => {
        console.error('Ошибка при получении деталей предмета', error);
      }
    );
  }

  updateSubject(formValues: SubjectFormModel): void {
    if (this.subject?.id && formValues.name.trim()) {
      this.SubjectService.updateSubject(this.subject.id, formValues).subscribe(
        () => {
          this.ui.showAlert('Предмет успешно изменен!');
          this.context.completeWith();
        },
        (error) => {
          this.showErrorMessage();
          console.error('Ошибка при обновлении предмета', error);
        }
      );
    } else {
      this.showErrorMessage();
    }
  }

  showErrorMessage(): void {
    this.ui.showAlert('Ошибка при получении деталей предмета.', true);
  }
}
