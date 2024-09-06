import {
  Component,
  OnInit,
  Inject,
  Injector,
  ComponentRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { UIService } from '../../../core/common/services/ui.service';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { Paged } from '../../../core/common/models/pages.model';
import { SubjectService } from '../../../core/subject/subject.service';
import { SubjectEditComponent } from '../components/subject-edit/subject-edit.component';
import { Subjects } from '../../../core/subject/subject.model';
import { SubjectAddComponent } from '../components/subject-add/subject-add.component';
import { TuiTablePaginationEvent } from '@taiga-ui/addon-table';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss'],
})
export class SubjectListComponent implements OnInit {
  subject: any;
  page = 1;
  size = 20;
  IsDeleted = false;
  subjects: Subjects[] = [];
  pagingInfo: Paged<void> | null = null;
  loading: { [key: number]: boolean } = {};
  private readonly destroy$ = new Subject<void>();

  readonly columns: string[] = ['name', 'actions'];

  constructor(
    private subjectService: SubjectService,
    private readonly ui: UIService,
    @Inject(Router) private readonly router: Router,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    private readonly overlay: Overlay
  ) {}

  ngOnInit(): void {
    this.fetchSubjects(this.page, this.size);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPagination({ page, size }: TuiTablePaginationEvent): void {
    this.page = page + 1;
    this.size = size;
    this.fetchSubjects(this.page, this.size);
  }

  fetchSubjects(page: number, pageSize: number): void {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('IsDeleted', this.IsDeleted.toString());

    this.subjectService.getSubjects(page, pageSize, this.IsDeleted).subscribe(
      (res) => {
        this.subjects = res.data.map((subject) => ({
          ...subject,
          isDeleted: subject.isDeleted || false,
        }));
        this.pagingInfo = { ...res, data: [] };
      },
      (error) => console.error('Ошибка при запросе:', error)
    );
  }

  deleteSubject(subject: Subjects): void {
    const id = subject.id;
    this.openConfirmationDialog(subject.name)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isConfirmed: boolean) => {
        if (isConfirmed) {
          this.loading[id] = true;
          this.subjectService.deleteSubject(id).subscribe({
            next: () => {
              this.ui.showAlert(`Предмет ${subject.name} успешно удален`);
              this.fetchSubjects(this.page, this.size);
              delete this.loading[id];
            },
            error: (error) => {
              this.ui.showAlert(`Ошибка при запросе:${error}`, true);
              console.error(error);
              delete this.loading[id];
            },
          });
        }
      });
  }

  openConfirmationDialog(subjectName: string) {
    return this.ui.confirmModal(
      'Подтверждение удаления',
      `Вы действительно хотите удалить предмет "${subjectName}"?`
    );
  }

  openEditSubject(subject: Subjects) {
    if (!subject) {
      return;
    }

    this.dialogs
      .open<number>(
        new PolymorpheusComponent(SubjectEditComponent, this.injector),
        {
          data: {
            subjectId: subject.id,
          },
        }
      )
      .subscribe({
        next: (data) => {
          this.fetchSubjects(this.page, this.size);
        },
      });
  }

  openAddSubject() {
    this.dialogs
      .open<number>(
        new PolymorpheusComponent(SubjectAddComponent, this.injector)
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.fetchSubjects(this.page, this.size);
          }
        },
      });
  }
}
