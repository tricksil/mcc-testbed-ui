import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

const CustomNetworkModal = ({
  open,
  classes,
  propsSubmit,
  propsCancel,
  title,
  titleSubmit,
  titleCancel,
  handleClose,
  handleSubmit,
  ContentComponent,
}) => (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="customized-dialog-title"
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle id="customized-dialog-title" className={classes?.title}>
      {title}
    </DialogTitle>
    <DialogContent>{ContentComponent && ContentComponent}</DialogContent>
    <DialogActions>
      {handleClose && (
        <Button {...propsCancel} onClick={handleClose} color="primary">
          {titleCancel}
        </Button>
      )}
      {handleSubmit && (
        <Button {...propsSubmit} onClick={handleSubmit} color="primary">
          {titleSubmit}
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

CustomNetworkModal.displayName = 'CustomNetworkModal';

CustomNetworkModal.propTypes = {
  title: PropTypes.string.isRequired,
  titleSubmit: PropTypes.string.isRequired,
  titleCancel: PropTypes.string.isRequired,
  classes: PropTypes.oneOfType([PropTypes.object]),
  propsSubmit: PropTypes.oneOfType([PropTypes.object]),
  propsCancel: PropTypes.oneOfType([PropTypes.object]),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  ContentComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
};

CustomNetworkModal.defaultProps = {
  ContentComponent: <></>,
  propsCancel: {},
  propsSubmit: {},
  classes: {},
};

export default CustomNetworkModal;
