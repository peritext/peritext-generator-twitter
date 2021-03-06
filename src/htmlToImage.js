import webshot from 'webshot';

export default (html, path, callback) => {
  webshot(html, path, {
    siteType:'html',
    windowSize: {
      width: 900,
      // height: 450
      height: 10 // setting a mini height to have well formed images
    },
    shotSize: { 
      width: 'all',
      height: 'all' 
    }
  },
  (err) => {
    callback(err);
  });
}