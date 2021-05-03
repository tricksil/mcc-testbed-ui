import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import MuiSnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';

import { amber, green } from '@material-ui/core/colors';

import WarningIcon from '@material-ui/icons/Warning';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';

const variantIcon = {
  error: ErrorIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

const useStyles = makeStyles((theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    paddingRight: 10,
  },
  btnPosition: {
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 2,
  },
}));

export default function SnackbarContentWrapper(props) {
  const classes = useStyles();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <MuiSnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <CloseIcon
          className={clsx(classes.icon, classes.btnPosition)}
          key="close"
          aria-label="close"
          color="inherit"
          onClick={onClose}
        />,
      ]}
      {...other}
    />
  );
}

SnackbarContentWrapper.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  variant: PropTypes.string.isRequired,
  className: PropTypes.string,
};

SnackbarContentWrapper.defaultProps = {
  className: '',
};
