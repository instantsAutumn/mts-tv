import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import IChannel from 'src/app/interfaces/channel';
import { ChannelsStoreService } from 'src/app/services/channels-store/channels-store.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
})
export class ChannelsComponent implements OnInit, OnDestroy {
  constructor(private channelsStoreService: ChannelsStoreService) {}
  subscriptions: Subscription[] = [];
  channels: IChannel[] = [];
  total: string;
  isMore = true;

  ngOnInit(): void {
    this.subscriptions.push(
      this.channelsStoreService
        .getChannels()
        .subscribe((channels) => (this.channels = channels)),
      this.channelsStoreService
        .getTotal()
        .subscribe((total) => (this.total = total)),
      this.channelsStoreService
        .isMore()
        .subscribe((isMore) => (this.isMore = isMore))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  loadMore(): void {
    this.channelsStoreService.loadMore();
  }
}
