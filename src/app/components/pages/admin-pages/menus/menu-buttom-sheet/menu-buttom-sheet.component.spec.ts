import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuButtomSheetComponent } from './menu-buttom-sheet.component';

describe('MenuButtomSheetComponent', () => {
  let component: MenuButtomSheetComponent;
  let fixture: ComponentFixture<MenuButtomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuButtomSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuButtomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
