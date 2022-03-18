import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import DefaultLayout from '~/container/_layouts/default';
import NetworkLayout from '~/container/_layouts/network';

export default function RouteWrapper({
  component: Component,
  isNetwork,
  ...rest
}) {
  const Layout = isNetwork ? NetworkLayout : DefaultLayout;

  return (
    <Route
      {...rest}
      render={(props) => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}

RouteWrapper.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  isNetwork: PropTypes.bool,
};

RouteWrapper.defaultProps = {
  isNetwork: false,
};
