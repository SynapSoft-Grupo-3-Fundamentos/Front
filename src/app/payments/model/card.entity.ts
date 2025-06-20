export class Card {
  id?: number;
  number?: string;
  holder: string;
  year?: number;
  month?: number;
  code?: string;
  profileId?: number;

  constructor() {
    this.id = 0;
    this.profileId = 0;
    this.number = '';
    this.holder = '';
    this.year = 0;
    this.month = 0;
    this.code = '';
  }
}
