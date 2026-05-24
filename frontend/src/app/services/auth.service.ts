import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginResponseDTO {
  id: string;
  nome: string;
  perfil: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8081/api/usuarios';

  constructor(private http: HttpClient) {}

  // --------------------
  // LOGIN
  // --------------------
  login(email: string, senha: string): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.apiUrl}/login`, { email, senha })
      .pipe(
        tap(res => {
          // Salva ID, perfil e dados básicos no localStorage
          localStorage.setItem('userId', res.id);
          localStorage.setItem('userPerfil', res.perfil);
          localStorage.setItem('usuario', JSON.stringify(res));
        })
      );
  }

  // --------------------
  // LOGOUT
  // --------------------
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userPerfil');
    localStorage.removeItem('usuario');
  }

  // --------------------
  // PEGAR USUÁRIO BASICO DO LOCALSTORAGE
  // --------------------
  getUsuarioLogado(): LoginResponseDTO | null {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  // --------------------
  // PEGAR DADOS COMPLETOS (ALUNO OU INSTRUTOR) DO BACKEND
  // --------------------
  getUsuarioCompleto(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('usuario')!);
    if (!user) return of(null);

    if (user.perfil === 'INSTRUTOR') {
      // Busca dados completos do instrutor
      return this.http.get(`http://localhost:8081/api/instrutores/configuracoes/${user.id}`);
    } else {
      // Busca dados completos do aluno
      return this.http.get(`http://localhost:8081/api/alunos/${user.id}`);
    }
  }
}