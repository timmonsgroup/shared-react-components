
/** @module ConfigView */
// Third party libraries
import React, { useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { SectionTop } from '../Section';
import { FIELD_TYPES, STATIC_TYPES } from '../../constants';

// MUI imports
import {
  Typography, Card, CardContent,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Divider, styled
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Box } from '@mui/system';

//create a context for the application data
export const ViewContext = createContext();

/**
 * @function ConfigView
 * @param {object} props
 * @param {array} props.sections - array of sections to render
 * @param {object} [props.dynamicComponents] - object of dynamic components to render
 * @param {boolean} [props.isLoading] - boolean to indicate if the view is loading
 * @param {object} [props.options] - options object
 * @param {React.ReactElement} [props.options.fieldValueComponent] - component to use for field values. Use to completely control the rendering of field values
 * @param {React.ReactElement} [props.options.linkComponent] - component to use for links. If fieldValueComponent this property will be ignored
 * @returns {React.ReactElement} - returns rendered view
 */
export const ConfigView = ({ sections, dynamicComponents, isLoading, options }) => {
  // add dynamic components to the context
  const context = {
    dynamicComponents,
    isLoading,
    options
  };

  return (
    <ViewContext.Provider value={context}>
      {sections?.map((section, index) => {
        return (
          <ViewSection key={index} section={section} index={index} />
        );
      })}
    </ViewContext.Provider>
  );
};

ConfigView.propTypes = {
  sections: PropTypes.array.isRequired,
  dynamicComponents: PropTypes.object,
  isLoading: PropTypes.bool,
  options: PropTypes.object,
};

export default ConfigView;

/**
 * @function ViewSection
 * @param {object} props
 * @param {object} props.section - field object to render
 * @param {number} props.index - index of the field
 * @returns {React.ReactElement} - returns rendered section
 * @description renders a view section
 */
export const ViewSection = ({ section, index, ...props }) => {
  const { areas, name, columns, description } = section;
  const { isLoading } = useContext(ViewContext);
  const RenderFields = columns ? ViewColumns : ViewRows;
  const sx = {
    position: 'relative',
  };

  if (index) {
    sx.marginTop = '16px';
  }

  return (
    <Card sx={sx}>
      {isLoading &&
        (<Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {index === 0 && <Typography variant="sectionHeader">Loading Grant Application...</Typography>}
        </Box>)
      }
      <SectionTop
        title={name}
        description={description}
      />
      <CardContent className={isLoading ? 'loading' : 'loaded'}>
        <RenderFields areas={areas} />
      </CardContent>
    </Card>
  );
};

ViewSection.propTypes = {
  section: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * @function ViewColumns
 * @param {object} props
 * @param {object} props.areas - field object to render
 * @returns {React.ReactElement} - returns rendered columnss
 */
export const ViewColumns = ({ areas }) => {
  const colSize = Math.max(12 / areas.length, 3);
  return (
    <Grid container spacing={2} xs={12}>
      {areas.map((col, colIndex) => (
        <Grid key={colIndex} xs={Math.max(colSize, 12)} sm={Math.max(colSize, 6)} md={colSize}>
          {col.map((field, fIndex) => (
            <ViewField key={fIndex} field={field} />
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

ViewColumns.propTypes = {
  areas: PropTypes.array.isRequired
};

/**
 * @function ViewRows
 * @param {object} props
 * @param {object} props.areas - field object to render
 * @returns {React.ReactElement} - returns rendered rows
 */
export const ViewRows = ({ areas }) => {
  return (
    <>
      {
        areas.map((row, rowIndex) => {
          let colSize = 12 / row.length;
          return (
            <Grid key={rowIndex} xs={12} container spacing={2}>
              {row.map((field, fIndex) => {
                if (row.length === 1 && field.singleColumnSize) {
                  colSize = parseInt(field.singleColumnSize) || colSize;
                }
                return (
                  <Grid key={fIndex} xs={Math.max(colSize, 12)} sm={Math.max(colSize, 6)} md={colSize}>
                    <ViewField field={field} />
                  </Grid>
                );
              })}
            </Grid>
          );
        })
      }
    </>
  );
};

ViewRows.propTypes = {
  areas: PropTypes.array.isRequired
};

/**
 * @function FieldValue
 * @param {object} props
 * @param {object} props.field - field object to render
 * @returns {React.ReactElement} - returns rendered field
 * @description Render the value of a field
 */
export const FieldValue = ({field}) => {
  const { options } =  useContext(ViewContext);
  // Default to the LinkValue component if no custom component is passed in
  const LinkComponent = options?.linkComponent || LinkValue;
  const isEmpty = field.empty === field.value;
  const className = `${field.id}-value`;
  if (!isEmpty && (field.type === FIELD_TYPES.LINK || (field.renderAsLinks && field.value))) {
    const links = Array.isArray(field.value) ? field.value : [field.value];
    return (
      <>
        {links.map((link, index) => (
          <LinkComponent key={index} field={field} link={link} index={index} className={className} />
        ))}
      </>
    );
  }
  return <Typography variant="detailItem" className={className}>{field.value}</Typography>;
};

FieldValue.propTypes = {
  field: PropTypes.object.isRequired
};

/**
 * @function LinkValue
 * @param {object} props
 * @param {object} props.field - field object to render
 * @param {object | string} props.link - link object to render
 * @param {string} props.link.id - id of the link
 * @param {string} props.link.label - label of the link
 * @param {string} [props.link.name] - name of the link (fallback if label is not present)
 * @param {number} props.index - index of the link
 * @returns {React.ReactElement} - returns rendered link
 * @description Render the value of a link
 */
export const LinkValue = ({field, link, index}) => {
  const isEmpty = field.empty === field.value;

  if (isEmpty) {
    return <Typography variant="detailItem">{field.empty}</Typography>;
  }

  const isLink = field.type === FIELD_TYPES.LINK;
  const external = isLink && link.startsWith('http');

  const theUrl = isLink ? link : field.linkFormat.replace('{id}', link?.id);
  const label = isLink ? link : link?.label ?? link?.name;

  return (
    <React.Fragment>
      {index > 0 && <Typography variant="detailItemSeparator">,</Typography>}
      <Typography variant="detailItem">
        <Link to={theUrl} target={external ? '_blank' : '_self'}>{label}</Link>
      </Typography>
    </React.Fragment>
  );
};

LinkValue.propTypes = {
  field: PropTypes.object.isRequired,
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  index: PropTypes.number.isRequired
};


/**
 * @function ViewField
 * @param {object} props
 * @param {object} props.field - field object to render
 * @param {string} props.field.type - type of field to render
 * @param {string} [props.field.label] - text to render
 * @returns {React.ReactElement} - returns rendered field
 */
export const ViewField = ({ field }) => {
  const { dynamicComponents, options } = useContext(ViewContext);

  if (field.static) {
    const baseClass = field.className || '';
    switch (field.type) {
      case STATIC_TYPES.DIVIDER: {
        return <Divider className={baseClass}/>;
      }
      case STATIC_TYPES.COMPONENT: {
        const Component = dynamicComponents[field.component];
        if (!Component) {
          console.warn(`Component ${field.component} not found. Rendering null.`);
          return null;
        }
        return <Component className={baseClass} {...field.componentProps} />;
      }
      case STATIC_TYPES.IMAGE: {
        return <img src={field.src} alt={field.alt} className={baseClass}/>;
      }
      case STATIC_TYPES.TEXT: {
        const props = field.variant ? { variant: field.variant } : {};
        return <Typography className={baseClass} {...props}>{field.text}</Typography>;
      }
      case STATIC_TYPES.HEADER: {
        return <Typography variant={field.variant || 'sectionHeader'} className={'label' + (field.className ? ` ${field.className}` : '')}>{field.text}</Typography>;
      }
      default: {
        return null;
      }
    }
  }

  if (field.type === FIELD_TYPES.CLUSTER) {
    return <ClusterTable field={field} />;
  }

  // Default to the FieldValue component if no custom component is passed in
  const ValueComponent = options?.fieldValueComponent || FieldValue;
  return (
    <div className={`${field.id}-field` + (field.className ? ` ${field.className}` : '')}>
      <Typography variant="detailItem" className={`label ${field.id}-label`}>{field.label}: </Typography>
      <ValueComponent field={field} />
    </div>
  );
};

ViewField.propTypes = {
  field: PropTypes.object.isRequired
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.configView.clusterField.alternateRowColor,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


/**
 * @function ClusterTable
 * @param {object} props
 * @param {object} props.field - field object to render
 * @param {object} props.field.value - value of the field
 * @param {object} props.field.value.headers - headers of the table
 * @param {object} props.field.value.rows - rows of the table
 * @param {object} [props.field.label] - label of the field
 * @returns {React.ReactElement} the cluster table
 */
export const ClusterTable = ({ field }) => {
  // Fun fact you can destructure a string in javascript without a runtime error ...but it will give undefined
  const { headers, rows } = field?.value || {};
  if (!headers || !rows) {
    return null;
  }

  return (
    <>
      {(field.label && field.label !== '') &&
        <Typography variant="sectionHeader" className={`${field.id}-label`}>{field.label}</Typography>
      }
      <TableContainer component={Paper} className={`cluster-table-${field.id}` + (field.className ? ` ${field.className}` : '')}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ background: (theme) => theme.configView.clusterField.headerColor }}>
            <TableRow>
              {headers.map((header, hI) => {
                return (
                  <TableCell key={hI} align={hI === 0 ? 'left' : 'right'} sx={{
                    color: (theme) => theme.configView.clusterField.headerTextColor,
                    fontWeight: 'bold',
                  }}>{header}</TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rI) => (
              <StyledTableRow
                key={`${row.name}-${rI}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {row.map((cell, cI) => (
                  <React.Fragment key={cI}>
                    {cI === 0 &&
                      <TableCell key={cI} component="th" scope="row">{cell}</TableCell>
                    }
                    {cI !== 0 &&
                      <TableCell key={cI} align="right">{cell}</TableCell>
                    }
                  </React.Fragment>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

ClusterTable.propTypes = {
  field: PropTypes.object.isRequired
};
