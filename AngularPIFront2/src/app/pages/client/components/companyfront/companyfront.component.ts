import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-companyfront',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './companyfront.component.html',
  styleUrls: ['./companyfront.component.scss']
})
export class CompanyfrontComponent {
  formData = {
    moyenBac: null as number | null,
    natureBac: '',
    resultat: ''
  };

  hoveredField: { [key: string]: boolean } = {
    moyenBac: false,
    natureBac: false,
    resultat: false
  };

  showPopup = false;
  popupMessage: string | null = null;
  isError = false;

  private apiUrl = 'http://localhost:5000/predict';

  constructor(private http: HttpClient) {}

  onHoverField(field: string, hovered: boolean) {
    this.hoveredField[field] = hovered;
  }

  predict() {
    // Validation des champs
    if (!this.formData.moyenBac || this.formData.moyenBac <= 0 || this.formData.moyenBac > 20) {
      this.showPopupMessage('Veuillez entrer une moyenne valide (entre 0 et 20).', true);
      return;
    }
    if (!this.formData.natureBac) {
      this.showPopupMessage('Veuillez sélectionner une nature de bac.', true);
      return;
    }
    if (!this.formData.resultat) {
      this.showPopupMessage('Veuillez sélectionner un résultat.', true);
      return;
    }

    // Envoyer la requête à l'API Flask
    const payload = {
      moyen_bac: this.formData.moyenBac,
      nature_bac: this.formData.natureBac,
      resultat: this.formData.resultat
    };

    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: (response) => {
        if (response.score) {
          this.showPopupMessage(`Score prédit : ${response.score}`, false);
        } else if (response.error) {
          this.showPopupMessage(response.error, true);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.showPopupMessage(`Erreur lors de la prédiction : ${err.message}`, true);
      }
    });
  }

  showPopupMessage(message: string, isError: boolean) {
    this.popupMessage = message;
    this.isError = isError;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = null;
    this.isError = false;
  }
}