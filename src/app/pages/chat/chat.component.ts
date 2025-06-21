import { Component, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Ichat } from '../../interface/chat-response';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {

  private chat_service = inject(ChatService);
  private auth = inject(AuthService);
  chatForm!: FormGroup;
  private fb = inject(FormBuilder);
  chats = signal<Ichat[]>([]);
  private router = inject(Router);

  constructor() {
    effect(() => {
      this.onListChat();
    });
  }

  ngOnInit() {
    this.chatForm = this.fb.group({
      chat_message: ['', Validators.required],
    });
  }

  onSubmit() {
    const formValue = this.chatForm.value.chat_message;
    this.chat_service
      .chatMessage(formValue)
      .then((res) => {
        this.chatForm.reset();
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  onListChat() {
    this.chat_service
      .listChat()
      .then((res: Ichat[] | null) => {
        console.log(res);
        if (res !== null) {
          this.chats.set(res);
        } else {
          console.log('No messages Found');
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  openDropDown(msg: Ichat) {
    console.log(msg);
    this.chat_service.selectedChats(msg);
  }

  async logOut() {
    this.auth
      .signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((err) => {
        alert(err.message);
      });
  }
}
