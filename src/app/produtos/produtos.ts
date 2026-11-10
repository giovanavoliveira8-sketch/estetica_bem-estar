
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Carrinho } from '../services/carrinho';

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
  mensagemCarrinho = '';
  buscaRealizada = false;
  mostrarBusca = false;
  nomePesquisa = '';
  carregando = true;

  private url = 'https://localhost:7218/api/ProdutoItem';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private carrinho: Carrinho
  ) { }

  ngOnInit(): void {
    this.listarProdutos();
  }

  listarProdutos(): void {
    this.carregando = true;

    this.http.get<any[]>(this.url).subscribe({
      next: (dados) => {
        this.produtos = dados.filter(produto =>
          produto.iditemNavigation &&
          produto.iditemNavigation.tipoItem === 'P' &&
          produto.iditemNavigation.ativoProdutoServico === 'S'
        );

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao buscar produtos:', erro);
        this.mensagemBusca = 'Não foi possível carregar os produtos.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrarCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
    this.mostrarBusca = true;
    this.limparBusca();
  }

  pesquisarNome(nome: string): void {
    this.nomePesquisa = nome;
    this.produtoEncontrado = null;
    this.buscaRealizada = false;
    this.mensagemBusca = '';
  }

  buscarProduto(id: string): void {

    if (id.trim() === '') {
      this.mensagemBusca = 'Informe o ID do produto.';
      this.produtoEncontrado = null;
      this.buscaRealizada = true;
      return;
    }

    this.mensagemBusca = '';
    this.nomePesquisa = '';
    this.produtoEncontrado = null;
    this.buscaRealizada = true;

    this.http.get<any>(this.url + '/id?id=' + id).subscribe({
      next: (dados) => {
        console.log('Produto recebido da API:', dados);

        if (
          dados &&
          dados.iditemNavigation &&
          dados.iditemNavigation.tipoItem === 'P'
        ) {
          this.produtoEncontrado = dados;
        } else {
          this.mensagemBusca = 'Produto não encontrado.';
        }

        this.cdr.detectChanges();
      },
      error: (erro) => {
        this.mensagemBusca = 'Produto não encontrado.';
        console.log('Erro ao consultar produto:', erro);
        this.cdr.detectChanges();
      }
    });
  }

  adicionarAoCarrinho(produto: any): void {

    if (!produto) {
      return;
    }

    this.carrinho.adicionarItem({
      id: produto.idproduto,
      iditem: produto.iditem,
      tipo: 'P',
      nome: produto.iditemNavigation.item1,
      descricao: produto.iditemNavigation.descricaoItem,
      preco: Number(produto.precoVenda)
    });

    console.log('Itens adicionados ao carrinho:', this.carrinho.itens);
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
        produto.iditemNavigation.idcategoriaNavigation?.categoria === this.categoriaSelecionada;

      const nomeCorreto =
        produto.iditemNavigation.item1
          .toLowerCase()
          .includes(this.nomePesquisa.toLowerCase());

      return categoriaCorreta && nomeCorreto;
    });
  }

  get categorias(): string[] {
    return ['Todas', ...new Set(
      this.produtos.map(produto =>
        produto.iditemNavigation.idcategoriaNavigation?.categoria
      ).filter(categoria => categoria)
    )];
  }
}
