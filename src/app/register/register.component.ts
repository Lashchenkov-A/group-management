import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  message: string = '';
  error: string = '';

  constructor(private authService: AuthService) {}

  register() {
    this.authService.register(this.username, this.password).subscribe(
      (response) => {
        this.message = 'Registration successful';
      },
      (error) => {
        this.error = 'Registration failed';
      }
    );
  }
}
