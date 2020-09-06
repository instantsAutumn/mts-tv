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

  ngOnInit(): void {
    this.channelsStoreService.getChannels();

    this.subscriptions.push(
      this.channelsStoreService.channels.subscribe((channels) => {
        this.channels = channels;
      }),
      this.channelsStoreService.subjectTotal.subscribe((total) => {
        this.total = total;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
