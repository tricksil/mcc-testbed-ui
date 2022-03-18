import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

const Edge = ({
  name,
  handleChangeName,
  delay,
  handleChangeDelay,
  delayError,
  jitter,
  handleChangeJitter,
  jitterError,
  bandwidth,
  handleChangeBandwidth,
  bandwidthError,
}) => (
  <>
    <TextField
      autoFocus
      margin="dense"
      id="name"
      label="Name"
      type="text"
      fullWidth
      value={name}
      onChange={handleChangeName}
      autoComplete="off"
      aria-autocomplete="none"
    />
    <TextField
      margin="dense"
      id="delay"
      label="Delay(ms)"
      type="text"
      fullWidth
      value={delay}
      onChange={handleChangeDelay}
      autoComplete="off"
      aria-autocomplete="none"
      error={delayError}
    />
    <TextField
      margin="dense"
      id="jitter"
      label="Jitter(ms)"
      type="text"
      fullWidth
      value={jitter}
      onChange={handleChangeJitter}
      autoComplete="off"
      aria-autocomplete="none"
      error={jitterError}
    />
    <TextField
      margin="dense"
      id="bandwidth"
      label="Bandwidth"
      type="text"
      fullWidth
      value={bandwidth}
      onChange={handleChangeBandwidth}
      autoComplete="off"
      aria-autocomplete="none"
      error={bandwidthError}
    />
  </>
);

Edge.propTypes = {
  name: PropTypes.string,
  handleChangeName: PropTypes.func.isRequired,
  delay: PropTypes.string.isRequired,
  handleChangeDelay: PropTypes.func.isRequired,
  delayError: PropTypes.bool.isRequired,
  jitter: PropTypes.string.isRequired,
  handleChangeJitter: PropTypes.func.isRequired,
  jitterError: PropTypes.bool.isRequired,
  bandwidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  handleChangeBandwidth: PropTypes.func.isRequired,
  bandwidthError: PropTypes.bool.isRequired,
};

Edge.defaultProps = {
  name: '',
};

export default Edge;
