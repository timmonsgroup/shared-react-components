import React, { forwardRef, useImperativeHandle } from 'react';

import PropTypes from 'prop-types';

import { Typography, Drawer, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/InfoOutlined';


const SideBarButton = ({ isOpen, onToggleSideBar, dw }) => {
  let sideBarWidth = dw || 421;
  sideBarWidth += 31;  // add 31 for the padding/margins
  if (isOpen) {
    return (
      <Box
        sx={{
          minWidth: `${sideBarWidth}px`,
        }}
        onClick={onToggleSideBar}
      />
    );
  }
  return (
    <Box sx={{ cursor: 'pointer' }} backgroundColor="#002D4C" minWidth={40} onClick={onToggleSideBar}>
      <Typography color="#D16400" fontWeight="bold" variant="h6" marginLeft={2}>&gt;</Typography>
    </Box>
  );
}

SideBarButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  dw: PropTypes.number,
  onToggleSideBar: PropTypes.func,
};


/**
 * Wrapper of the Mui Drawer component
 * Sets some base properties
 * @returns {object}
 */
const SideBar = forwardRef(({ initiallyOpen, drawerWidth, children, title, aboutThisSideBarLabel, onAbtThisClick, onSideBarToggle, sx }, ref) => {
  const [checked, setChecked] = React.useState(initiallyOpen || false);

  // Expose some methods to the parent component
  useImperativeHandle(ref, () => {
    return {
      forceOpen,
    };
  });

  const handleSideBarClick = () => {
    const newChecked = !checked;
    setChecked(current => !current);
    onSideBarToggle(newChecked);
  }


  const forceOpen = () => {
    setChecked(true);
  };


  const dw = drawerWidth || 421;
  const titleBoxWidth = drawerWidth - 38;
  const bg = sx?.backgroundColor || '#F1F1F1';
  
  return (
    <>
      <SideBarButton onToggleSideBar={handleSideBarClick} isOpen={checked} dw={dw}></SideBarButton>
      <Drawer
        sx={{
          width: { dw },
          '& .MuiDrawer-paper': {
            width: { dw },
            boxSizing: 'border-box',
            backgroundColor: bg,
          },
        }}
        variant="persistent"
        anchor="left"
        open={checked}
      >
        {/* Top Part of Sidebar */}
        <Box sx={{ marginTop: '75px', height: '40px', marginLeft: '16px', marginRight:'15px', marginBottom: '10px', backgroundColor: '#fff' }}>
          <Box sx={{ left: 0, display: 'inline-flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', height: '40px', width: `${titleBoxWidth}px`, border: '1px solid #C8C8C8' }}>
            <Typography color="#264D6A" marginTop="5px" fontWeight="bold" fontSize={18}>
              {title}
            </Typography>
          </Box>
          <Box onClick={handleSideBarClick}
            sx={{ left: 0, display: 'inline-flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', height: '40px', width: '37px', border: '1px solid #C8C8C8' }}>
            <Typography color="#D16400" marginTop="5px" fontWeight="bold" fontSize={18}>
              &lt;
            </Typography>

          </Box>
        </Box>

        <Box className="sidebar-content" 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            marginLeft:'16px', 
            marginRight: '15px', 
            backgroundColor:'#fff', 
          }}>
          <div>
            <Box sx={{ width: `${dw}px` }}>
              {children}
            </Box>
          </div>

          {/* Bottom of Sidebar */}
          <div>
            <Box onClick={onAbtThisClick}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'rows',
                justifyContent: 'flex-end',
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingTop: '5px',
                paddingBottom: '4px',
                marginBottom: '10px',
                alignItems: 'center',
              }}>
              <Typography color="primary" paddingTop="3px" fontSize="14px" fontWeight="bold">
                {aboutThisSideBarLabel}
              </Typography>
              <InfoIcon color="secondary" sx={{ marginLeft: '5px', paddingTop: '1px' }}></InfoIcon>
            </Box>
          </div>
        </Box>
      </Drawer>
    </>
  )
});
SideBar.displayName = 'SideBar';

SideBar.propTypes = {
  initiallyOpen: PropTypes.bool.isRequired,
  drawerWidth: PropTypes.number,
  children: PropTypes.node,
  title: PropTypes.string,
  aboutThisSideBarLabel: PropTypes.string,
  onAbtThisClick: PropTypes.func,
  onSideBarToggle: PropTypes.func,
  sx: PropTypes.object,
};

export default SideBar;
