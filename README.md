WIP WIP WIP

This generator - from the peritext fragments family of generators - consumes a peritext document in order to allow the publishing of fragments constituted of text and images compatible with the twitter format requirements.

The generator produces a json file summarizing all the tweets' data and a series of images to use in tweets. Twitter API connexion and tweet sending must be taken care of at a higher level of implementation.

Component API :

```
{
  story, // json object
  imagesFolder = './temp', // where to put the generated images
  dataPath = './temp', // where to put the generated json file describing the tweets
  contextualizers, // map of the contextualizers modules to use
  cssStyle = '',
  fontUrl,
  locale = 'fr',// iso-639 locale

  displayText = true,
  minBlockCharLength = 100, // min length of text to accept for building an excerpt
  includeHeaders = false, // weather to include headers
  includeBlockContextualizations = true, // display as image static block contextualizations
  excludeBlockContextualizationTypes = [], // what blocks to exclude
  ordering = 'shuffle', // or 'normal' or 'reverse'
  makeLink, // undefined or functions that takes section id and possibly contextualization id
  prefix = '', // tweet body prefix
  suffix = '#peritext-twitter', // tweet body suffix

  displayTags = true, // whether to generate hashtags based on the plain text
  weightedTags = true, // whether to weighten the tags
  tagsStopWords = [], // stop words to use for generating the tags

  callback
}
```