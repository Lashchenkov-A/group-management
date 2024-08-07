import { Component, Inject, OnInit } from '@angular/core';
import { OfficeService } from '../../../../core/office/office.service';
import { Office } from '../../../../core/office/office.model';
import { OfficeFormModel } from '../office-form/office-form.component';
import { TuiDialogContext } from '@taiga-ui/core';
import { UIService } from '../../../../core/common/services/ui.service';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-office-edit',
  templateUrl: './office-edit.component.html',
  styleUrl: './office-edit.component.css',
})
export class OfficeEditComponent implements OnInit {
  office: Office | null = null;

  constructor(
    private officeService: OfficeService,
    private readonly ui: UIService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, { officeId: number }>
  ) {}

  ngOnInit(): void {
    const officeId = this.context.data.officeId;
    this.fetchOfficeDetails(officeId);
  }

  fetchOfficeDetails(officeId: number): void {
    this.officeService.getOffice(officeId).subscribe(
      (office) => {
        this.office = office;
      },
      (error) => {
        console.error('Ошибка при получении деталей кабинета', error);
      }
    );
  }

  updateOffice(formValues: OfficeFormModel): void {
    if (
      this.office?.id &&
      formValues.corpusNumber &&
      formValues.classroomNumber
    ) {
      this.officeService.updateOffice(this.office.id, formValues).subscribe(
        () => {
          this.ui.showAlert('Кабинет успешно изменен!');
          this.context.completeWith();
        },
        (error) => {
          this.showErrorMessage();
          console.error('Ошибка при обновлении кабинета', error);
        }
      );
    } else {
      console.log('Номер кабинета пустой');
      this.showErrorMessage();
    }
  }

  showErrorMessage(): void {
    this.ui.showAlert('Ошибка при получении деталей кабинета.', true);
  }
}
