import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelAdminCursosPage } from './panel-admin-cursos.page';

describe('PanelAdminCursosPage', () => {
  let component: PanelAdminCursosPage;
  let fixture: ComponentFixture<PanelAdminCursosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAdminCursosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
