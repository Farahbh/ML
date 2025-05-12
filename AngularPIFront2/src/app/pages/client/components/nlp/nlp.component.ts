import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from './environment';

@Component({
  selector: 'app-nlp',
  templateUrl: './nlp.component.html',
  styleUrls: ['./nlp.component.scss']
})
export class NlpComponent {
  selectedFile: File | null = null;
  results: { [formation: string]: string } | null = null;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.error = null;
    this.results = null;
  }

  onSubmit() {
    if (!this.selectedFile) {
      this.error = 'Veuillez sélectionner un fichier CSV.';
      return;
    }

    const formData = new FormData();
    formData.append('csv_file', this.selectedFile);

    this.http
      .post<{ results: { [formation: string]: string } }>(`${environment.apiUrl}/nlp_emotion`, formData)
      .subscribe({
        next: (response) => {
          this.results = response.results;
          this.error = null;
        },
        error: (err) => {
          this.error = err.error?.error || 'Une erreur est survenue lors du traitement du fichier.';
          this.results = null;
        },
      });
  }

  getEmotionClass(emotion: string): string {
    const colors: { [key: string]: string } = {
      joy: 'bg-success text-white',
      gratitude: 'bg-success text-white',
      love: 'bg-success text-white',
      excitement: 'bg-success text-white',
      surprise: 'bg-warning text-dark',
      pride: 'bg-warning text-dark',
      curiosity: 'bg-warning text-dark',
      confusion: 'bg-info text-white',
      realization: 'bg-info text-white',
      fear: 'bg-danger text-white',
      anger: 'bg-danger text-white',
      annoyance: 'bg-danger text-white',
      sadness: 'bg-primary text-white',
      disappointment: 'bg-primary text-white',
      remorse: 'bg-secondary text-white',
      disgust: 'bg-dark text-white',
      neutral: 'bg-light text-dark',
    };
    return colors[emotion.toLowerCase()] || 'bg-secondary text-white';
  }

}
