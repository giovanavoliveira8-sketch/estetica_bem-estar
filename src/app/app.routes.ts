
import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Servicos } from './servicos/servicos';
import { Produtos } from './produtos/produtos';
import { Sobre } from './sobre/sobre';
import { Contato } from './contato/contato';
import { Pessoas } from './pessoas/pessoas';
import { Funcionarios } from './funcionarios/funcionarios';
import { Carrinho } from './carrinho/carrinho';
import { Pedidos } from './pedidos/pedidos';
import { Administrador } from './administrador/administrador';
import { GerenciarClientes } from './gerenciar-clientes/gerenciar-clientes';
import { GerenciarProdutos } from './gerenciar-produtos/gerenciar-produtos';
import { GerenciarServicos } from './gerenciar-servicos/gerenciar-servicos';
import { GerenciarCategorias } from './gerenciar-categorias/gerenciar-categorias';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'servicos', component: Servicos },
  { path: 'produtos', component: Produtos },
  { path: 'sobre', component: Sobre },
  { path: 'contato', component: Contato },
  { path: 'pessoas', component: Pessoas },
  { path: 'funcionarios', component: Funcionarios },
  { path: 'carrinho', component: Carrinho },
  { path: 'pedidos', component: Pedidos },
  { path: 'administrador', component: Administrador },
  { path: 'administrador/clientes', component: GerenciarClientes },
  { path: 'administrador/produtos', component: GerenciarProdutos },
  { path: 'administrador/servicos', component: GerenciarServicos },
  { path: 'administrador/categorias', component: GerenciarCategorias }
];
