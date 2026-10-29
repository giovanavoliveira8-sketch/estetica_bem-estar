
import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Servicos } from './servicos/servicos';
import { Produtos } from './produtos/produtos';
import { Sobre } from './sobre/sobre';
import { Contato } from './contato/contato';
import { Pessoas } from './pessoas/pessoas';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'servicos', component: Servicos },
  { path: 'produtos', component: Produtos },
  { path: 'sobre', component: Sobre },
  { path: 'contato', component: Contato },
  { path: 'pessoas', component: Pessoas }
];
