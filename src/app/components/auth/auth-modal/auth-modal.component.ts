import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import {
  POLYMORPHEUS_CONTEXT,
  PolymorpheusComponent,
} from '@taiga-ui/polymorpheus';
import { UIService } from '../../../../core/common/services/ui.service';
import { RegisterModalComponent } from '../register-modal/register-modal.component';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalComponent {
  loginForm: FormGroup;

  @Input() icon: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private readonly ui: UIService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, void>,
    private readonly dialogService: TuiDialogService
  ) {
    this.loginForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(
        (response) => {
          this.ui.showAlert(`Успешно!`);
          this.close();
        },
        (error) => {
          console.error('Login Error:', error);
          this.ui.showAlert(`Неверный логин или пароль!`, true);
        }
      );
    }
  }

  openRegister(event: Event) {
    event.preventDefault();
    this.close();

    this.dialogService
      .open<void>(new PolymorpheusComponent(RegisterModalComponent), {
        dismissible: true,
        size: 'm',
      })
      .subscribe();
  }

  close() {
    this.context.completeWith();
  }
}
