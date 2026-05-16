import { Component } from '@angular/core';
import { FormLogin } from '../../components/forms/form-login/form-login';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormLogin,
    RouterLink,
    Header,
    Footer,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

}
