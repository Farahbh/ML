import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent  implements OnInit{

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Wait for the fragment to be available after navigation
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        // Scroll to the element with the ID of the fragment
        const element = document.getElementById(fragment);
        if (element) {
          // Use scrollIntoView for smooth scrolling
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}