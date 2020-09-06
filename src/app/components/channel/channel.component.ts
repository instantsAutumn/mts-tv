import { Component, Input, OnInit } from '@angular/core';
import IChannel from 'src/app/interfaces/channel';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  @Input() item: IChannel;
  constructor() {}

  ngOnInit(): void {
  }
}
