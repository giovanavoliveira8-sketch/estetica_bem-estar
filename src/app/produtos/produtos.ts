
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [CommonModule],
  selector: 'app-produtos',
  styleUrl: './produtos.css',
  templateUrl: './produtos.html',
})
export class Produtos implements OnInit {

  produtos: any[] = [];
  categoriaSelecionada = 'Todas';

  produtoEncontrado: any = null;
  mensagemBusca = '';
  buscaRealizada = false;
  mostrarBusca = false;
  nomePesquisa = '';

  private url = 'https://localhost:7218/api/ProdutoItem';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.listarProdutos();
  }

  listarProdutos(): void {
    this.http.get<any[]>(this.url).subscribe({
      next: (dados) => {
        this.produtos = dados.filter(produto =>
          produto.iditemNavigation.tipoItem === 'P' &&
          produto.iditemNavigation.ativoProdutoServico === 'S'
        );
      },
      error: (erro) => {
        console.log('Erro ao buscar produtos:', erro);
      }
    });
  }

  filtrarCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
    this.mostrarBusca = true;
    this.limparBusca();
    this.nomePesquisa = '';
  }

  pesquisarNome(nome: string): void {
    this.nomePesquisa = nome;
    this.produtoEncontrado = null;
    this.buscaRealizada = false;
  }

  buscarProduto(id: string): void {
    this.produtoEncontrado = null;
    this.mensagemBusca = '';
    this.buscaRealizada = true;

    if (id.trim() === '') {
      this.mensagemBusca = 'Informe o ID do produto.';
      return;
    }

    this.http.get<any>(this.url + '/id?id=' + id).subscribe({
      next: (dados) => {
        console.log('Produto recebido da API:', dados);

        if (dados && dados.iditemNavigation) {
          this.produtoEncontrado = dados;
        } else {
          this.mensagemBusca = 'Produto não encontrado.';
        }
      },
      error: (erro) => {
        this.mensagemBusca = 'Produto não encontrado.';
        console.log('Erro ao consultar produto:', erro);
      }
    });
  }

  limparBusca(): void {
    this.produtoEncontrado = null;
    this.mensagemBusca = '';
    this.buscaRealizada = false;
    this.nomePesquisa = '';
  }

  get produtosFiltrados(): any[] {
    return this.produtos.filter(produto => {

      const categoriaCorreta =
        this.categoriaSelecionada === 'Todas' ||
        produto.iditemNavigation.idcategoriaNavigation.categoria === this.categoriaSelecionada;

      const nomeCorreto =
        produto.iditemNavigation.item1.toLowerCase().includes(this.nomePesquisa.toLowerCase());

      return categoriaCorreta && nomeCorreto;
    });
  }

  get categorias(): string[] {
    return ['Todas', ...new Set(
      this.produtos.map(produto =>
        produto.iditemNavigation.idcategoriaNavigation.categoria
      )
    )];
  }
}
