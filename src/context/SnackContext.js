import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import SnackBar from '~/components/Snackbar';

export const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState({
    message: '',
    type: '',
  });

  function snackBarOpen(message, type) {
    setSnackMessage((prev) => ({
      ...prev,
      message,
      type,
    }));
    setSnackOpen(true);
  }

  snackBarOpen.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.string,
  };

  snackBarOpen.defaultProps = {
    type: 'info',
  };

  const handleSnackClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ snackBarOpen }}>
      {children}
      <SnackBar
        open={snackOpen}
        onClose={handleSnackClose}
        variant={snackMessage.type}
        message={snackMessage.message}
      />
    </SnackbarContext.Provider>
  );
}

SnackbarProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
