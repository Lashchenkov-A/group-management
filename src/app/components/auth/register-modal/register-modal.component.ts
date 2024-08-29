import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import {
  POLYMORPHEUS_CONTEXT,
  PolymorpheusComponent,
} from '@taiga-ui/polymorpheus';
import { UIService } from '../../../../core/common/services/ui.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterModalComponent {
  registerForm: FormGroup;

  @Input() icon: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private readonly ui: UIService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<boolean, void>,
    private readonly dialogService: TuiDialogService
  ) {
    this.registerForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20),
          ],
        ],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  openLogin(event: Event) {
    event.preventDefault();
    this.close();

    this.dialogService
      .open<void>(new PolymorpheusComponent(AuthModalComponent), {
        dismissible: true,
        size: 'm',
      })
      .subscribe();
  }
  close() {
    this.context.completeWith(true);
  }

  passwordMatchValidator(
    group: FormGroup
  ): { [key: string]: boolean | string } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (password?.errors) {
      return password.errors;
    }

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      confirmPassword?.setErrors(null);
    }

    return null;
  }

  register() {
    if (this.registerForm.get('confirmPassword')?.hasError('mismatch')) {
      this.ui.showAlert('Пароли не совпадают', true);
      return;
    }

    if (!this.registerForm.valid) {
      const errors = this.registerForm.errors;
      if (errors) {
        const errorMessage = Object.values(errors).join(', ');
        this.ui.showAlert(errorMessage, true);
        return;
      }
    }

    const { username, password, confirmPassword } = this.registerForm.value;
    this.authService.register(username, password, confirmPassword).subscribe(
      (response) => {
        this.ui.showAlert('Регистрация прошла успешно!');
        this.context.completeWith(true);
      },
      (error) => {
        console.error('Registration Error:', error);

        if (
          error.error &&
          typeof error.error === 'string' &&
          error.error === 'The user already exists!'
        ) {
          this.ui.showAlert('Такой пользователь уже существует!', true);
        } else {
          this.ui.showAlert('Ошибка регистрации!', true);
        }
      }
    );
  }
}
