import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-job-recomandation',
  templateUrl: './job-recomandation.component.html',
  styleUrls: ['./job-recomandation.component.scss']
})
export class JobRecomandationComponent {
  alumni: any[] = []; // Initialized as an empty array, so it won't be undefined
  errorMessage: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 1;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAlumniRecommendations();
  }

  loadAlumniRecommendations() {
    this.http.get<any[]>('http://localhost:5000/alumni/recommendations').subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.alumni = data; // Ensures alumni is always an array
          if (data.length === 0) {
            this.errorMessage = 'Aucun alumni sans emploi trouvé.';
          }
        } else {
          this.errorMessage = 'Les données reçues ne sont pas valides.';
          this.alumni = []; // Reset to empty array
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la récupération des recommandations. Veuillez réessayer.';
        console.error(err);
        this.alumni = []; // Reset to empty array
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.alumni.length / this.itemsPerPage);
  }

  get paginatedAlumni(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.alumni.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}