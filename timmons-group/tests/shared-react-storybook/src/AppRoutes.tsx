import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';


// Create a generic about component
const About: FC = () => {
  return <div>About</div>;
};

// Create a generic not found component
const NotFound: FC = () => {
  return <div>Not Found</div>;
};

const CustomRightRender: FC = () => {
  return (
    <div>
      <p>Custom Right Render</p>
    </div>
  );
}

const AppRoutes: FC = () => {
  return (
      <Routes>
        <Route path="/" element={<Layout title="I am the playground, Randy" rightRender={CustomRightRender} />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route element={<NotFound />} />
        </Route>
      </Routes>
  );
};

export default AppRoutes;
