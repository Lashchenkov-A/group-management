import { Component, OnInit, Inject } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LessonService } from '../../../../core/lesson/lesson.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UIService } from '../../../../core/common/services/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'add-lesson-dialog',
  templateUrl: './lesson-add.component.html',
  styleUrls: ['./lesson-add.component.css'],
})
export class AddLessonDialogComponent implements OnInit {
  lessonForm: FormGroup;

  years: number[] = [];
  weeks: number[] = Array.from({ length: 53 }, (_, i) => i + 1);
  hours: number[] = Array.from({ length: 15 }, (_, i) => i + 7);
  minutes: string[] = Array.from({ length: 12 }, (_, i) =>
    (i * 5).toString().padStart(2, '0')
  );

  daysOfWeek = [
    { value: 1, text: 'Понедельник' },
    { value: 2, text: 'Вторник' },
    { value: 3, text: 'Среда' },
    { value: 4, text: 'Четверг' },
    { value: 5, text: 'Пятница' },
    { value: 6, text: 'Суббота' },
  ];

  teachers: any[] = [];
  groups: any[] = [];
  subjects: any[] = [];
  offices: any[] = [];

  constructor(
    private fb: FormBuilder,
    private lessonService: LessonService,
    private ui: UIService,
    public router: Router,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, any>
  ) {
    this.lessonForm = this.fb.group({
      year: [null, Validators.required],
      week: [null, Validators.required],
      startTimeHour: [null, Validators.required],
      startTimeMinute: [null, Validators.required],
      endTimeHour: [null, Validators.required],
      endTimeMinute: [null, Validators.required],
      dayOfWeek: [null, Validators.required],
      teacherId: [null, Validators.required],
      groupId: [null, Validators.required],
      subjectId: [null, Validators.required],
      officeId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => currentYear + i);

    this.lessonService.getLookupData('teacher').subscribe((data) => {
      this.teachers = this.parseTeachers(data);
    });
    this.lessonService.getLookupData('group').subscribe((data) => {
      this.groups = this.parseGroups(data);
    });
    this.lessonService.getLookupData('subject').subscribe((data) => {
      this.subjects = this.parseSubjects(data);
    });
    this.lessonService.getLookupData('office').subscribe((data) => {
      this.offices = this.parseOffices(data);
    });

    if (this.context.data && this.context.data.lessonId) {
      this.lessonService
        .getLessonDetails(this.context.data.lessonId)
        .subscribe((lesson) => {
          this.lessonForm.patchValue({
            ...lesson,
            startTimeHour: lesson.startTime.split(':')[0],
            startTimeMinute: lesson.startTime.split(':')[1],
            endTimeHour: lesson.endTime.split(':')[0],
            endTimeMinute: lesson.endTime.split(':')[1],
          });
        });
    }
  }

  parseTeachers(data: any[]): any[] {
    return data.map((item) => ({
      id: item.id,
      fullName: `${item.lastName} ${item.firstName} ${item.secondName} ${item.jobRole}`,
    }));
  }

  parseGroups(data: any[]): any[] {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  }

  parseSubjects(data: any[]): any[] {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  }

  parseOffices(data: any[]): any[] {
    return data.map((item) => ({
      id: item.id,
      officeName: item.officeName,
    }));
  }

  dayStringify = (item: { value: number; text: string }) => item.text;
  teacherStringify = (item: { id: string; fullName: string }) => item.fullName;
  groupStringify = (item: { id: string; name: string }) => item.name;
  subjectStringify = (item: { id: string; name: string }) => item.name;
  officeStringify = (item: { id: string; officeName: string }) =>
    item.officeName;

  submit(): void {
    if (this.lessonForm.valid) {
      const formValues = this.lessonForm.value;

      const lesson = {
        year: formValues.year,
        week: formValues.week,
        startTime: `${formValues.startTimeHour}:${formValues.startTimeMinute}`,
        endTime: `${formValues.endTimeHour}:${formValues.endTimeMinute}`,
        dayOfWeek: formValues.dayOfWeek.value,
        teacherId: formValues.teacherId.id,
        groupId: formValues.groupId.id,
        subjectId: formValues.subjectId.id,
        officeId: formValues.officeId.id,
      };

      this.lessonService.addLesson(lesson).subscribe(
        () => {
          this.ui.showAlert('Урок успешно добавлен!');
          this.router.navigate(['/lessons']);
        },
        (error: HttpErrorResponse) => {
          console.error('Ошибка при добавлении урока:', error);
          this.showErrorMessage();
        }
      );
    } else {
      console.log('Заполните все поля');
      this.showErrorMessage();
    }
  }

  showErrorMessage(): void {
    this.ui.showAlert('Произошла ошибка при добавлении урока.', true);
  }
}
