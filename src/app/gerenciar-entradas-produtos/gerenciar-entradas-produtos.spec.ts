import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenciarEntradasProdutos } from './gerenciar-entradas-produtos';

describe('GerenciarEntradasProdutos', () => {
  let component: GerenciarEntradasProdutos;
  let fixture: ComponentFixture<GerenciarEntradasProdutos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarEntradasProdutos],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarEntradasProdutos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
