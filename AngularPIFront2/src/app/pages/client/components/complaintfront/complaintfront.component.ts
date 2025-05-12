import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';  // ➔ très important pour envoyer les données

@Component({
  selector: 'app-complaintfront',
  templateUrl: './complaintfront.component.html',
  styleUrls: ['./complaintfront.component.scss']
})
export class ComplaintfrontComponent {
 formData = {
    scoreFinal: null as number | null,
    moyenneBac: null as number | null
  };

  // Track hover state for form fields
  hoveredField: { [key: string]: boolean } = {
    scoreFinal: false,
    moyenneBac: false
  };

  // Popup state for displaying prediction or errors
  showPopup = false;
  popupMessage: string | null = null;
  isError = false;

  // API endpoint
  private apiUrl = 'http://localhost:5000/admission_predictor';

  constructor(private http: HttpClient) {}

  // Handle hover events for form fields
  onHoverField(field: string, hovered: boolean) {
    this.hoveredField[field] = hovered;
  }

  // Handle form submission and API call
  predict() {
    // Validate form fields
    if (!this.formData.scoreFinal || this.formData.scoreFinal < 0 || this.formData.scoreFinal > 100) {
      this.showPopupMessage('Veuillez entrer un score final valide (entre 0 et 100).', true);
      return;
    }
    if (!this.formData.moyenneBac || this.formData.moyenneBac < 0 || this.formData.moyenneBac > 20) {
      this.showPopupMessage('Veuillez entrer une moyenne bac valide (entre 0 et 20).', true);
      return;
    }

    // Prepare payload for API
    const payload = {
      score_final: this.formData.scoreFinal,
      moyenne_bac: this.formData.moyenneBac
    };

    // Send POST request to API
    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: (response) => {
        if (response.prediction !== undefined) {
          this.showPopupMessage(`Résultat de l'admission : Cluster ${response.prediction}`, false);
        } else if (response.error) {
          this.showPopupMessage(response.error, true);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.showPopupMessage(`Erreur lors de la prédiction : ${err.error?.error || err.message}`, true);
      }
    });
  }

  // Display popup with message
  showPopupMessage(message: string, isError: boolean) {
    this.popupMessage = message;
    this.isError = isError;
    this.showPopup = true;
  }

  // Close popup
  closePopup() {
    this.showPopup = false;
    this.popupMessage = null;
    this.isError = false;
  }}