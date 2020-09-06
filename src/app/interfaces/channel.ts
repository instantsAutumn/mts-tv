import IGenre from './genre';

export default interface IChannel {
  name: string;
  introduce: string;
  picture: {
    hcsSlaveAddrs: string[];
    extensionFields: string[];
    backgrounds: string[];
    channelPics: string[];
    channelBlackWhites: string[];
    others: string[];
  };
  genres: IGenre[];
}
