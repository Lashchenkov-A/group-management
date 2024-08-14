import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from '../../../../core/teacher/teacher.service';
import { TeacherFormModel } from '../teacher-form/teacher-form.component';
import { UIService } from '../../../../core/common/services/ui.service';
@Component({
  selector: 'app-teacher-add',
  templateUrl: './teacher-add.component.html',
  styleUrl: './teacher-add.component.css',
})
export class TeacherAddComponent implements OnInit {
  teacher: TeacherFormModel = {
    firstName: '',
    secondName: '',
    lastName: '',
    jobRole: '',
  };

  constructor(
    private teacherService: TeacherService,
    public router: Router,
    private readonly ui: UIService
  ) {}

  ngOnInit(): void {}

  addTeacher(teacher: TeacherFormModel): void {
    if (
      teacher.firstName &&
      teacher.secondName &&
      teacher.lastName &&
      teacher.jobRole
    ) {
      this.teacherService.addTeacher(teacher).subscribe(
        () => {
          this.ui.showAlert('Преподаватель успешно добавлен!');
          this.router.navigate(['/teachers']);
        },
        (error) => {
          console.error('Ошибка при добавлении преподавателя', error);
          this.showErrorMessage();
        }
      );
    } else {
      this.showErrorMessage();
    }
  }

  showErrorMessage(): void {
    this.ui.showAlert('Произошла ошибка при добавлении преподавателя.', true);
  }
}
