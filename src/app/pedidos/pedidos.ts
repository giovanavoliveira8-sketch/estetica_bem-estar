
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [CommonModule],
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

  private url = 'https://localhost:7218/api/Pedido';

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

    this.http.get<any[]>(this.url).subscribe({
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

  get pedidosFiltrados(): any[] {

    if (this.statusFiltro == '') {
      return this.pedidos;
    }

    return this.pedidos.filter(p =>
      p.statusPedido == this.statusFiltro
    );
  }

  filtrarPedidos(status: string): void {

    this.statusFiltro = status;
    this.pedidoSelecionado = null;
  }

  verDetalhes(id: number): void {

    this.mensagem = '';

    this.http.get<any>(this.url + '/' + id).subscribe({
      next: (dados) => {

        this.pedidoSelecionado = dados;

        this.cdr.detectChanges();
      },
      error: (erro) => {

        console.log('Erro ao consultar pedido:', erro);

        this.mensagem = 'Não foi possível consultar os detalhes do pedido.';

        this.cdr.detectChanges();
      }
    });
  }

  calcularTotalItem(item: any): number {

    return item.quantidade * item.valorUnitario;
  }

  voltarLista(): void {

    this.pedidoSelecionado = null;
    this.mensagem = '';

    this.listarPedidos();
  }
}
