/** @module SubHeader */
import { type ReactElement, type FC } from 'react';
import { AppBar, Box, Toolbar, Typography, AppBarProps } from '@mui/material';

declare module '@mui/material/AppBar' {
  interface AppBarPropsColorOverrides {
    [color: string]: true;
  }
}

interface SubHeaderProps extends AppBarProps {
  title?: string;
  titleRender?: () => ReactElement;
  rightRender?: (props?: any) => ReactElement;
  color?: string;
  rightRenderProps?: object;
  sx?: object;
}

/**
 * if a titleRender is passed in, it will be used to render the title
 * otherwise, the title will be rendered as an h3
 * if neither then no header will be rendered
 * @function SubHeader
 * @param {object} props
 * @param {string} [props.title] - title to display
 * @param {function} [props.titleRender] - function to render the title
 * @param {function} [props.rightRender] - function to render the right side of the header
 * @param {string} [props.color] - color of the header
 * @param {object} [props.props] - additional props to pass to the AppBar
 * @param {object} [props.sx] - sx props
 * @returns {ReactElement}
 */
const SubHeader: FC<SubHeaderProps> = ({ title, titleRender, rightRender, color = 'accent', rightRenderProps, ...props }) => {
  /**
   * if a titleRender is passed in, it will be used to render the title
   * otherwise, the title will be rendered as a Typography "subHeader" variant
   * @function renderTitle
   * @returns {ReactElement | null}
   */
  const renderTitle = (): ReactElement | null => {
    if (titleRender || title) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          {titleRender ? (
            titleRender()
          ) : (
            <Typography variant="subHeader">{title}</Typography>
          )}
        </Box>
      );
    }

    return null;
  };

  /**
   * if a rightRender is passed in, it will be used to render the right side of the header
   * otherwise, nothing will be rendered
   * @function renderRight
   * @returns {ReactElement}
   */
  const renderRight = (): ReactElement | null => {
    if (rightRender) {
      return (
        <Box sx={{ flexGrow: 1, textAlign: 'right' }}>{rightRender({ ...rightRenderProps })}</Box>
      );
    }
    return null;
  };

  return (
    <AppBar position="sticky" color={color} {...props}>
      <Toolbar sx={{ fontWeight: '700' }} variant="dense">
        {renderTitle()}
        {renderRight()}
      </Toolbar>
    </AppBar>
  );
};

export default SubHeader;