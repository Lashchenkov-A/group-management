import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectService } from '../../../../core/subject/subject.service';
import { SubjectFormModel } from '../subject-form/subject-form.component';
import { UIService } from '../../../../core/common/services/ui.service';
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
    private readonly ui: UIService
  ) {}

  ngOnInit(): void {}

  addSubject(subject: SubjectFormModel): void {
    if (subject.name.trim() !== '') {
      this.subjectService.addSubject(subject).subscribe(
        () => {
          this.ui.showAlert('Группа успешно добавлена!');
          this.router.navigate(['/subjects']);
        },
        (error) => {
          console.error('Ошибка при добавлении предмета', error);
          this.showErrorMessage();
        }
      );
    } else {
      console.log('Имя предмета пусто');
      this.showErrorMessage();
    }
  }

  showErrorMessage(): void {
    this.ui.showAlert('Произошла ошибка при добавлении предмета.', true);
  }
}
