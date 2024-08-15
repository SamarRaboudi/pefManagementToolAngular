import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service'; // Update import path for UserService
import { User } from '../../../core/models/user.model';
import { Team } from '../../../../app/core/models/team.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { Session } from '../../../core/models/session.model';
import { CriteriaService } from '../../../core/services/criteria.service';
import { CampaignService } from '../../../core/services/campaign.service';
import { Criteria } from '../../../core/models/criteria.model';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  candidateForm: FormGroup;
  user: User;
  userId: number | undefined;
  candidateObject: any;
  userEmail: string;
  photoLink: any;
  projects: any;
  userDetails: any; 
  teams: Team[] = [];
  profilColors: string[] = ['accent','primary','success', 'warning' ];
  userForm: FormGroup;
  resetPasswordForm: FormGroup;
  hideNP = true;
  hideP = true;
  hideCP = true;
  confirmFocused = false;
  sessions: Session[] = [];
  filteredProjects: any[] = [];
  loading = true;
  evaluationCriteria: Criteria[] = [];
  columnsToDisplay: string[] = [];
  columnsToDisplayWithExpand: string[] = [];
  evaluationHistory: any;
  selectedRemarks: { [key: number]: string } = {};
  expandedRowIndex: number | null = null;
  expandedRowIndices: number[] = [];
  defaultProfilePicture = '../../../assets/images/logos/profile.jpg';
  lastSessionId: number | null = null;
  filteredSessionId: number | null = null;
  filteredEvaluationHistory: any[] = [];
  isUserEvaluator: boolean = false;
  isUserSupervisor: boolean = false;
  providers: [MessageService]

  constructor(private userService: UserService, 
              private snackBar: MatSnackBar,
              private router: Router,
              private criteriaService: CriteriaService,
              private campaignService: CampaignService,
              private sessionService: SessionService,
              private messageService: MessageService,
              private authorizationService: AuthorizationService,) {
      this.isUserEvaluator = this.authorizationService.hasAccess(['Evaluator']);
      this.isUserSupervisor = this.authorizationService.hasAccess(['Supervisor']);
              }

  ngOnInit() {
    this.fetchUserData();
    this.initializeForm();
    this.getSessions();
    this.resetPasswordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, this.passwordValidator()]),
      confirmPassword: new FormControl('', [Validators.required, this.matchPasswordValidator('newPassword')])
    }); 
    this.getEvaluationCriteria();   
   
  }

  getFirstNameErrorMessage(): string {
    return this.userForm.get('firstName')?.hasError('required') ? 'First Name is required.' : '';
  }
  getLastNameErrorMessage(): string {
    return this.userForm.get('lastName')?.hasError('required') ? 'Last Name is required.' : '';
  }


  fetchUserData(): void {
    this.loading = true; // Set loading to true before fetching data
    this.userEmail = localStorage.getItem('loggedInUserEmail') || '';
    this.userService.getUserByEmail(this.userEmail).subscribe(
      (response: any) => {
        if (response) {
          this.projects = response.projects;
          this.userDetails = response.userDetails; 
          this.photoLink = this.userDetails.userPicture;
          this.userId = this.userDetails.userId;
          this.filteredProjects = [...this.projects];
          this.initializeForm();
          if (this.userId){
            this.fetchEvaluationsHistory(this.userId);
          }
        } else {
          console.error('User with email', this.userEmail, 'not found.');
        }
        
      },
      (error) => {
        console.error('Error fetching User data:', error);
      }
    );
  }

  getEvaluationCriteria(): void {
    this.criteriaService.getCriterias(1, 50, {}).subscribe((criterias: Criteria[]) => {
      this.evaluationCriteria = criterias || []; 
      this.columnsToDisplay = ['Candidate', ...this.evaluationCriteria.map(criteria => criteria.name).filter(name => name !== undefined) as string[], 'Final Note'];
      this.columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
    });
  }

  fetchEvaluationsHistory(userId:number): void {
    this.campaignService.getEvaluationsHistory(userId).subscribe(
      (data: any[]) => { 
        this.evaluationHistory= data;
        this.filteredEvaluationHistory = [...this.evaluationHistory];
        this.evaluationHistory.forEach((sessionArray: any[]) => {
          sessionArray.forEach((session: any) => {   
          });
        });
        this.loading = false; 
      },
      error => {
        console.error('Error fetching evaluations history data:', error);
        this.loading = false; 
      }
    );
  }  

  initializeForm(): void {
    this.userForm = new FormGroup({
      firstName: new FormControl(this.userDetails?.userFirstName || '', [Validators.required]),
      lastName: new FormControl(this.userDetails?.userLastName || '', [Validators.required]),
    });
  }

  getCurrentPasswordErrorMessage() {
    const passwordControl = this.resetPasswordForm.get('currentPassword');
    if (passwordControl?.hasError('required')) {
      return 'Current Password is required.';
    }
    return '';
  }
  
  getNewPasswordErrorMessage() {
    const passwordControl = this.resetPasswordForm.get('newPassword');
    if (passwordControl?.hasError('required')) {
      return 'New Password is required.';
    }
    return '';
  }
  
  getConfirmPasswordErrorMessage() {
    const confirmPasswordControl = this.resetPasswordForm.get('confirmPassword');
    if (confirmPasswordControl?.hasError('required')) {
      return 'Confirm Password is required.';
    } else if (confirmPasswordControl?.hasError('passwordMismatch')) {
      return 'Passwords do not match.';
    }
    return '';
  }
  

  passwordValidator(): ValidatorFn { // Return type changed to ValidatorFn
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      if (!value) {
        return null;
      }
      
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasDigit = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const hasMinLength = value.length >= 8;
      
      const isValid = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && hasMinLength;
      
      return isValid ? null : { passwordRequirements: true };
    };
  }

  matchPasswordValidator(matchTo: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.root.get(matchTo);
      return password && control.value !== password.value ? { passwordMismatch: true } : null;
    };
  }

  get currentPassword(): FormControl {
    return this.resetPasswordForm.get('currentPassword') as FormControl;
  }

  get password(): FormControl {
    return this.resetPasswordForm.get('newPassword') as FormControl;
  }
  
  get confirmPassword(): FormControl {
    return this.resetPasswordForm.get('confirmPassword') as FormControl;
  }
    
  togglePasswordVisibility(): void {
    this.hideP = !this.hideP;
  }
  toggleNewPasswordVisibility(): void {
    this.hideNP = !this.hideNP;
  }
  toggleCPasswordVisibility(): void {
    this.hideCP = !this.hideCP;
  }

  onFocusConfirmPassword(): void { 
    this.confirmFocused = true;
  }

  onBlurConfirmPassword(): void {
    this.confirmFocused = false;

}

  getProfileColor(profile: string): string {
    const index = this.userDetails.userProfils.indexOf(profile) % this.profilColors.length;
    return this.profilColors[index];
  }

  getTeamName(project: any): string {
    // Assuming each project has a single team
    return project.teams.length > 0 ? project.teams[0].teamName : 'Unknown Team';
  }

  onFileChanged(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return; // No file selected, do nothing
    }

    if (!this.userForm || !this.userId) {
      console.error('User form is not initialized or invalid user data.');
      return;
    }
  
    // Update user's profile picture
    this.userService.uploadUserPicture(this.userId, file).subscribe(
      (newPictureLink: string) => {
        // Update the photoLink with the new picture link
        this.photoLink = newPictureLink;
        this.fetchUserData();
      },
      (error) => {
        console.error('Failed to update profile picture:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update profile picture!' });

      }
    );
  
    const reader = new FileReader();
    reader.onload = () => {
      this.photoLink = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  
  editUser(): void {
    if (!this.userForm || !this.userId) {
      console.error('User form is not initialized or invalid user data.');
      return;
    }
  
    if (this.userForm.valid) {
      const firstNameControl = this.userForm.get('firstName');
      const lastNameControl = this.userForm.get('lastName');
      if (firstNameControl && lastNameControl) {
        const userUpdated: User = {
          nom: firstNameControl.value,
          prenom: lastNameControl.value,
          email:this.userDetails.userEmail,
          profils: this.userDetails.userProfilIds,
          roles: ['ROLE_USER'],
          isActive: true
        };
      this.userService.updateUser(this.userId, userUpdated).subscribe(
        (updatedUser: User) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile data updated successfully!' });
          this.fetchUserData();
          this.userService.userAdded.emit(updatedUser);
        },
        (error) => {
          console.error('Failed to update user:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Profile data. Please try again!' });
        }
      );
    }
  }
}
updatePassword(): void {
  if (!this.userId) {
    console.error('User ID is undefined.');
    return;
  }

  if (this.resetPasswordForm.valid) {
    const currentPassword = this.resetPasswordForm.get('currentPassword')?.value;
    const newPassword = this.resetPasswordForm.get('newPassword')?.value;

    // Check if current password and new password are the same
    if (currentPassword === newPassword) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Current password and new password cannot be the same!' });
      return; // Exit the method if passwords are the same
    }

    this.userService.updatePassword(this.userId, currentPassword, newPassword).subscribe(
      () => {
        this.router.navigate(['/authentication/login']);
      },
      (error) => {
        // Password update failed, handle error
        console.error('Failed to update password:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update password. Please check your current password!' });
      }
    );
  }
}

getSessions(): void {
  this.sessionService.getSessions(1, 50, {})
    .subscribe((sessions: Session[]) => {
      this.sessions = [{ id: undefined, name: 'All' }, ...sessions];
    });
    
}

filterBySession(sessionId: number): void {
  if (sessionId === undefined) {
    this.filteredProjects = [...this.projects]; 
  } else {
    this.filteredProjects = this.projects.filter((project: any) => {
      return project.teams.some((team: any) => {
        return team.teamSession && team.teamSession.id === sessionId;
      });
    });
  }
}

filterEvaluationHistoryBySession(sessionId: number): void {
  if (sessionId === undefined) {
    this.filteredEvaluationHistory = [...this.evaluationHistory]; 
  } else {
    this.filteredEvaluationHistory = this.evaluationHistory.map((sessionArray: any[]) => {
      const filteredSessions = sessionArray.filter((session: any) => {
        return session.id === sessionId;
      });
      return filteredSessions;
    }).filter((filteredSessionArray: any[]) => {
      return filteredSessionArray.length > 0;
    }); 
  }
}




toggleRemark(candidateId: number, remark: string): void {
  this.selectedRemarks[candidateId] = remark; 
}

getSelectedRemark(candidateId: number): string {
  return this.selectedRemarks[candidateId] || ''; 
}

isCampaignFinished(endDate: string): boolean {
  const today = new Date();
  const campaignEndDate = new Date(endDate);
  return campaignEndDate < today;
}

isCampaignInProgress(startDate: string, endDate: string): boolean {
  const today = new Date();
  const campaignStartDate = new Date(startDate);
  const campaignEndDate = new Date(endDate);
  return campaignStartDate <= today && today <= campaignEndDate;
}

isCampaignNotStartedYet(startDate: string): boolean {
  const today = new Date();
  const campaignStartDate = new Date(startDate);
  return campaignStartDate > today;
}

toggleRowExpansion(index: number): void {
const currentIndex = this.expandedRowIndices.indexOf(index);
if (currentIndex === -1) {
  this.expandedRowIndices.push(index);
} else {
  this.expandedRowIndices.splice(currentIndex, 1);
}
}

isRowExpanded(index: number): boolean {
return this.expandedRowIndices.includes(index);
}
isFirstPanel(index: number): boolean {
return index === 0; 
}
panelOpened(index: number): void {
  // Set the panelOpen property of all panels to false except the currently opened panel
  this.filteredEvaluationHistory.forEach((sessionArray, i) => {
    sessionArray.forEach((session: any) => {
      session.campaigns.forEach((campaign: any) => {
        campaign.teams.forEach((team: any, teamIndex: any) => {
          if (i === index) {
            team.panelOpen = true;
          } else {
            team.panelOpen = false;
          }
        });
      });
    });
  });
}

panelClosed(index: number): void {
  // Set the panelOpen property of the closed panel to false
  this.filteredEvaluationHistory.forEach((sessionArray) => {
    sessionArray.forEach((session: any) => {
      session.campaigns.forEach((campaign: any) => {
        campaign.teams[index].panelOpen = false;
      });
    });
  });
}


}
