import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { AppComponent } from './app.component';
import { Agenda } from './pages/instrutor/agenda/agenda';
import { Alunos } from './pages/instrutor/alunos/alunos';
import { Aulas } from './pages/instrutor/aulas/aulas';
import { Configuracoes } from './pages/instrutor/configuracoes/configuracoes';
import { Dashboard } from './pages/instrutor/dashboard/dashboard';
import { Notificacoes } from './pages/instrutor/notificacoes/notificacoes';
import path from 'path';
import { VerInstrutores } from './pages/ver-instrutores/ver-instrutores';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'ver-instrutores', component: VerInstrutores },
  
  { path: 'instrutor/agenda', component: Agenda },
  { path: 'instrutor/alunos', component: Alunos },
  { path: 'instrutor/aulas', component: Aulas },
  { path: 'instrutor/configuracoes', component: Configuracoes} ,
  { path: 'instrutor/dashboard', component: Dashboard},
  { path: 'instrutor/notificacoes', component: Notificacoes },

  // Rota de teste para o backend
  { path: 'testebackend', component:  AppComponent},
];