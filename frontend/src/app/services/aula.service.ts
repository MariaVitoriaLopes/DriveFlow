// import { inject, Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AulaService {
//   private http = inject(HttpClient);
//   private apiUrl = 'http://localhost:8081/api/aulas';
//
//   // Envia a requisição de agendamento para o Java
//   agendarAula(aulaDados: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/agendar`, aulaDados);
//   }
//
//   // Busca as aulas do Instrutor logado
//   getAulasPorInstrutor(instrutorId: string): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/instrutor/${instrutorId}`);
//   }
//
//   // Busca as aulas do Aluno logado
//   getAulasPorAluno(alunoId: string): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/aluno/${alunoId}`);
//   }
// }
