/**
 * This module exports a stateless reusable block asset wrapper component
 * It handles the connection to context's data and builds proper data to render the asset
 * ============
 */
import React from 'react';
import PropTypes from 'prop-types';


const BlockAssetWrapper = ({
  data
}, context) => {
  const assetId = data.asset.id;
  const contextualization = context.story && context.story.contextualizations && context.story.contextualizations[assetId];
  if (!contextualization) {
    return null;
  }
  const story = context.story;
  const contextualizer = story.contextualizers[contextualization.contextualizerId];
  const resource = story.resources[contextualization.resourceId];
  const dimensions = context.dimensions || {};
  const fixedPresentationId = context.fixedPresentationId;
  const onPresentationExit = context.onPresentationExit;
  const inNote = context.inNote;
  const contextualizers = context.contextualizers;
  const contextualizerModule = contextualizers[contextualizer.type];
  
  const Component = contextualizerModule && contextualizerModule.BlockStatic;
  
  if (contextualization && Component) {
    const hideInCodexMode = (contextualizer.visibility !== undefined ? !contextualizer.visibility.codex : false);
    return hideInCodexMode ? null : (
      <figure
        className={'block-contextualization-container ' + contextualizer.type}
        style={{
          position: 'relative',
          minHeight: contextualizer.type === 'data-presentation' ? dimensions.height : '20px'
        }}
        id={assetId}>
        <Component
          resource={resource}
          contextualizer={contextualizer}
          contextualization={contextualization}

          fixed={fixedPresentationId === assetId}
          allowInteractions={inNote || fixedPresentationId === assetId}
        />
        <figcaption>
          {<h4>
            {contextualization.title || resource.metadata.title}
          </h4>}
          {<p>
            {contextualization.legend || resource.metadata.description}
          </p>}
          {resource.metadata.source && <p>
            Source: <i>{resource.metadata.source}</i>
          </p>}
        </figcaption>
      </figure>
    );
  }
  else {
    return null;
  }
};
/**
 * Component's properties types
 */
BlockAssetWrapper.propTypes = {
  /**
   * Corresponds to the data initially embedded in a draft-js entity
   */
  data: PropTypes.shape({
    asset: PropTypes.shape({
      id: PropTypes.string
    })
  })
};
/**
 * Component's context used properties
 */
BlockAssetWrapper.contextTypes = {
  /**
   * The active story data
   */
  story: PropTypes.object,
  /**
   * Dimensions of the wrapping element
   */
  dimensions: PropTypes.object,
  /**
   * Id of the presentation being displayed full screen if any
   */
  fixedPresentationId: PropTypes.string,
  /**
   * Whether the block asset is displayed in a note (and not in main content)
   */
  inNote: PropTypes.bool,

  contextualizers: PropTypes.object,
};

export default BlockAssetWrapper;