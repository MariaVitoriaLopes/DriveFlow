import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { HeaderAluno } from '../../../components/layout/header-aluno/header-aluno';

@Component({
  selector: 'app-perfil-instrutor',
  standalone: true,
  imports: [CommonModule, HttpClientModule, HeaderAluno],
  templateUrl: './perfil-instrutor.html',
  styleUrls: ['./perfil-instrutor.scss'],
})
export class PerfilInstrutor implements OnInit {
  instrutor: any = null;

  mapaUrlSeguro!: SafeResourceUrl;

  mensagemCarregamento = 'Carregando perfil do instrutor...';

  private apiUrl = 'http://localhost:8081/api/instrutores/configuracoes';

  constructor(
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const instrutorId =
      history.state?.instrutorId ||
      sessionStorage.getItem('instrutorIdSelecionado');

    if (!instrutorId) {
      this.mensagemCarregamento = 'Instrutor não encontrado.';
      this.router.navigate(['/aluno/home']);
      return;
    }

    this.carregarPerfilInstrutor(instrutorId);
  }

  carregarPerfilInstrutor(id: string): void {
    this.http.get<any>(`${this.apiUrl}/${id}`).subscribe({
      next: (res) => {
        const veiculo =
          res.veiculos?.find((v: any) => v.principal === true) ||
          res.veiculos?.[0] ||
          null;

        const local =
          res.locaisAtendimento?.find((l: any) => l.favorito === true) ||
          res.locaisAtendimento?.[0] ||
          null;

        const fotosVeiculo = (veiculo?.fotosUrl || []).filter((foto: string) =>
          this.imagemValida(foto)
        );

        const fotoPrincipal = fotosVeiculo[0] || '/images/carro.png';

        this.instrutor = {
          id: res.id || id,
          nome: res.usuario?.nome || 'Instrutor',
          descricao: res.bio || 'Instrutor disponível para aulas.',
          verificado: true,
          fotoPerfil: this.imagemValida(res.usuario?.foto)
            ? res.usuario.foto
            : '',
          localidade: this.formatarLocal(local),

          veiculo: {
            categoria: veiculo?.categoria || 'Não informado',
            cambio: veiculo?.cambio || 'Não informado',
            marca: veiculo?.marca || 'Não informado',
            versao: veiculo?.modelo || 'Não informado',
            fotoPrincipal,
            fotos: fotosVeiculo,
            recursos: veiculo?.recursos || [],
          },
        };

        this.gerarMapa(this.instrutor.localidade);
      },

      error: (err) => {
        console.error('Erro ao carregar perfil:', err);
        this.mensagemCarregamento = 'Não foi possível carregar o perfil.';
      },
    });
  }

  private imagemValida(url: any): boolean {
    return (
      typeof url === 'string' &&
      url.trim() !== '' &&
      url.trim() !== 'string' &&
      (url.startsWith('http') ||
        url.startsWith('data:image') ||
        url.startsWith('/images/'))
    );
  }

  formatarLocal(local: any): string {
    if (!local) return 'Local não informado';

    const bairro = local.bairro || '';
    const cidade = local.cidade || '';

    if (bairro && cidade) return `${bairro} - ${cidade}`;
    if (bairro) return bairro;
    if (cidade) return cidade;

    return local.logradouro || 'Local não informado';
  }

  gerarMapa(endereco: string): void {
    const enderecoFormatado = encodeURIComponent(endereco || 'Praia Grande, SP');

    const url = `https://www.google.com/maps?q=${enderecoFormatado}&output=embed`;

    this.mapaUrlSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  agendarAula(): void {
    if (!this.instrutor?.id) return;

    sessionStorage.setItem('instrutorIdSelecionado', this.instrutor.id);

    this.router.navigate(['/agendar-aula'], {
      state: {
        instrutorId: this.instrutor.id,
      },
    });
  }
}