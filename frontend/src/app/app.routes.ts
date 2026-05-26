import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { VerInstrutores } from './pages/ver-instrutores/ver-instrutores';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';

import { AppComponent } from './app.component';

import { Agenda } from './pages/instrutor/agenda/agenda';
import { Alunos } from './pages/instrutor/alunos/alunos';
import { Aulas } from './pages/instrutor/aulas/aulas';
import { Configuracoes } from './pages/instrutor/configuracoes/configuracoes';
import { Dashboard } from './pages/instrutor/dashboard/dashboard';
import { Notificacoes } from './pages/instrutor/notificacoes/notificacoes';
import { NovoDocumento } from './components/forms/novo-documento/novo-documento';
import { CadastroAgenda } from './components/forms/cadastro-agenda/cadastro-agenda';

import path from 'path';

import { HomeAluno } from './pages/aluno/home-aluno/home-aluno';
import { PerfilInstrutor } from './pages/aluno/perfil-instrutor/perfil-instrutor';
import { ConfiguracoesA } from './pages/aluno/configuracoes/configuracoes';
import { AgendarAula } from './pages/aluno/agendar-aula/agendar-aula';
import { AgendaAluno } from './pages/aluno/agenda-aluno/agenda-aluno';

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
  { path: 'instrutor/add-novo-documento', component: NovoDocumento},
  { path: 'instrutor/cadastro-agenda', component: CadastroAgenda},

  { path: 'aluno/home-aluno', component: HomeAluno },
  { path: 'aluno/perfil-instrutor', component: PerfilInstrutor },
  { path: 'aluno/agendamento', component: AgendarAula },
  { path: 'aluno/configuracoes', component: ConfiguracoesA} ,
  {path: 'aluno/agenda', component: AgendaAluno},

  // Rota de teste para o backend
  { path: 'testebackend', component:  AppComponent},
];