
import React from 'react';
import PropTypes from 'prop-types';

const InlineAssetWrapper = ({
  data
}, context) => {
  const {story} = context;
  const assetId = data.asset && data.asset.id;
  if (!assetId || !story) {
    return null;
  }
  const contextualization = story.contextualizations[assetId];
  if (!contextualization) {
    return null;
  }

  const contextualizer = story.contextualizers[contextualization.contextualizerId];
  const resource = story.resources[contextualization.resourceId];
  
  const contextualizers = context.contextualizers;
  const contextualizerModule = contextualizers[contextualizer.type];

  const Component = contextualizerModule && contextualizerModule.InlineStatic;
  
  if (contextualizer && Component) {
    return (
      <Component 
        contextualization={contextualization} 
        contextualizer={contextualizer} 
        resource={resource} 
      />
    );
  }
  return null;
};

/**
 * Component's properties types
 */
InlineAssetWrapper.propTypes = {
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
InlineAssetWrapper.contextTypes = {
  story: PropTypes.object,
  contextualizers: PropTypes.object,
};

export default InlineAssetWrapper;