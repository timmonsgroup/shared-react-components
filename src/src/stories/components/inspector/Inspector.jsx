import React from 'react';
import PropTypes from 'prop-types';

import { Typography, Divider, Box, Button } from '@mui/material';
import FlexCard from '../blocks/FlexCard';
import { useTheme } from '@mui/material/styles';
import { modifyColorOpacity } from '../../../helpers';

const Inspector = ({ cardData, featuredCard, featuredCardRenderer, heading, headingRenderer, theme, onHeaderActionClicked }) => {
  const defaultTheme = useTheme();
  const tg = theme || defaultTheme;
  const {inspector, singleFlexRow} = tg;
  const {heading: headingTheme, clearButton, featuredCard: featuredCardTheme, noData } = inspector || {};
  const {heading: fcThemeHeading, legend: fcThemeLegend} = featuredCardTheme || {};
  const featLegendColor = featuredCard?.legendColor;
  const noDataStyle = noData || {
    color: '#C8C8C8',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh',
  };

  const renderHeading = () => {
    if (headingRenderer) {
      return headingRenderer();
    }

    if (!heading) {
      return null;
    }

    return (
      <>
        <Box sx={singleFlexRow}>
          <Typography sx={headingTheme}>
            {heading}
          </Typography>
          <Button sx={clearButton} onClick={onHeaderActionClicked} color="secondary">Clear</Button>
        </Box>
        <Divider />
      </>
    );
  }

  const renderFeaturedCard = () => {

    if (featuredCardRenderer) {
      return featuredCardRenderer();
    }

    if (!featuredCard || !featuredCard.heading) {
      return null;
    }

    if (featuredCard.legendLabel) {
      const modifiedColor = modifyColorOpacity(featLegendColor, 1);
      fcThemeLegend.color = modifiedColor;
      return (
        <>
          <Box sx={fcThemeHeading}>{featuredCard.heading}:</Box>
          <Box sx={fcThemeLegend}>{featuredCard.legendLabel}</Box>
        </>
      );
    }
    return (
      <Box sx={fcThemeHeading}>{featuredCard.heading}</Box>
    );
  }

  const renderSingleCard = (card, index) => {
    return(
      <FlexCard key={index} themeGroup={tg} item={card}></FlexCard>
    );
  }

  if(!cardData || cardData.length === 0) {
    return (
      <Box sx={noDataStyle}>Click a feature on the Map to view information</Box>
    );
  }

  const renderCardData = cardData?.map((card, index) => {
    return renderSingleCard(card, index);
  });

  return (
    <div>
      {renderHeading()}
      {renderFeaturedCard()}
      {renderCardData}
    </div>
  );
}

Inspector.propTypes = {
  cardData: PropTypes.arrayOf(PropTypes.shape({
    heading: PropTypes.string,
    toolTip: PropTypes.string,
    legendLabel: PropTypes.string,
    legendColor: PropTypes.string,
    lines: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
      link: PropTypes.string
    })),
    footerLinks: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string
    }))
  })),
  heading: PropTypes.string,
  featuredCard: PropTypes.shape({
    heading: PropTypes.string,
    legendLabel: PropTypes.string,
    legendColor: PropTypes.string
  }),
  headingRenderer: PropTypes.func,
  featuredCardRenderer: PropTypes.func,
  theme: PropTypes.object,
  onHeaderActionClicked: PropTypes.func,
  children: PropTypes.node,
};

export  default Inspector;