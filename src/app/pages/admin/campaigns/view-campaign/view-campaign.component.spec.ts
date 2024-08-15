import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ViewCampaignComponent } from './view-campaign.component';
import { Campaign } from '../../../../core/models/campaign.model';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog'; 

describe('ViewCampaignComponent', () => {
  let component: ViewCampaignComponent;
  let fixture: ComponentFixture<ViewCampaignComponent>;
  let userService: UserService;
  let matDialog: MatDialog;

  const mockCampaign: Campaign = { id: 1, name: 'Test campaign', isActive: true };

  beforeEach(async () => {
    const userServiceMock = new MockUserService();
    const matDialogMock = {};

    await TestBed.configureTestingModule({
      declarations: [ViewCampaignComponent],
      imports: [HttpClientTestingModule, RouterTestingModule], 
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: MatDialog, useValue: matDialogMock }, 
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  
    fixture = TestBed.createComponent(ViewCampaignComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    matDialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 
});

class MockUserService {
  getUsers = jest.fn(() => of([]));
}
