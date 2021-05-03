import PropTypes from 'prop-types';

import MuiSnackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from './SnackbarContentWrapper';

function SnackBar({ message, onClose, open, variant }) {
  return (
    <MuiSnackbar
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
    >
      <SnackbarContentWrapper
        onClose={onClose}
        variant={variant}
        message={message}
      />
    </MuiSnackbar>
  );
}

SnackBar.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired,
};

export default SnackBar;
