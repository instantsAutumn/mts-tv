import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import IChannel from '../../interfaces/channel';
import { IGenresMap } from '../../interfaces/genres-map';
import IGenre from '../../interfaces/genre';
import { ChannelsService } from '../channels/channels.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelsStoreService {
  subjectSortFilter = new BehaviorSubject('default');
  subjectGenreFilter = new BehaviorSubject('all');
  subjectGenres = new BehaviorSubject<IGenresMap>({});
  subjectChannels = new BehaviorSubject({});
  subjectTotal = new BehaviorSubject('0');

  get channels(): Observable<IChannel[]> {
    return combineLatest(
      this.subjectSortFilter,
      this.subjectGenreFilter,
      this.subjectChannels,
      this.subjectGenres
    ).pipe(
      map(([sort, filter, channels, genres]) => {
        if (!genres.hasOwnProperty(filter)) {
          return [];
        }

        let filtredGenres = genres[filter].channels.map(
          (name) => channels[name]
        );

        if (sort !== 'default') {
          filtredGenres.sort((a, b) =>
            sort === 'asc'
              ? a.name > b.name
                ? 1
                : a.name < b.name
                ? -1
                : 0
              : a.name > b.name
              ? -1
              : a.name < b.name
              ? 1
              : 0
          );
        }
        return filtredGenres;
      })
    );
  }
  constructor(private channelService: ChannelsService) {}

  getChannels(): void {
    this.channelService
      .getChannels()
      .subscribe(({ total, channelDetails: channels }) => {
        this.subjectTotal.next(total);
        const genresMap = {
          all: {
            genreName: 'Все жанры',
            channels: [],
          },
        };
        const channelsMap = {};

        for (const channel of channels) {
          channelsMap[channel.name] = channel;
          genresMap.all.channels.push(channel.name);

          if (Array.isArray(channel.genres)) {
            for (const genre of channel.genres) {
              if (genresMap[genre.genreID]) {
                genresMap[genre.genreID].channels.push(channel.name);
              } else {
                genresMap[genre.genreID] = {
                  ...genre,
                  channels: [channel.name],
                };
              }
            }
          }
        }

        this.subjectChannels.next(channelsMap);
        this.subjectGenres.next(genresMap);
      });
  }
}
