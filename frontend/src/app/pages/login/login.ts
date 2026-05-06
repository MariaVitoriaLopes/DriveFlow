import { Component } from '@angular/core';
import { FormLogin } from '../../components/forms/form-login/form-login';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormLogin, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

}