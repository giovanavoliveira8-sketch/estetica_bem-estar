import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenciarEstoque } from './gerenciar-estoque';

describe('GerenciarEstoque', () => {
  let component: GerenciarEstoque;
  let fixture: ComponentFixture<GerenciarEstoque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarEstoque],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarEstoque);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
