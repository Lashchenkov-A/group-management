import { Inject, Injectable } from '@angular/core';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';

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
        status: isError ? 'error' : 'success',
      })
      .subscribe();
  }

  confirmModal(
    label: string,
    content: string,
    yes: string = 'Yes',
    no: string = 'No'
  ) {
    return this.dialogs.open<boolean>(TUI_PROMPT, {
      label,
      size: 'm',
      data: { content, yes, no },
    });
  }
}
