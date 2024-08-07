import { Component, Inject, OnInit } from '@angular/core';
import { TeacherService } from '../../../../core/teacher/teacher.service';
import { Teacher } from '../../../../core/teacher/teacher.model';
import { TeacherFormModel } from '../teacher-form/teacher-form.component';
import { TuiDialogContext } from '@taiga-ui/core';
import { UIService } from '../../../../core/common/services/ui.service';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './teacher-edit.component.html',
  styleUrl: './teacher-edit.component.css',
})
export class TeacherEditComponent implements OnInit {
  teacher: Teacher | null = null;

  constructor(
    private teacherService: TeacherService,
    private readonly ui: UIService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, { teacherId: number }>
  ) {}

  ngOnInit(): void {
    const teacherId = this.context.data.teacherId;
    this.fetchTeacherDetails(teacherId);
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

  updateTeacher(formValues: TeacherFormModel): void {
    if (
      this.teacher?.id &&
      formValues.firstName &&
      formValues.secondName &&
      formValues.lastName &&
      formValues.jobRole
    ) {
      this.teacherService.updateTeacher(this.teacher.id, formValues).subscribe(
        () => {
          this.ui.showAlert('Преподаватель успешно изменен!');
          this.context.completeWith();
        },
        (error) => {
          this.showErrorMessage();
          console.error('Ошибка при обновлении преподавателя', error);
        }
      );
    } else {
      console.log('Форма заполнения преподавателя пустая');
      this.showErrorMessage();
    }
  }

  showErrorMessage(): void {
    this.ui.showAlert('Ошибка при получении деталей преподавателя.', true);
  }
}
