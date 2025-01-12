import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHubComponent } from './order-hub.component';

describe('OrderHubComponent', () => {
  let component: OrderHubComponent;
  let fixture: ComponentFixture<OrderHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
