import { Component, Inject, Input, OnInit } from '@angular/core';
import { TeacherService } from '../../../../core/teacher/teacher.service';
import { Teacher } from '../../../../core/teacher/teacher.model';
import { TeacherFormModel } from '../teacher-form/teacher-form.component';
import { TuiDialogContext } from '@taiga-ui/core';
import { UIService } from '../../../../core/common/services/ui.service';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './teacher-edit.component.html',
  styleUrl: './teacher-edit.component.css',
})
export class TeacherEditComponent implements OnInit {
  teacher: Teacher | null = null;
  @Input() icon: string = '';
  previewUrl: string | ArrayBuffer | null | undefined = null;
  control = new FormControl();

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
        if (this.teacher.photoPath) {
          this.teacher.photoPath = `https://localhost:44330${this.teacher.photoPath}`;
          console.log(this.teacher.photoPath);
        }
      },
      (error) => {
        console.error('Ошибка при получении деталей преподавателя', error);
      }
    );
  }

  handleSave(): void {
    const file = this.control.value;
    this.updateTeacher(this.teacher as TeacherFormModel, file);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result;
        console.log('Предварительный просмотр URL:', this.previewUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  updateTeacher(formValues: TeacherFormModel, file?: File): void {
    if (
      this.teacher?.id &&
      formValues.firstName &&
      formValues.secondName &&
      formValues.lastName &&
      formValues.jobRole
    ) {
      this.teacherService.updateTeacher(this.teacher.id, formValues).subscribe(
        () => {
          if (file && this.teacher) {
            this.teacherService
              .uploadTeacherPhoto(this.teacher.id, file)
              .subscribe(
                (response) => {
                  this.ui.showAlert(
                    'Преподаватель и фотография успешно обновлены!'
                  );
                  this.teacher!.photoPath = response.photoPath;
                  this.context.completeWith();
                },
                (error) => {
                  this.showErrorMessage('Ошибка при загрузке фотографии.');
                  console.error('Ошибка при загрузке фотографии', error);
                }
              );
          } else {
            this.ui.showAlert('Преподаватель успешно обновлен!');
            this.context.completeWith();
          }
        },
        (error) => {
          this.showErrorMessage('Ошибка при обновлении преподавателя.');
          console.error('Ошибка при обновлении преподавателя', error);
        }
      );
    }
  }

  showErrorMessage(message: string): void {
    this.ui.showAlert(message, true);
  }
}
