import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from '../../../../core/teacher/teacher.service';
import { TeacherFormModel } from '../teacher-form/teacher-form.component';
import { UIService } from '../../../../core/common/services/ui.service';
import { FormControl } from '@angular/forms';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';

@Component({
  selector: 'app-teacher-add',
  templateUrl: './teacher-add.component.html',
  styleUrl: './teacher-add.component.css',
})
export class TeacherAddComponent implements OnInit {
  @Input() icon: string = '';
  teacher: TeacherFormModel = {
    firstName: '',
    secondName: '',
    lastName: '',
    jobRole: '',
    photoPath: undefined,
    id: undefined,
  };

  control = new FormControl();

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<boolean>,
    private teacherService: TeacherService,
    public router: Router,
    private readonly ui: UIService
  ) {}

  ngOnInit(): void {}

  handleSave(): void {
    const file = this.control.value;
    this.addTeacher(this.teacher);
  }

  addTeacher(teacher: TeacherFormModel): void {
    this.teacherService.addTeacher(teacher).subscribe(
      () => {
        this.ui.showAlert('Преподаватель успешно добавлен!');
        this.context.completeWith(true);
      },
      (error) => {
        console.error('Ошибка при добавлении преподавателя', error);
        this.showErrorMessage();
      }
    );
  }

  showErrorMessage(): void {
    this.ui.showAlert('Произошла ошибка при добавлении преподавателя.', true);
  }
}
