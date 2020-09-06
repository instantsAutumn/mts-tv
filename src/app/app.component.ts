import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import IGenre from './interfaces/genre';
import { IGenresMapValue } from './interfaces/genres-map';
import { ChannelsStoreService } from './services/channels-store/channels-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'mts-tv';
  genres: Array<IGenresMapValue>;
  channelsSubscription: Subscription;

  constructor(private channelsStoreService: ChannelsStoreService) {
    this.channelsSubscription = this.channelsStoreService.subjectGenres.subscribe(
      (genres) => {
        this.genres = Object.values(genres);
      }
    );
  }

  onGenreChange(value): void {
    this.channelsStoreService.subjectGenreFilter.next(value);
  }

  onSortChange(value): void {
    this.channelsStoreService.subjectSortFilter.next(value);
  }
}
