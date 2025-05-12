import { HttpClient } from '@angular/common/http';
import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImageUpdateService } from 'src/app/services/image-update.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;

  constructor(public dialog: MatDialog,
    private router: Router,private http:HttpClient,
    private userService: UserService,private imageUpdateService: ImageUpdateService

  ) {}
  userImage:any


  userImageUrl: string = ''; // Store the complete image URL here
  id: any;
  file: File | undefined;
  decodeId:any

  ngOnInit(): void {
    // Retrieve the initial user id from localStorage
    this.id = localStorage.getItem('id') || '';

    // If id is not present or empty, exit the function
    if (!this.id) {
      console.error('No user id found in localStorage');
      return;
    }

    // Get the user by id
    this.getUserImage();

    // Watch for changes in localStorage and update user image accordingly
    window.addEventListener('storage', (event) => {
      if (event.key === 'id') {
        this.id = event.newValue;
        this.getUserImage();
      }
    });
    this.imageUpdateService.currentUserImage.subscribe(imageUrl => {
      this.userImageUrl = imageUrl;
    });
  }

  onSubmit() {
    this.router.navigate(['ui-components/profil']);
  }

  private getUserImage(): void {
    // Decode the id string
    if(this.id.length > 24){
      this.decodeId = JSON.parse(this.id);
   }else{
     this.decodeId = this.id
   }
    // Get the user by decoded id
    this.userService.getUserById(this.decodeId).subscribe(
      (response: any) => {
        if (response && response.image) {
          // Update the complete image URL
          this.userImageUrl = `http://localhost:8081/api/images/${response.image}`;
        } else {
          console.error('Error: Invalid response format - no image data found');
        }
      },
      (error: any) => {
        console.error('Error:', error.error); // Access the error message from the error object
      }
    );
  }




 }
