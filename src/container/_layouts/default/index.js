import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper } from './styles';

function PageDefault({ children }) {
  return <Wrapper>{children}</Wrapper>;
}

export default PageDefault;

PageDefault.propTypes = {
  children: PropTypes.element.isRequired,
};
