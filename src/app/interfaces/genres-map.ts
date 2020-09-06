import IGenre from './genre';

export type IGenresMapValue = Partial<IGenre> & {
  channels: string[];
};

export interface IGenresMap {
  [key: string]: IGenresMapValue;
}
