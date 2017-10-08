import fs from 'fs';
import path from 'path';

export default (str = '', stops = []) => {
  const stripped = str.replace(/[.,'\/#!$%\^&\*;:{}=\"_`~()]/g," ");
  const splitted = stripped.split(' ')
  return splitted
    .filter(obj => obj.length > 1)
    .map(word => word.toLowerCase())
    .filter(word => {
      const bro = stops.find(stop => stop === word);
      return bro === undefined;
    })
    // uniques
    .filter((w1, i1) => {
      const other = splitted.find((w2, i2) => w1.toLowerCase() === w2.toLowerCase() && i1 !== i2)
      return other === undefined;
    });
}