import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import IChannels from 'src/app/interfaces/channels';

@Injectable({
  providedIn: 'root',
})
export class ChannelsService {
  constructor(private http: HttpClient) {}

  getChannels(): Observable<IChannels> {
    return this.http.get<IChannels>('assets/channels.json');
  }
}
