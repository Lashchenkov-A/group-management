import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TuiFileLike } from '@taiga-ui/kit';
import { finalize, map, Observable, of, Subject, switchMap, timer } from 'rxjs';

export interface TeacherFormModel {
  firstName: string;
  secondName: string;
  lastName: string;
  jobRole: string;
}

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrl: './teacher-form.component.css',
})
export class TeacherFormComponent {
  @Input() onSubmit!: (values: TeacherFormModel, file?: File) => void;
  @Input() teacher: TeacherFormModel = {
    firstName: '',
    secondName: '',
    lastName: '',
    jobRole: '',
  };

  previewUrl: string | ArrayBuffer | null | undefined = null;
  readonly control = new FormControl();
  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.control.valueChanges.pipe(
    switchMap((file) => (file ? this.makeRequest(file) : of(null)))
  );

  constructor(private cdr: ChangeDetectorRef) {}

  onFileSelected(event: Event): void {
    console.log('Событие произошло');
    const input = event.target as HTMLInputElement;
    console.log('Input files:', input.files);

    if (input.files && input.files[0]) {
      console.log('Файл найден');
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.previewUrl = e.target?.result;
        console.log('Предварительный просмотр URL:', this.previewUrl);
        this.cdr.detectChanges();
      };

      reader.onerror = (e) => {
        console.error('Ошибка при чтении файла:', e);
      };

      reader.readAsDataURL(file);
    } else {
      console.error('Файл не найден или не выбран.');
    }
  }

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
    this.control.setValue(null);
  }

  clearRejected(): void {
    this.removeFile();
    this.rejectedFiles$.next(null);
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);

    return timer(1000).pipe(
      map(() => {
        return file;
      }),
      finalize(() => {
        this.loadingFiles$.next(null);
      })
    );
  }

  public handleSubmit(event: Event): void {
    event.preventDefault();
    const file = this.control.value;
    this.onSubmit(this.teacher, file ? (file as File) : undefined);
  }
}
