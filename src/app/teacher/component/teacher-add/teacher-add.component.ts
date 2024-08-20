import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from '../../../../core/teacher/teacher.service';
import { TeacherFormModel } from '../teacher-form/teacher-form.component';
import { UIService } from '../../../../core/common/services/ui.service';
import { FormControl } from '@angular/forms';
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
  };

  control = new FormControl();

  constructor(
    private teacherService: TeacherService,
    public router: Router,
    private readonly ui: UIService
  ) {}

  ngOnInit(): void {}

  handleSave(): void {
    const file = this.control.value;
    this.addTeacher(this.teacher, file);
  }

  addTeacher(teacher: TeacherFormModel, file?: File): void {
    if (
      teacher.firstName &&
      teacher.secondName &&
      teacher.lastName &&
      teacher.jobRole
    ) {
      this.teacherService.addTeacher(teacher, file).subscribe(
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
