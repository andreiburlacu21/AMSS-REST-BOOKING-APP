import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantsDialogComponent } from './restaurants-dialog.component';

describe('RestaurantsDialogComponent', () => {
  let component: RestaurantsDialogComponent;
  let fixture: ComponentFixture<RestaurantsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
