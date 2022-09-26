import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FlexCard from '../blocks/FlexCard';
import { useTheme } from '@mui/material/styles';

const Inspector = ({ cardData, featuredCard, featuredCardRenderer, heading, headingRenderer, theme }) => {
  const defaultTheme = useTheme();
  const tg = theme || defaultTheme;
  const {inspector, singleFlexRow} = tg;
  const {heading: headingTheme, clearButton, featuredCard: featuredCardTheme } = inspector || {};
  const {heading: fcThemeHeading, legend: fcThemeLegend} = featuredCardTheme || {};

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
          <Button sx={clearButton} color="secondary">Clear</Button>
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

  const renderCardData = cardData.map((card, index) => {
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
    legendColor: PropTypes.string
  })),
  heading: PropTypes.string,
  featuredCard: PropTypes.shape({
    heading: PropTypes.string,
    legendLabel: PropTypes.string
  }),
  headingRenderer: PropTypes.func,
  featuredCardRenderer: PropTypes.func,
  theme: PropTypes.shape({
    singleFlexRow: PropTypes.object,
    inspector: PropTypes.shape({
      heading: PropTypes.object,
      clearButton: PropTypes.object,
      featuredCard: PropTypes.shape({
        heading: PropTypes.object,
        legend: PropTypes.object
      })
    })
  }),
  children: PropTypes.node,
};

export  default Inspector;