
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-pedidos',
  styleUrl: './pedidos.css',
  templateUrl: './pedidos.html',
})
export class Pedidos implements OnInit {

  pedidos: any[] = [];
  pedidoSelecionado: any = null;

  mensagem = '';
  carregando = true;

  statusFiltro = '';
  novoStatus = '';

  private url = 'https://localhost:7218/api/Atendimento';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listarPedidos();
  }

  listarPedidos(): void {

    this.carregando = true;
    this.mensagem = '';

    let endereco = this.url;

    if (this.statusFiltro != '') {
      endereco = this.url + '?status=' + this.statusFiltro;
    }

    this.http.get<any[]>(endereco).subscribe({
      next: (dados) => {

        this.pedidos = dados;
        this.carregando = false;

        this.cdr.detectChanges();
      },
      error: (erro) => {

        console.log('Erro ao buscar pedidos:', erro);

        this.mensagem = 'Não foi possível carregar os pedidos.';
        this.carregando = false;

        this.cdr.detectChanges();
      }
    });
  }

  filtrarPedidos(status: string): void {

    this.statusFiltro = status;
    this.pedidoSelecionado = null;

    this.listarPedidos();
  }

  verDetalhes(id: number): void {

    this.mensagem = '';

    this.http.get<any>(this.url + '/' + id).subscribe({
      next: (dados) => {

        this.pedidoSelecionado = dados;
        this.novoStatus = dados.statusAtendimento;

        this.cdr.detectChanges();
      },
      error: (erro) => {

        console.log('Erro ao consultar pedido:', erro);

        this.mensagem = 'Não foi possível consultar os detalhes do pedido.';

        this.cdr.detectChanges();
      }
    });
  }

  atualizarStatus(): void {

    if (this.novoStatus == '') {
      this.mensagem = 'Selecione uma situação.';
      return;
    }

    let endereco = this.url + '/' + this.pedidoSelecionado.idatendimento + '/status?status=' + encodeURIComponent(this.novoStatus);

    this.http.put(endereco, null, { responseType: 'text' }).subscribe({
      next: (resposta) => {

        this.mensagem = 'Situação do pedido atualizada com sucesso!';

        this.verDetalhes(this.pedidoSelecionado.idatendimento);

        this.cdr.detectChanges();
      },
      error: (erro) => {

        console.log('Erro ao atualizar situação:', erro);

        if (erro.status == 400) {
          this.mensagem = 'Essa mudança de situação não é permitida.';
        } else if (erro.status == 404) {
          this.mensagem = 'Pedido não encontrado.';
        } else {
          this.mensagem = 'Não foi possível atualizar a situação do pedido.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  calcularTotalItem(item: any): number {

    return item.quantidadeItens * item.valorunitarioEntrada;

  }

  calcularTotalPedido(): number {

    let total = 0;

    if (this.pedidoSelecionado && this.pedidoSelecionado.itens) {

      for (let item of this.pedidoSelecionado.itens) {

        total = total + this.calcularTotalItem(item);

      }

    }

    return total;
  }

  voltarLista(): void {

    this.pedidoSelecionado = null;
    this.mensagem = '';

    this.listarPedidos();
  }

}
