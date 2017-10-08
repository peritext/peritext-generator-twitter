import {mapSeries} from 'async';
import ProgressBar from 'progress';
import toImage from './htmlToImage';
import {resolve} from 'path';

export default (items, imagesDir, callback) => {
  console.log('writing images');
  const bar = new ProgressBar(':bar :percent  :current/:total', { total: items.length });
  mapSeries(items, (item, cb) => {
    bar.tick();
    const path = resolve(imagesDir + '/' + item.id + '.jpg');
    toImage(item.html, path, cb);
  }, callback);
}
