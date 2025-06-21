import { Injectable, signal } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Ichat } from '../interface/chat-response';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  supabase!: SupabaseClient;
  public savedChat = signal({});


  constructor() {
    this.supabase = createClient(
      import.meta.env["NG_APP_SUPABASE_URL"],
      import.meta.env["NG_APP_SUPABASE_KEY"]
    );
  }

  async chatMessage(text: string) {
    try {
      const { data, error } = await this.supabase.from('chat').insert({ text });

      if (error) {
        alert(error.message); 
      }
    } catch (error) {
      alert(error);
    }
  }
  async listChat() {
    try {
      const { data, error } = await this.supabase
        .from('chat')
        .select('*,users(*)');

      if (error) {
        alert(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteChat(id: string) {
    const data = await this.supabase.from('chat').delete().eq('id', id);
    return data;
  }

  selectedChats(msg: Ichat) {
    this.savedChat.set(msg);
  }
}
