import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CardTeamComponent } from '../components/card-team/card-team.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements AfterViewInit {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef<HTMLDivElement>;

  cards = [
    { img: 'assets/images/team/go.jpeg', title: 'Go Mycode' },
    { img: 'assets/images/team/alta.jpeg', title: 'Alta_cafe' },
    { img: 'assets/images/team/micro.jpeg', title: 'Microsoft' },
    { img: 'assets/images/team/minis.jpeg', title: 'Ministere de Recherche' },
    { img: 'assets/images/team/mos.jpeg', title: 'Mosaique' },
    { img: 'assets/images/team/biat.jpeg', title: 'Biat' },
  ];

  rectangles = [
    { id: 1, text: 'Mohamed aziz Belhay', image: 'assets/images/team/aziz.jpg', style: {}, link: 'https://www.linkedin.com/in/mohamedaziz-belhay-401343258/' },
    { id: 2, text: 'Farah Ben Henda', image: '../../../../assets/images/team/faraahremza.jpg', style: {}, link: 'https://www.linkedin.com/in/farah-ben-henda-219b18232/?msgControlName=view_message_button&msgConversationId=2-YjdmYTQ3ZmQtMmM0MC00YTY3LThiNWUtMjFmN2Q3ZmNiOWM5XzAxMg%3D%3D&msgOverlay=true/' },
    { id: 3, text: 'Rayen ouji', image: 'assets/images/team/ray.jpg', style: {}, link: 'https://www.linkedin.com/in/ouji-rayen-26244b238/' },
    { id: 4, text: 'Yassmine Bargaoui', image: '../../../../assets/images/team/yassmonallbasslaa.jpeg', style: {}, link: 'https://www.linkedin.com/in/yasmine-bargaoui-787835258?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app/' },
    { id: 5, text: 'Raed Guedidi', image: 'assets/images/team/raed.jpg', style: {}, link: 'https://www.linkedin.com/in/raed-guedidi-72088a280/?fbclid=IwY2xjawKErZNleHRuA2FlbQIxMABicmlkETFDcFdHVTBFWlRSRDlQeGZkAR75expgm1PD0ygql9HgrcSNMcwVvgct5GPbHu4wRpntcNjInjl3bM5GRPEVbA_aem_l97mHMTOeOJ8qbF6QE4v4A/' },
    { id: 6, text: 'Mortadha Mezhoud', image: 'assets/images/team/morta.jpg', style: {}, link: 'https://www.linkedin.com/in/mezhoud-mortadha-6440a0311/' }
  ];

  constructor() {}

  ngAfterViewInit() {
    const carousel = this.carousel.nativeElement;

    // Duplicate content
    carousel.innerHTML += carousel.innerHTML;

    let scrollSpeed = 1;
    let currentScroll = 0;

    const animate = () => {
      currentScroll += scrollSpeed;
      if (currentScroll >= carousel.scrollWidth / 2) {
        currentScroll = 0;
      }
      carousel.style.transform = `translateX(-${currentScroll}px)`;
      requestAnimationFrame(animate);
    };

    animate();

    // Optional pause on hover
    carousel.parentElement?.addEventListener('mouseenter', () => (scrollSpeed = 0));
    carousel.parentElement?.addEventListener('mouseleave', () => (scrollSpeed = 1));
  }

  openLinkedIn(rect: any): void {
    window.open(rect.link, '_blank');
  }
}