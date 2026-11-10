import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenciarClientes } from './gerenciar-clientes';

describe('GerenciarClientes', () => {
  let component: GerenciarClientes;
  let fixture: ComponentFixture<GerenciarClientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarClientes],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarClientes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
