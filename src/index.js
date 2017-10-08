import {flatten} from 'lodash';
import shuffle from 'array-shuffle';
import {buildCitations} from 'peritext-rendering-utils';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {v4 as id} from 'uuid';
import {writeFileSync} from 'fs';
import ProgressBar from 'progress';
import h2p from 'html2plaintext';
import typographicBase from 'typographic-base';

import Renderer from './components/Renderer';
import writeImages from './writeImages';
import buildTags from './makeTags';


export default ({
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
}) => {
  // typograph
  // 1. select all the blocks
  let blocks = Object.keys(story.sections)
    .reduce((blocks, sectionId) => 
      blocks.concat(
        story.sections[sectionId].contents.blocks
        // don't use li and ul list items
        .filter(block => block.type !== 'unordered-list-item' && block.type !== 'ordered-list-item')
        .filter(block => includeHeaders ? true : block.type.indexOf('header-') !== 0)
        .filter(block => includeBlockContextualizations ? true : block.type !== 'atomic')
        // filter out malformed attomic
        .filter(block => {
          // filter blocks to short
          if (block.type !== 'atomic') {
            return block.text.length >= minBlockCharLength;
          }
          // filter empty contextualizations
          else if (block.entityRanges && block.entityRanges[0]) {
            const entityId = '' + block.entityRanges[0].key;
            const entity = story.sections[sectionId].contents.entityMap[entityId];
            const contextualizationId = entity.data.asset.id;
            const contextualization = story.contextualizations[contextualizationId];
            const contextualizerId = story.contextualizations[contextualizationId].contextualizerId;
            const contextualizer = story.contextualizers[contextualizerId];
            // do not display contextualizations hidden in fragments
            if (contextualizer.visibility && contextualizer.visibility.fragment !== undefined) {
              return !contextualizer.visibility.fragment;
            }
            return true;
          } else return false;
        })
        .map(block => ({
          ...block,
          text: typographicBase(block.text, {locale})// tp.execute(block.text)
        }))
        .map(block => ({
          blocks: [block],
          entityMap: story.sections[sectionId].contents.entityMap,
          sectionId,
          id: id()
        }))
      ),
    []);

  if (ordering === 'shuffle') {
    blocks = shuffle(blocks);
  } else if (ordering === 'reverse') {
    blocks = reverse(blocks);
  }
  const bar = new ProgressBar('rendering :bar :percent  :current/:total', { total: blocks.length });

  const citations = buildCitations(story);

  const citationStyle = story.settings.citationStyle.data;
  const citationLocale = story.settings.citationLocale.data;

  // render each block as plain html
  blocks = blocks.map((block, index) => {
    bar.tick();
    console.log('rendering excerpt to html', (index + 1) + '/' + blocks.length);
    const storyTitle = story.metadata.title;
    const sectionTitle = story.sections[block.sectionId].metadata.title;
    const Comp = <html>
      <head>
        {fontUrl && <link href={fontUrl} rel="stylesheet" />}
        <style>{cssStyle}</style>
      </head>
      <body>
        <div className="excerpt">
          <Renderer 
            raw={block}
            citations={citations}
            citationStyle={citationStyle}
            citationLocale={citationLocale}
            story={story}
            contextualizers={contextualizers}
          />
        </div>
        <div className="footer">
          <i><b>{storyTitle}</b></i> – <i>{sectionTitle}</i>
        </div>
      </body>
    </html>;

    const html = ReactDOMServer.renderToStaticMarkup(Comp);
    // plain text
    const text = h2p(ReactDOMServer.renderToStaticMarkup(<Renderer 
          raw={block}
          citations={citations}
          citationStyle={citationStyle}
          citationLocale={citationLocale}
          story={story}
          contextualizers={contextualizers}
        />));
    const tags = buildTags(text, tagsStopWords);
    return {
      ...block,
      html,
      text,
      tags
    };
  });

  // build tweets tags map (to have weighted tags)
  console.log('preparing hashtags');
  const tagsMap = {};
  blocks.forEach(block => {
    block.tags.forEach(tag => {
      tagsMap[tag] = tagsMap[tag] ? tagsMap[tag] + 1 : 1;
    })
  });

  // build tweets messages
  console.log('preparing tweets messages');
  blocks = blocks.map(block => {
    const type = block.blocks[0].type;
    let message = prefix;

    if (makeLink && typeof makeLink === 'function') {
      message += makeLink(block);
    }
    const tags = block.tags.sort((a, b) => {
      if (tagsMap[a] > tagsMap[b]) {
        return -1;
      } else return 1;
    });
    message += ' #' + tags.join(' #');
    message = message.trim();
    if (message.length >= 140) {
      while(message.length > 140 - suffix.length) {
        const parts = message.split(' ');
        parts.pop();
        message = parts.join(' ');
      }
    }
    message += ' ' + suffix;

    message = message.length <= 140 ? message : message.substr(0, 137) + '...';
    return {
      ...block,
      message
    }
  })


  // write data
  writeFileSync(dataPath, JSON.stringify({tweets: blocks, tagsMap}, null, 2), 'utf8');
  // write images
  writeImages(blocks, imagesFolder, (err) => callback(err, blocks));
}