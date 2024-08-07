import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { OfficeService } from '../../../../core/office/office.service';
import { OfficeFormModel } from '../office-form/office-form.component';
import { UIService } from '../../../../core/common/services/ui.service';
@Component({
  selector: 'app-office-add',
  templateUrl: './office-add.component.html',
  styleUrls: ['./office-add.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficeAddComponent implements OnInit {
  office: OfficeFormModel = { corpusNumber: 0, classroomNumber: 0 };

  constructor(
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
          this.router.navigate(['/offices']);
        },
        (error) => {
          console.error('Ошибка при добавлении кабинета', error);
          this.showErrorMessage();
        }
      );
    } else {
      console.log('Пустое значение кабинета');
      this.showErrorMessage();
    }
  }

  showErrorMessage(): void {
    this.ui.showAlert('Произошла ошибка при добавлении кабинета.', true);
  }
}
