export default class StoryModel {
  id;
  title;
  url;
  author;
  creationTime;
  isFavorite;
  descendants;

  constructor({by, id, title, time, url, score, descendants}) {
    this.author = by;
    this.id = id;
    this.title = title;
    this.creationTime = time;
    this.url =
      url !== undefined ? url : `https://news.ycombinator.com/item?id=${id}`;
    this.score = score;
    this.descendants = descendants;
    this.isFavorite = false;
  }
}
