import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IGenresMapValue } from './interfaces/genres-map';
import { ChannelsStoreService } from './services/channels-store/channels-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'mts-tv';
  genres: Array<IGenresMapValue>;
  channelsSubscription: Subscription;
  subscriptions: Subscription[] = [];
  constructor(private channelsStoreService: ChannelsStoreService) {}

  ngOnInit(): void {
    this.channelsStoreService.loadChannels();
    this.subscriptions.push(
      this.channelsStoreService.getGenres().subscribe((genres) => {
        this.genres = genres;
      })
    );
  }

  onGenreChange(value): void {
    this.channelsStoreService.setGenre(value);
  }

  onSortChange(value): void {
    this.channelsStoreService.setSort(value);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
