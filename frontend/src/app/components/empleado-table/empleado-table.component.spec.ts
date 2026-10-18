import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoTableComponent } from './empleado-table.component';

describe('EmpleadoTableComponent', () => {
  let component: EmpleadoTableComponent;
  let fixture: ComponentFixture<EmpleadoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpleadoTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpleadoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
