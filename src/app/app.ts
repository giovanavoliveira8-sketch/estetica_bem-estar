import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Carrinho } from './services/carrinho';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(public carrinho: Carrinho) { }

  get quantidadeItens(): number {

    let quantidade = 0;

    for (let item of this.carrinho.itens) {
      quantidade += item.quantidade;
    }

    return quantidade;
  }

}
