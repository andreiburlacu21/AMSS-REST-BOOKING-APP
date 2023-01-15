import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusDialogComponent } from './menus-dialog.component';

describe('MenusDialogComponent', () => {
  let component: MenusDialogComponent;
  let fixture: ComponentFixture<MenusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenusDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
