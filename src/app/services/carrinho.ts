
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Carrinho {

  itens: any[] = [];

  adicionarItem(item: any): void {

    const itemExistente = this.itens.find(produto =>
      produto.id === item.id && produto.tipo === item.tipo
    );

    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      this.itens.push({
        ...item,
        quantidade: 1
      });
    }

  }

  aumentarQuantidade(item: any): void {
    item.quantidade++;
  }

  diminuirQuantidade(item: any): void {
    if (item.quantidade > 1) {
      item.quantidade--;
    }
  }

  removerItem(item: any): void {
    this.itens = this.itens.filter(produto => produto !== item);
  }

}
