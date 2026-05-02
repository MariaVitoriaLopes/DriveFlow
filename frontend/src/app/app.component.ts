import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  respostaDoBack = 'Tentando conectar ao Java...';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Aponta para a porta 8081 que você configurou
    this.http.get('http://localhost:8081/api/status', { responseType: 'text' })
      .subscribe({
        next: (dados) => this.respostaDoBack = dados,
        error: (erro) => this.respostaDoBack = 'Erro ao falar com o Backend!'
      });
  }
}
