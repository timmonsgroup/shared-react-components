import React from 'react';
import PropTypes from 'prop-types';

import {Card, CardContent, Container} from '@mui/material';

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