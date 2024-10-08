import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { OfficeService } from '../../../../core/office/office.service';
import { OfficeFormModel } from '../office-form/office-form.component';
import { UIService } from '../../../../core/common/services/ui.service';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
@Component({
  selector: 'app-office-add',
  templateUrl: './office-add.component.html',
  styleUrls: ['./office-add.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficeAddComponent implements OnInit {
  office: OfficeFormModel = { corpusNumber: 0, classroomNumber: 0 };

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<boolean>,
    private officeService: OfficeService,
    public router: Router,
    private readonly ui: UIService
  ) {}

  ngOnInit(): void {}

  addOffice(office: OfficeFormModel): void {
    if (office.corpusNumber && office.classroomNumber) {
      this.officeService.addOffice(office).subscribe(
        () => {
          this.ui.showAlert('Кабинет успешно добавлен!');
          this.context.completeWith(true);
        },
        (error) => {
          console.error('Ошибка при добавлении кабинета', error);
          this.showErrorMessage();
        }
      );
    } else {
      this.showErrorMessage();
    }
  }

  showErrorMessage(): void {
    this.ui.showAlert('Произошла ошибка при добавлении кабинета.', true);
  }
}
