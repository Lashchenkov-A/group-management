import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TuiFileLike } from '@taiga-ui/kit';
import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { TeacherService } from '../../../../core/teacher/teacher.service';
import { UIService } from '../../../../core/common/services/ui.service';

export interface TeacherFormModel {
  id: number | undefined;
  firstName: string;
  secondName: string;
  lastName: string;
  jobRole: string;
  photoPath?: string | undefined;
}

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.css'],
})
export class TeacherFormComponent {
  @Input() icon: string = '';
  @Input() onSubmit!: (values: TeacherFormModel) => void;
  @Input() teacher: TeacherFormModel = {
    firstName: '',
    secondName: '',
    lastName: '',
    jobRole: '',
    photoPath: undefined,
    id: undefined,
  };

  previewUrl: string | ArrayBuffer | null | undefined = null;
  readonly control = new FormControl();
  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.control.valueChanges.pipe(
    switchMap((file) => (file ? this.makeRequest(file) : of(null)))
  );

  removePhoto: boolean = false;
  constructor(private teacherService: TeacherService, private ui: UIService) {}

  setPreviewFromFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.previewUrl = e.target?.result;
    };

    reader.onerror = (e) => {
      console.error('Ошибка при чтении файла:', e);
    };

    reader.readAsDataURL(file);
  }

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
    this.control.setValue(null);
    this.previewUrl = null;
  }

  clearRejected(): void {
    this.removeFile();
    this.rejectedFiles$.next(null);
  }

  protected readonly failedFiles$ = new Subject<TuiFileLike | null>();

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
    this.setPreviewFromFile(file as File);

    this.loadingFiles$.next(file);

    return this.teacherService.uploadTeacherPhoto(file as File).pipe(
      catchError(() => {
        return of(null);
      }),
      map((result) => {
        if (result) {
          this.teacher.photoPath = result.photoPath;
          this.ui.showAlert('Фотография успешно добавлена!');
          return file;
        } else {
          this.previewUrl = null;

          this.ui.showAlert('Ошибка при загрузке фотографии.', true);
          this.rejectedFiles$.next(file);
          return null;
        }
      }),
      finalize(() => this.loadingFiles$.next(null))
    );
  }

  public handleSubmit(event: Event): void {
    event.preventDefault();

    if (this.removePhoto) {
      this.teacher.photoPath = undefined;
    }
    this.onSubmit(this.teacher);
  }
}
