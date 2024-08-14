import {
  Component,
  OnInit,
  Inject,
  Injector,
  ComponentRef,
} from '@angular/core';
import { OfficeService } from '../../../core/office/office.service';
import { Office } from '../../../core/office/office.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { UIService } from '../../../core/common/services/ui.service';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { OfficeEditComponent } from '../components/office-edit/office-edit.component';
import { Paged } from '../../../core/common/models/pages.model';
import { OfficeAddComponent } from '../components/office-add/office-add.component';

@Component({
  selector: 'app-office-list',
  templateUrl: './office-list.component.html',
  styleUrls: ['./office-list.component.scss'],
})
export class OfficeListComponent implements OnInit {
  office: any;
  showDialog() {
    throw new Error('Method not implemented.');
  }
  offices: Office[] = [];
  pagingInfo: Paged<void> | null = null;
  loading: { [key: number]: boolean } = {};
  private readonly destroy$ = new Subject<void>();

  readonly columns: string[] = ['corpusNumber', 'classroomNumber', 'actions'];

  constructor(
    private officeService: OfficeService,
    private readonly ui: UIService,
    @Inject(Router) private readonly router: Router,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    private readonly overlay: Overlay
  ) {}

  ngOnInit(): void {
    this.fetchOffices(1, 2);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(data: number) {
    if (this.pagingInfo) {
      this.fetchOffices(data + 1, this.pagingInfo.pageSize);
    }
  }

  onSizeChange(data: number) {
    if (this.pagingInfo) {
      this.pagingInfo.pageSize = data;
    }
  }

  fetchOffices(page: number, pageSize: number): void {
    this.officeService.getOffices(page, pageSize).subscribe(
      (res) => {
        this.offices = res.data;
        this.pagingInfo = { ...res, data: [] };
      },
      (error) => console.error('Ошибка при запросе:', error)
    );
  }

  deleteOffice(office: Office): void {
    const id = office.id;
    this.openConfirmationDialog()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isConfirmed: boolean) => {
        if (isConfirmed) {
          this.loading[id] = true;
          this.officeService.deleteOffice(id).subscribe({
            next: () => {
              this.ui.showAlert(`Кабинет успешно удален`);
              this.fetchOffices(
                this.pagingInfo!.page,
                this.pagingInfo!.pageSize
              );
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

  openConfirmationDialog() {
    return this.ui.confirmModal(
      'Подтверждение удаления',
      `Вы действительно хотите удалить кабинет?`
    );
  }

  openEditOffice(office: Office) {
    if (!office) {
      return;
    }

    this.dialogs
      .open<number>(
        new PolymorpheusComponent(OfficeEditComponent, this.injector),
        {
          data: {
            officeId: office.id,
          },
        }
      )
      .subscribe({
        next: (data) => {
          this.fetchOffices(this.pagingInfo!.page, this.pagingInfo!.pageSize);
        },
      });
  }
  openAddOffice(office: Office) {
    this.dialogs
      .open<number>(
        new PolymorpheusComponent(OfficeAddComponent, this.injector)
      )
      .subscribe({});
  }
}
