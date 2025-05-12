import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Role, User } from '../User';
import { ImageUpdateService } from 'src/app/services/image-update.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {
  userImageUrl: string = ''; // Store the complete image URL here
  id: any;
  file: File | undefined;
  user:User;
  decodeId:any
  roleNames:any
  constructor(
    private http: HttpClient,
    private userService: UserService,private imageUpdateService: ImageUpdateService
  ) {}

  ngOnInit(): void {
    // Retrieve the id from localStorage
    this.id = localStorage.getItem('id') || '';

    // If id is not present or empty, exit the function
    if (!this.id) {
      console.error('No user id found in localStorage');
      return;
    }
    if(this.id.length > 24){
       this.decodeId = JSON.parse(this.id);
    }else{
      this.decodeId = this.id
    }

    // Get the user by id
    this.userService.getUserById(this.decodeId).subscribe(
      (response: any) => {
        this.user = response;
        console.log(response);

        this.roleNames = Role[this.user.roles[0]];
        console.warn(this.roleNames)

        // Update the complete image URL
        this.userImageUrl = `http://localhost:8081/api/images/${response.image}`;
      },
      (error: any) => {
        console.error('Error:', error.error); // Access the error message from the error object
      }
    );
  }


  onChangeimg(event: any) {
    this.file = event.target.files[0];
    if (this.id && this.file) {
      if (this.id.length > 24) {
        this.decodeId = JSON.parse(this.id);
      } else {
        this.decodeId = this.id;
      }
      this.userService.changeImg(this.decodeId, this.file.name).subscribe(
        (response: any) => {
          // Update the userImageUrl immediately after changing the image
          this.userImageUrl = `http://localhost:8081/api/images/${response.image}`;

          // Notify the ImageUpdateService about the change after updating the userImageUrl
          this.imageUpdateService.changeUserImage(this.userImageUrl);

          console.log('Image changed !!!');
          this.userService.getByml(response.email).subscribe(
            (rsp: any) => {
              this.userImageUrl = `http://localhost:8081/api/images/${rsp.image}`; // Update the complete image URL
              localStorage.removeItem('id');
              localStorage.setItem('id', rsp.id);
              this.id = rsp.id;
            }
          )
          this.id = response.id;
          // Update the complete image URL without reloading the component
        },
        (error: any) => {
          console.error('Error:', error.error); // Access the error message from the error object
        }
      );
      this.uploadFile();
    }
  }


  uploadFile() {
    if (this.file) {
      const uploadData = new FormData();
      uploadData.append('file', this.file, this.file.name);

      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundary');

      this.http.post('http://localhost:8081/api/upload', uploadData, { headers: headers }).subscribe(
        response => {
          console.log('File uploaded successfully');
        },
        error => {
          console.log('File upload failed:', error);
        }
      );
    }
  }
}
