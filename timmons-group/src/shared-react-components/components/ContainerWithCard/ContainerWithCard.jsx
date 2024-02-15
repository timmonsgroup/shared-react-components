/** @module ContainerWithCard */
import React from 'react';
import PropTypes from 'prop-types';

import {Card, CardContent, Container} from '@mui/material';

/**
 * A helper component to render a Container with a Card and CardContent
 * @function ContainerWithCard
 * @param {object} props - props object
 * @param {object} [props.cardProps] - props for the Card component
 * @param {object} [props.cardContentProps] - props for the CardContent component
 * @param {object} props.children - children to render
 * @returns {React.ReactElement} - React component
 * @example
 * <ContainerWithCard>
 *  <Typography variant="h5" component="h2">
 *   This is a card
 * </Typography>
 * </ContainerWithCard>
 */
const ContainerWithCard = ({children, cardProps, cardContentProps, ...props}) => {
  return (
    <Container sx={{ marginTop: '16px' }} {...props}>
      <Card {...cardProps}>
        <CardContent {...cardContentProps}>
          {children}
        </CardContent>
      </Card>
    </Container >
  );
};

ContainerWithCard.propTypes = {
  children: PropTypes.node.isRequired,
  cardProps: PropTypes.object,
  cardContentProps: PropTypes.object,
};

export default ContainerWithCard;