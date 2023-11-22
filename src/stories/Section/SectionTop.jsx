//Third party bits
import React from 'react';
import PropTypes from 'prop-types';

// Third party components
import { CardContent, Divider, Typography } from '@mui/material';

// Internal bits
import { functionOrDefault } from '../../helpers';

/** @module SectionTop */
/**
 * Default function to render the form description
 * @function renderFormDescription
 * @param {string | React.ReactElement} description
 * @returns {React.ReactElement} - the rendered description
 */
const defaultDescriptionRenderer = (description) =><Typography variant="sectionDescription">{description}</Typography>;

/**
 * Default function to render the form description
 * @function renderFormTitle
 * @param {string | React.ReactElement} description
 * @returns {React.ReactElement} - the rendered description
 */
const defaultTitleRenderer = (title) => <Typography variant="sectionHeader">{title}</Typography>;

/**
 * Top portion of a section will render the section title and description
 * @function SectionTop
 * @param {props} props - props object
 * @param {string} props.title - the title text
 * @param {string} props.description - the description text
 * @param {number} props.index - the index of the section (if rendering via a loop)
 * @param {renderSectionTitle} props.renderTitle - a function to render title (default is to render the title as "sectionHeader")
 * @param {renderSectionDescription} props.renderDescription - a function to render a description (default is to render the description as "sectionDescription")
 * @returns {React.ReactElement} - the rendered section top
 * @example
 * <SectionTop title="Section Title" description="Section Description" />
 * @example
 * <SectionTop title="Section Title" renderDescription={(description) => <Typography variant="baconBits">{description}</Typography>} />
 */
const SectionTop = ({ title, description, renderTitle, renderDescription, index }) => {
  // Allow rendering if description is provided or if renderDescription is provided
  // this allows users to completely override the description
  const theDescription = description || renderDescription ? functionOrDefault(renderDescription, defaultDescriptionRenderer) : null;
  const theTitle = title || renderTitle ? functionOrDefault(renderTitle, defaultTitleRenderer) : null;

  return (
    <>
      {theTitle && <>
        <CardContent>
          {theTitle(title, index)}
        </CardContent>
        <Divider />
      </>
      }
      {theDescription &&
        <CardContent sx={{ paddingBottom: '0px' }}>
          {theDescription(description, index)}
        </CardContent>
      }
    </>
  );
};

SectionTop.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  renderDescription: PropTypes.func,
  renderTitle: PropTypes.func,
  index: PropTypes.number,
};

export {
  SectionTop,
  defaultDescriptionRenderer,
  defaultTitleRenderer,
};