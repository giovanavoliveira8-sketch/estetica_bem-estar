
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Carrinho as CarrinhoService } from '../services/carrinho';

@Component({
  imports: [CommonModule],
  selector: 'app-carrinho',
  styleUrl: './carrinho.css',
  templateUrl: './carrinho.html',
})
export class Carrinho implements OnInit {

  formaPagamento = '';
  pessoaSelecionada = '';
  pessoas: any[] = [];
  mensagem = '';

  private urlPedido = 'https://localhost:7218/api/Pedido';
  private urlPessoas = 'https://localhost:7218/api/PessoaEndereco';

  constructor(
    public carrinho: CarrinhoService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listarPessoas();
  }

  listarPessoas(): void {
    this.http.get<any[]>(this.urlPessoas).subscribe({
      next: (dados) => {
        this.pessoas = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao buscar clientes:', erro);
        this.mensagem = 'Não foi possível carregar os clientes.';
        this.cdr.detectChanges();
      }
    });
  }

  get subtotal(): number {
    let total = 0;

    for (let item of this.carrinho.itens) {
      total += Number(item.preco) * item.quantidade;
    }

    return total;
  }

  get frete(): number {
    const possuiProduto = this.carrinho.itens.some(item =>
      item.tipo === 'P'
    );

    return possuiProduto ? 10 : 0;
  }

  get total(): number {
    return this.subtotal + this.frete;
  }

  finalizarCompra(): void {

    this.mensagem = '';

    if (this.pessoaSelecionada === '') {
      this.mensagem = 'Selecione o cliente.';
      return;
    }

    if (this.formaPagamento === '') {
      this.mensagem = 'Selecione a forma de pagamento.';
      return;
    }

    if (this.carrinho.itens.length === 0) {
      return;
    }

    const possuiIdItem = this.carrinho.itens.every(item =>
      item.iditem !== undefined && item.iditem !== null
    );

    if (!possuiIdItem) {
      this.mensagem = 'Um ou mais itens não possuem identificação válida.';
      return;
    }

    const pedido = {
      idpessoa: Number(this.pessoaSelecionada),
      formaPagamento: this.formaPagamento,
      subtotal: this.subtotal,
      frete: this.frete,
      total: this.total,
      itens: this.carrinho.itens.map(item => ({
        iditem: Number(item.iditem),
        quantidade: item.quantidade,
        valorUnitario: Number(item.preco)
      }))
    };

    this.http.post<any>(this.urlPedido, pedido).subscribe({
      next: (resposta) => {
        console.log('Pedido registrado:', resposta);

        this.carrinho.itens = [];
        this.formaPagamento = '';
        this.pessoaSelecionada = '';
        this.mensagem = 'Compra registrada com sucesso!';

        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao registrar pedido:', erro);
        this.mensagem = 'Não foi possível registrar a compra. Confira os dados e tente novamente.';

        this.cdr.detectChanges();
      }
    });
  }

}
