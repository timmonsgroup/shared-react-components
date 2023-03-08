import React from 'react';
import SideBar from './SideBar';

export default {
  title: 'Components/SideBar',
  component: SideBar,
};

const Template = (args) => {
  return (
    <SideBar {...args} >
      <div>Some content</div>
    </SideBar>
  );
};


export const Primary = Template.bind({});
Primary.args = {
  drawerWidth:421, 
  isOpen: true,
  title:'Some Custom Title', 
  aboutThisSideBarLabel:'About this sidebar',
  onAbtThisClick: () => {},
  onSideBarToggle: () => {},
};

export const ItShouldBeOpen = Template.bind({});
ItShouldBeOpen.args = {
  drawerWidth:421, 
  isOpen: true,
  title:'Explorer Tools', 
  aboutThisSideBarLabel:'About Values Explorer',
  onAbtThisClick: () => {},
  onSideBarToggle: () => {},
};

export const ItShouldBeClosed = Template.bind({});
ItShouldBeClosed.args = {
  drawerWidth:421, 
  isOpen: false,
  title:'Explorer Tools', 
  aboutThisSideBarLabel:'About Values Explorer',
  onAbtThisClick: () => {},
  onSideBarToggle: () => {},
};

export const CustomizedWidth = Template.bind({});
CustomizedWidth.args = {
  drawerWidth:600, 
  isOpen: true,
  title:'Explorer Tools', 
  aboutThisSideBarLabel:'About Values Explorer',
  onAbtThisClick: () => {},
  onSideBarToggle: () => {},
};
