import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegratedSystems } from './integrated-systems';

describe('IntegratedSystems', () => {
  let component: IntegratedSystems;
  let fixture: ComponentFixture<IntegratedSystems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegratedSystems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegratedSystems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
