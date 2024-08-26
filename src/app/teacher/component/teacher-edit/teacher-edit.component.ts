import { Component, Inject, Input, OnInit } from '@angular/core';
import { TeacherService } from '../../../../core/teacher/teacher.service';
import { TuiDialogContext } from '@taiga-ui/core';
import { UIService } from '../../../../core/common/services/ui.service';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TeacherFormModel } from '../teacher-form/teacher-form.component';

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './teacher-edit.component.html',
  styleUrls: ['./teacher-edit.component.css'],
})
export class TeacherEditComponent implements OnInit {
  @Input() icon: string = '';
  teacher: TeacherFormModel = {
    id: undefined,
    firstName: '',
    secondName: '',
    lastName: '',
    jobRole: '',
    photoPath: undefined,
  };

  control = new FormControl();

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<boolean, { teacherId: number }>,
    private teacherService: TeacherService,
    public router: Router,
    private readonly ui: UIService
  ) {}

  ngOnInit(): void {
    const teacherId = this.context.data.teacherId;
    this.fetchTeacherDetails(teacherId);
  }

  handleSave(): void {
    if (!this.teacher.id) {
      console.error('Идентификатор преподавателя отсутствует.');
      return;
    }
    this.updateTeacher(this.teacher);
  }

  fetchTeacherDetails(teacherId: number): void {
    this.teacherService.getTeacher(teacherId).subscribe(
      (teacher) => {
        this.teacher = teacher;
      },
      (error) => {
        console.error('Ошибка при получении деталей преподавателя', error);
      }
    );
  }

  updateTeacher(teacher: TeacherFormModel): void {
    this.teacherService.updateTeacher(teacher.id!, teacher).subscribe(
      () => {
        this.ui.showAlert('Преподаватель изменен успешно!');
        this.context.completeWith(true);
      },
      (error) => {
        console.error('Error updating teacher:', error);
        this.showErrorMessage();
      }
    );
  }

  showErrorMessage(): void {
    this.ui.showAlert('Произошла ошибка при добавлении преподавателя.', true);
  }
}
