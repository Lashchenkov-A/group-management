import { Component, Inject, Input, OnInit } from '@angular/core';
import { TeacherService } from '../../../../core/teacher/teacher.service';
import { TuiDialogContext } from '@taiga-ui/core';
import { UIService } from '../../../../core/common/services/ui.service';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

export interface TeacherFormModel {
  id: number | undefined;
  firstName: string;
  secondName: string;
  lastName: string;
  jobRole: string;
  photoPath?: string | undefined;
}

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
    console.log(teacherId);
    this.fetchTeacherDetails(teacherId);
    console.log(teacherId);
  }

  handleSave(): void {
    if (!this.teacher.id) {
      console.error('Идентификатор преподавателя отсутствует.');
      return;
    }
    console.log(this.teacher);
    this.updateTeacher(this.teacher);
    console.log(this.teacher);
  }

  fetchTeacherDetails(teacherId: number): void {
    this.teacherService.getTeacher(teacherId).subscribe(
      (teacher) => {
        console.log(teacher);
        this.teacher = teacher;
        console.log(teacher);
        if (this.teacher.photoPath) {
          console.log(this.teacher.photoPath);
        }
      },
      (error) => {
        console.error('Ошибка при получении деталей преподавателя', error);
      }
    );
  }

  updateTeacher(teacher: TeacherFormModel): void {
    const teacherData = {
      id: teacher.id,
      firstName: teacher.firstName,
      secondName: teacher.secondName,
      lastName: teacher.lastName,
      jobRole: teacher.jobRole,
      photoPath: teacher.photoPath,
    };
    console.log(teacher);
    console.log(teacherData);

    this.teacherService.updateTeacher(teacher.id!, teacherData).subscribe(
      () => {
        console.log('Teacher updated:', teacher);
        this.ui.showAlert('Teacher updated successfully!');
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
