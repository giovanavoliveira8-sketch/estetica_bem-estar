import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenciarServicos } from './gerenciar-servicos';

describe('GerenciarServicos', () => {
  let component: GerenciarServicos;
  let fixture: ComponentFixture<GerenciarServicos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarServicos],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarServicos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
