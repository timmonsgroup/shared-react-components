import { Outlet } from 'react-router-dom';

import { SubHeader } from '@timmons-group/shared-react-components';
import { Button } from '@mui/material';
import { FC } from 'react';

type NavLink = {
  id: string;
  title: string;
  href: string;
};

const navLinks: NavLink[] = [
  { id:'home', title: 'Home', href: '/' },
  {
    id: 'about',
    title: 'About',
    href: '/about',
  }
];

interface LayoutProps {
  title?: string;
  rightRender?: FC;
}

const DefaultRightRender: FC = () => {
  return (
    // create buttons from the navLinks array
    navLinks.map(({href,id, title}, index) => {
      return (
        <Button
          key={href}
          href={href}
          sx = {{ mr: index === navLinks.length - 1 ? 0 : 2 }}
          data-src-header-button={`button-${id}`}
        >
          {title}
        </Button>
      );
    })
  )
}

const Layout: FC<LayoutProps> = ({title, rightRender}) => {
  return (
    <>
      <SubHeader data-src-form-subheader="genericForm"
        title={title ?? 'Title Goes here'}
        rightRender={rightRender ?? DefaultRightRender}
      />
      <Outlet />
    </>
  );
};

export default Layout;
