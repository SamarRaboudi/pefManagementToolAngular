import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService, UserFilters } from '../../../../../app/core/services/user.service';
import { User } from '../../../../../app/core/models/user.model';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
  userForm: FormGroup;
  user: User;
  userId: number;


  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = +params['id']; // Convert to number
      this.fetchUserData();
    });
    this.initializeForm();
  }

  fetchUserData(): void {
    const filters: UserFilters = { id: this.userId };
    this.userService.getUsers(1, 1, filters).subscribe(
      (users: User[]) => {
        if (users && users.length > 0) {
          this.user = users[0];
        } else {
          console.error('User with ID', this.userId, 'not found.');
          // Handle error (e.g., show error message to user)
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
        // Handle error (e.g., show error message to user)
      }
    );
  }

  initializeForm(): void {
    this.userForm = new FormGroup({
      prenom: new FormControl(''),
      nom: new FormControl(''),
      email: new FormControl(''),
    });
  }




  updateUser(): void {
    if (!this.user || !this.user.id) {
      console.error('Cannot delete user: Invalid user or ID is missing.');
      return;
    }
        const user: User = {
          prenom: this.user.prenom,
          nom: this.user.nom,
          email: this.user.email,
          isActive: true
        };
        this.userId = this.user.id;
        this.userService.updateUser(this.userId, user).subscribe(
          (updatedUser: User) => {
           // this.userService.userAdded.emit(updatedUser);
          },
          (error) => {
            console.error('Failed to delete user:', error);
          }
        );
  }
  

  sendEmail(): void {
    if (this.user && this.user.email) {
      window.location.href = `mailto:${this.user.email}`;
    } else {
      console.error('User email is not defined.');
      // Handle error (e.g., show error message to user)
    }
  }

}
