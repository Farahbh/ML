import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-team',
  templateUrl: './card-team.component.html',
  styleUrls: ['./card-team.component.scss']
})
export class CardTeamComponent implements OnInit {
  rectangles = [
    { id: 1, text: 'Rectangle 1', image: '../../../../../assets/images/team/raed.jpg', style: {} },
    { id: 2, text: 'Rectangle 2', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', style: {} },
    { id: 3, text: 'Rectangle 3', image: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c', style: {} },
    { id: 4, text: 'Rectangle 4', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', style: {} },
    { id: 5, text: 'Rectangle 5', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3', style: {} },
    { id: 6, text: 'Rectangle 6', image: 'https://images.unsplash.com/photo-148-1507148375956-4b323c3ed203', style: {} }
  ];

  constructor() {}

  ngOnInit(): void {}

  onHover(rect: any): void {
    rect.style = { transform: 'scale(1.05)', backgroundColor: '#007bff' };
  }

  onHoverOut(rect: any): void {
    rect.style = { transform: 'scale(1)', backgroundColor: '#f0f0f0' };
  }
}