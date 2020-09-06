import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import IChannel from '../../interfaces/channel';
import { IGenresMap, IGenresMapValue } from '../../interfaces/genres-map';
import { ChannelsService } from '../channels/channels.service';

const DEFAULT_PER_PAGE = 24;

@Injectable({
  providedIn: 'root',
})
export class ChannelsStoreService {
  private count = new BehaviorSubject<number>(DEFAULT_PER_PAGE);
  private sort = new BehaviorSubject('none');
  private genre = new BehaviorSubject('all');
  private total = new BehaviorSubject<string>('0');
  private genres = new BehaviorSubject<IGenresMap>({});
  private channels = new BehaviorSubject({});

  constructor(private channelService: ChannelsService) {}

  getGenres(): Observable<IGenresMapValue[]> {
    return this.genres.asObservable().pipe(map(Object.values));
  }

  getTotal(): Observable<string> {
    return this.total.asObservable();
  }

  setGenre(genre: string): void {
    this.genre.next(genre);
    this.count.next(DEFAULT_PER_PAGE);
  }

  setSort(sort: string): void {
    this.sort.next(sort);
  }

  getChannels(): Observable<IChannel[]> {
    return combineLatest([
      this.count,
      this.sort,
      this.genre,
      this.genres,
      this.channels,
    ]).pipe(
      switchMap(([count, sort, genre, genresMap, channelsMap]) => {
        let source;
        if (genresMap[genre]) {
          source = genresMap[genre].channels.map((name) => channelsMap[name]);
        } else {
          source = [];
        }
        return of(source).pipe(
          map((channels) => {
            if (sort === 'none') {
              return channels;
            } else {
              const direction = sort === 'asc' ? 1 : -1;
              return [...channels].sort((a, b) =>
                a.name > b.name ? direction : a.name < b.name ? -direction : 0
              );
            }
          }),
          map((channels) => channels.slice(0, count))
        );
      })
    );
  }

  loadChannels(): void {
    this.channelService
      .getChannels()
      .pipe(
        map(({ total, channelDetails }) => {
          const genres = {
            all: {
              genreID: 'all',
              genreName: 'Все жанры',
              channels: [],
            },
          };
          const channels = {};

          for (const channel of channelDetails) {
            channels[channel.name] = channel;
            genres.all.channels.push(channel.name);
            if (Array.isArray(channel.genres)) {
              for (const channelGenre of channel.genres) {
                if (genres[channelGenre.genreID]) {
                  genres[channelGenre.genreID].channels.push(channel.name);
                } else {
                  genres[channelGenre.genreID] = {
                    ...channelGenre,
                    channels: [channel.name],
                  };
                }
              }
            }
          }

          this.total.next(total);
          this.genres.next(genres);
          this.channels.next(channels);
        })
      )
      .subscribe(() => {});
  }

  loadMore(): void {
    this.count.next(this.count.value + 12);
  }

  isMore(): Observable<boolean> {
    return combineLatest([this.count, this.genre, this.genres]).pipe(
      map(([count, genre, genres]) =>
        genres[genre] ? genres[genre].channels.length > count : false
      )
    );
  }
}
