import { forwardRef, Ref } from 'react';
import { NavLink } from 'react-router-dom';

interface LinkBehaviorProps {
  href: string | { hash?: string; pathname?: string; search?: string };
}

const LinkBehavior = forwardRef(
  (props: LinkBehaviorProps, ref: Ref<HTMLAnchorElement | HTMLAnchorElement>) => {
    const { href, ...other } = props;

    // Map href (MUI) -> to (react-router)
    // If href starts with http or https, then it is an external link
    if (typeof href === 'string' && href.startsWith('http')) {
      return <a href={href} ref={ref} {...other} />;
    }

    return <NavLink ref={ref} to={href as string} {...other} />;
  }
);

export default LinkBehavior;