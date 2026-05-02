import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  // Adicionamos o CommonModule e HttpClientModule para o HTML e o código funcionarem
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  // Agora a variável existe dentro da classe "App" que o HTML usa
  respostaDoBack: string = 'Tentando conectar ao Java...';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Faz a chamada para o seu Backend na porta 8081
    this.http.get('http://localhost:8081/api/status', { responseType: 'text' })
      .subscribe({
        next: (dados) => this.respostaDoBack = dados,
        error: (erro) => {
          console.error(erro);
          this.respostaDoBack = 'Erro ao falar com o Backend!';
        }
      });
  }
}
