import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// gente eu só colei esse código, pode apagar -> Bia

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private apiUrl = 'http://localhost:8081/api/alunos';

  constructor(private http: HttpClient) {}

  async buscarAlunoPorUsuarioId(usuarioId: string): Promise<any> {

    try {

      const response = await firstValueFrom(
        this.http.get(`${this.apiUrl}/${usuarioId}`)
      );

      return response;

    } catch (error: any) {

      console.error('Erro ao buscar aluno:', error);

      throw error?.error || {
        mensagem: 'Erro ao buscar aluno'
      };
    }
  }
}
