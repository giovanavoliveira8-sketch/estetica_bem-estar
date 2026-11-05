
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItensService } from '../services/itens';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [CommonModule],
  selector: 'app-servicos',
  styleUrl: './servicos.css',
  templateUrl: './servicos.html',
})
export class Servicos implements OnInit {

  servicos: any[] = [];
  servicoEncontrado: any = null;
  categoriaSelecionada = 'Todas';
  mensagem = '';
  nomePesquisa = '';

  private url = 'https://localhost:7218/api/Item';

  constructor(
    private itensService: ItensService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.listarServicos();
  }

  listarServicos(): void {
    this.itensService.listarItens().subscribe({
      next: (dados) => {
        this.servicos = dados.filter(item =>
          item.tipoItem === 'S' &&
          item.ativoProdutoServico === 'S'
        );
      },
      error: (erro) => {
        console.log('Erro ao buscar serviços:', erro);
        this.mensagem = 'Não foi possível carregar os serviços.';
      }
    });
  }

  buscarServico(id: string): void {
    this.servicoEncontrado = null;
    this.mensagem = '';

    if (id.trim() === '') {
      this.mensagem = 'Informe o ID do serviço.';
      return;
    }

    this.http.get<any>(this.url + '/' + id).subscribe({
      next: (dados) => {
        if (dados.tipoItem === 'S' &&
            dados.ativoProdutoServico === 'S') {
          this.servicoEncontrado = dados;
        } else {
          this.mensagem = 'Serviço não encontrado.';
        }
      },
      error: (erro) => {
        this.mensagem = 'Serviço não encontrado.';
        console.log('Erro ao consultar serviço:', erro);
      }
    });
  }

  limparBusca(): void {
    this.servicoEncontrado = null;
    this.mensagem = '';
    this.nomePesquisa = '';
  }

  pesquisarNome(nome: string): void {
    this.nomePesquisa = nome;
    this.servicoEncontrado = null;
  }

  filtrarCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
  }

  get servicosFiltrados(): any[] {
    return this.servicos.filter(item => {

      const categoriaCorreta =
        this.categoriaSelecionada === 'Todas' ||
        item.idcategoriaNavigation?.categoria === this.categoriaSelecionada;

      const nomeCorreto =
        item.item1.toLowerCase().includes(this.nomePesquisa.toLowerCase());

      return categoriaCorreta && nomeCorreto;
    });
  }

  get categorias(): string[] {
    return [
      'Todas',
      ...new Set(
        this.servicos.map(item => item.idcategoriaNavigation?.categoria)
          .filter(categoria => categoria)
      )
    ];
  }
}
