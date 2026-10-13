import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SigRC } from './sig-rc';

describe('SigRC', () => {
  let component: SigRC;
  let fixture: ComponentFixture<SigRC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigRC],
    }).compileComponents();

    fixture = TestBed.createComponent(SigRC);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
