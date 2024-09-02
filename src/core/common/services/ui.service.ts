import { TUI_CONFIRM } from '@taiga-ui/kit';
import { Inject, Injectable } from '@angular/core';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root',
})
export class UIService {
  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService
  ) {}

  showAlert(message: string, isError: boolean = false) {
    this.alerts
      .open(message, {
        appearance: isError ? 'error' : 'success',
      })
      .subscribe();
  }

  confirmModal(
    label: string,
    content: string,
    yes: string = 'Да',
    no: string = 'Нет'
  ) {
    return this.dialogs.open<boolean>(TUI_CONFIRM, {
      label,
      size: 'm',
      data: { content, yes, no },
    });
  }
}
