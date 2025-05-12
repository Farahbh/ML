import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewChecked {
  messages: { sender: 'User' | 'Bot'; content: string; timestamp: Date }[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(private chatService: ChatService) {}

  ngAfterViewChecked() {
    this.scrollToBottom(); // Défilement automatique
  }

  sendMessage() {
    if (!this.newMessage.trim() || this.isTyping) return;

    // Ajouter le message utilisateur
    this.messages.push({
      sender: 'User',
      content: this.newMessage,
      timestamp: new Date()
    });

    this.isTyping = true;
    const messageToSend = this.newMessage;
    this.newMessage = ''; // Réinitialiser l'input

    // Envoyer le message à l'API
    this.chatService.sendMessage(messageToSend).subscribe({
      next: (response) => {
        this.messages.push({
          sender: 'Bot',
          content: response.response,
          timestamp: new Date()
        });
        this.isTyping = false;
      },
      error: (error) => {
        this.messages.push({
          sender: 'Bot',
          content: 'Erreur : ' + error.message,
          timestamp: new Date()
        });
        this.isTyping = false;
      }
    });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }
}