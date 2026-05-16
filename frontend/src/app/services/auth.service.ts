import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginRequest {
  email: string;
  senha: string;
}

interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  login(dados: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, dados);
  }

  cadastrar(dados: CadastroRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/cadastro`, dados);
  }

}