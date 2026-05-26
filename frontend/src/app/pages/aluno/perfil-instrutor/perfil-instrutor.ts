import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderAluno } from '../../../components/layout/header-aluno/header-aluno';
import { CalendarComponent } from '../../../components/layout/calendario/calendario';

@Component({
  selector: 'app-perfil-instrutor',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, HeaderAluno, CalendarComponent],
  templateUrl: './perfil-instrutor.html',
  styleUrls: ['./perfil-instrutor.scss']
})
export class PerfilInstrutor implements OnInit {
  instrutor: any;
  mapaUrlSeguro: SafeResourceUrl | null = null; // Inicialize como null
  mensagemCarregamento = 'Carregando dados do instrutor...';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const isBrowser = typeof window !== 'undefined';
    let instrutorId: string | null = null;

    if (isBrowser) {
      instrutorId = history.state?.instrutorId || localStorage.getItem('instrutorIdSelecionado');
    }

    if (!instrutorId) {
      this.mensagemCarregamento = 'Instrutor não encontrado.';
      return;
    }

    this.carregarPerfilInstrutor(instrutorId);
  }

carregarPerfilInstrutor(instrutorId: string) {
    const url = `http://localhost:8081/api/instrutores/configuracoes/detalhes-aluno/${instrutorId}`;
    
    this.http.get(url).subscribe({
      next: (data: any) => {
        this.instrutor = data;

        // ... seus fallbacks ...

        // CORREÇÃO: Construção segura da URL
        const endereco = this.instrutor.localidade || this.instrutor.bairroCidade;
        if (endereco) {
          // Ajustado: concatenado corretamente o encodeURIComponent
          const urlMapa = `https://www.google.com/maps?q=${encodeURIComponent(endereco)}&output=embed`;
          this.mapaUrlSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(urlMapa);
        }

        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemCarregamento = 'Não foi possível carregar os dados do instrutor.';
      }
    });
  }

agendarAula(): void {
  const id = this.instrutor?.instrutorId || this.instrutor?.id;

  if (!id) {
    console.error('ID do instrutor não encontrado:', this.instrutor);
    return;
  }

  sessionStorage.setItem('instrutorIdSelecionado', id);
  localStorage.setItem('instrutorIdSelecionado', id);

  this.router.navigate(['/aluno/agendamento'], {
    state: { instrutorId: id }
  });
}
}