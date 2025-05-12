import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classifier',
  templateUrl: './classifier.component.html',
  styleUrls: ['./classifier.component.scss']
})
export class ClassifierComponent implements OnInit {
  // Form data matching API inputs
  formData = {
    performance: null as number | null,
    bac: '',
    sexe: '',
    adresse: '',
    postule: '',
    seuil: null as number | null
  };

  // Store addresses from API GET request
  adresses: string[] = [];

  // Track hover state for form fields
  hoveredField: { [key: string]: boolean } = {
    performance: false,
    bac: false,
    sexe: false,
    adresse: false,
    postule: false,
    seuil: false
  };

  // Popup state for displaying prediction or errors
  showPopup = false;
  popupMessage: string | null = null;
  isError = false;

  // API endpoint
  private apiUrl = 'http://localhost:5000/classifier';

  constructor(private http: HttpClient) {}

  // Fetch addresses on component initialization
  ngOnInit() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        this.adresses = response.adresses || [];
      },
      error: (err: HttpErrorResponse) => {
        this.showPopupMessage(`Erreur lors du chargement des adresses : ${err.message}`, true);
      }
    });
  }

  // Handle hover events for form fields
  onHoverField(field: string, hovered: boolean) {
    this.hoveredField[field] = hovered;
  }

  // Handle form submission and API call
  predict() {
    // Validate form fields
    if (!this.formData.performance || this.formData.performance < 0 || this.formData.performance > 100) {
      this.showPopupMessage('Veuillez entrer une performance valide (entre 0 et 100).', true);
      return;
    }
    if (!this.formData.bac) {
      this.showPopupMessage('Veuillez sélectionner une nature de bac.', true);
      return;
    }
    if (!this.formData.sexe) {
      this.showPopupMessage('Veuillez sélectionner un sexe.', true);
      return;
    }
    if (!this.formData.adresse) {
      this.showPopupMessage('Veuillez sélectionner une adresse.', true);
      return;
    }
    if (!this.formData.postule) {
      this.showPopupMessage('Veuillez sélectionner une option pour postule.', true);
      return;
    }
    if (this.formData.seuil === null || this.formData.seuil < 0 || this.formData.seuil > 1) {
      this.showPopupMessage('Veuillez entrer un seuil valide (entre 0 et 1).', true);
      return;
    }

    // Prepare payload for API
    const payload = {
      performance: this.formData.performance,
      bac: this.formData.bac,
      sexe: this.formData.sexe,
      adresse: this.formData.adresse,
      postule: this.formData.postule,
      seuil: this.formData.seuil
    };

    // Send POST request to API
    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: (response) => {
        if (response.prediction) {
          this.showPopupMessage(`Résultat de l'employabilité : ${response.prediction}`, false);
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
  }
}