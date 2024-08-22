import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { SubjectService } from '../../../../core/subject/subject.service';
import { SubjectFormModel } from '../subject-form/subject-form.component';
import { UIService } from '../../../../core/common/services/ui.service';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-subject-add',
  templateUrl: './subject-add.component.html',
  styleUrls: ['./subject-add.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectAddComponent implements OnInit {
  subject: SubjectFormModel = { name: '' };

  constructor(
    private subjectService: SubjectService,
    public router: Router,
    private readonly ui: UIService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<boolean>
  ) {}

  ngOnInit(): void {}

  addSubject(subject: SubjectFormModel): void {
    if (subject.name.trim() !== '') {
      this.subjectService.addSubject(subject).subscribe(
        () => {
          this.ui.showAlert('Группа успешно добавлена!');
          this.context.completeWith(true);
        },
        (error) => {
          console.error('Ошибка при добавлении предмета', error);
          this.showErrorMessage();
        }
      );
    } else {
      this.showErrorMessage();
    }
  }

  showErrorMessage(): void {
    this.ui.showAlert('Произошла ошибка при добавлении предмета.', true);
  }
}
