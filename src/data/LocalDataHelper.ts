import LocalData from "./LocalData";

const LOCAL_STORAGE_KEY: string = '__DataKey';

class LocalDataHelper {
  private data: LocalData;

  constructor () {
    this.read();
  }

  public get lastSearch (): string[] {
    return this.data.lastSearch.slice();
  }

  public addSearchText (s: string | undefined) {
    if (!s || this.data.lastSearch.indexOf(s) == 0)
      return;

    this.data.lastSearch = [s, ...this.data.lastSearch].slice(0, 3);
    this.save();
  }

  private read () {
    let json: any = window.localStorage.getItem(LOCAL_STORAGE_KEY);

    try {
      this.data = json ? JSON.parse(json) : new LocalData();
    } catch (e) {
      this.data = new LocalData();
    }

    this.save();
  }

  private save () {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.data));
  }
}

export default new LocalDataHelper();