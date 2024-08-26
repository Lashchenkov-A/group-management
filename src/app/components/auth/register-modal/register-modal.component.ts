import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { UIService } from '../../../../core/common/services/ui.service';

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
    private readonly context: TuiDialogContext<boolean, void>
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
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
      return { mismatch: true };
    }

    return null;
  }

  register() {
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
          error.error.startsWith('User creation error:')
        ) {
          const errorMessage = error.error.replace('User creation error: ', '');
          this.ui.showAlert(errorMessage, true);
        } else {
          this.ui.showAlert('Ошибка регистрации!', true);
        }
      }
    );
  }
}
