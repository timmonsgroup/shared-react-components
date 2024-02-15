import React from 'react';
import SideBar from './SideBar';

export default {
  title: 'Components/SideBar',
  component: SideBar,
};

const Template = (args) => {
  return (
    <SideBar {...args}>
      <div>Some content</div>
    </SideBar>
  );
};

export const Primary = {
  render: Template,

  args: {
    drawerWidth: 421,
    isOpen: true,
    title: 'Some Custom Title',
    aboutThisSideBarLabel: 'About this sidebar',
    onAbtThisClick: () => {},
    onSideBarToggle: () => {},
  },
};

export const ItShouldBeOpen = {
  render: Template,

  args: {
    drawerWidth: 421,
    isOpen: true,
    title: 'Explorer Tools',
    aboutThisSideBarLabel: 'About Values Explorer',
    onAbtThisClick: () => {},
    onSideBarToggle: () => {},
  },
};

export const ItShouldBeClosed = {
  render: Template,

  args: {
    drawerWidth: 421,
    isOpen: false,
    title: 'Explorer Tools',
    aboutThisSideBarLabel: 'About Values Explorer',
    onAbtThisClick: () => {},
    onSideBarToggle: () => {},
  },
};

export const CustomizedWidth = {
  render: Template,

  args: {
    drawerWidth: 600,
    isOpen: true,
    title: 'Explorer Tools',
    aboutThisSideBarLabel: 'About Values Explorer',
    onAbtThisClick: () => {},
    onSideBarToggle: () => {},
  },
};
