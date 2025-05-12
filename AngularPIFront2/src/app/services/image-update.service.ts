import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUpdateService {

  private userImageSource = new BehaviorSubject<string>('');
  currentUserImage = this.userImageSource.asObservable();

  constructor() {}

  changeUserImage(imageUrl: string) {
    this.userImageSource.next(imageUrl);
  }
}
