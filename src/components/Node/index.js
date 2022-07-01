import PropTypes from 'prop-types';
import {
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
} from '@material-ui/core';

import IpMaskInput from '../IpMaskInput';

import phone from '~/assets/phone.svg';
import server from '~/assets/server.svg';
import loadBalance from '~/assets/load_balance.svg';
import switchDevice from '~/assets/switch.svg';

function Node({
  device,
  handleChangeDevice,
  data,
  deviceError,
  name,
  handleChangeName,
  nameError,
  setIp,
  ip,
  ipError,
  setIpError,
  ipCache,
  edit = false,
  checked,
  toggleChecked,
  quantity,
  handleChangeQuantity,
  quantityError,
  deviceChecked,
  handleChangeDeviceCheck,
  deviceCheckedError,
  delayRandom,
  handleChangeDelayRandom,
  delayRandomError,
  jitterRandom,
  handleChangeJitterRandom,
  jitterRandomError,
  bandwidthRandom,
  handleChangeBandwidthRandom,
  bandwidthRandomError,
}) {
  function renderCheckedRandom() {
    return (
      <>
        <h3>Node</h3>
        <TextField
          margin="dense"
          id="quantity"
          label="Quantity"
          fullWidth
          value={quantity}
          onChange={handleChangeQuantity}
          autoComplete="off"
          aria-autocomplete="none"
          error={quantityError}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="type">Type</InputLabel>
          <Select
            labelId="type"
            id="type"
            value={deviceChecked}
            onChange={handleChangeDeviceCheck}
            fullWidth
            error={deviceCheckedError}
          >
            <MenuItem value={switchDevice}>Switch</MenuItem>
            <MenuItem value={phone}>Smartphone</MenuItem>
            <MenuItem value={server}>Server</MenuItem>
          </Select>
        </FormControl>
        <h3>Edge</h3>
        <TextField
          margin="dense"
          id="delayRandom"
          label="Delay(ms)"
          type="text"
          fullWidth
          value={delayRandom}
          onChange={handleChangeDelayRandom}
          autoComplete="off"
          aria-autocomplete="none"
          error={delayRandomError}
        />
        <TextField
          margin="dense"
          id="jitterRandom"
          label="Jitter(ms)"
          type="text"
          fullWidth
          value={jitterRandom}
          onChange={handleChangeJitterRandom}
          autoComplete="off"
          aria-autocomplete="none"
          error={jitterRandomError}
        />
        <TextField
          margin="dense"
          id="bandwidthRandom"
          label="Bandwidth"
          type="text"
          fullWidth
          value={bandwidthRandom}
          onChange={handleChangeBandwidthRandom}
          autoComplete="off"
          aria-autocomplete="none"
          error={bandwidthRandomError}
        />
      </>
    );
  }

  function renderNodeOptions() {
    return (
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
          error={nameError}
        />
        <IpMaskInput
          onChange={setIp}
          value={ip}
          error={ipError}
          setError={setIpError}
          block={edit}
          rangerAdd={!edit}
          ipCache={ipCache}
        />
      </>
    );
  }
  return (
    <>
      <FormControl fullWidth margin="dense">
        <InputLabel id="type">Type</InputLabel>
        <Select
          labelId="type"
          id="type"
          value={device}
          onChange={handleChangeDevice}
          fullWidth
          disabled={edit}
          error={deviceError}
        >
          <MenuItem value={phone}>Smartphone</MenuItem>
          <MenuItem value={switchDevice}>Switch</MenuItem>
          <MenuItem value={server}>Server</MenuItem>
          <MenuItem value={loadBalance}>Load Balance</MenuItem>
        </Select>
      </FormControl>

      {device && device !== switchDevice && renderNodeOptions()}
      {edit && data.dataNode.type !== 'client' && (
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                size="medium"
                checked={checked}
                onChange={toggleChecked}
              />
            }
            label="add nodes"
            labelPlacement="start"
          />
        </FormGroup>
      )}
      {edit && checked && renderCheckedRandom()}
    </>
  );
}

Node.propTypes = {
  name: PropTypes.string.isRequired,
  handleChangeName: PropTypes.func.isRequired,
  nameError: PropTypes.bool.isRequired,
  device: PropTypes.string.isRequired,
  handleChangeDevice: PropTypes.func,
  deviceError: PropTypes.bool,
  setIp: PropTypes.func.isRequired,
  ip: PropTypes.string.isRequired,
  ipCache: PropTypes.string,
  ipError: PropTypes.bool.isRequired,
  setIpError: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object]).isRequired,
  edit: PropTypes.bool,
  checked: PropTypes.bool,
  toggleChecked: PropTypes.func,
  quantity: PropTypes.string,
  handleChangeQuantity: PropTypes.func,
  quantityError: PropTypes.bool,
  deviceChecked: PropTypes.string,
  handleChangeDeviceCheck: PropTypes.func,
  deviceCheckedError: PropTypes.bool,
  delayRandom: PropTypes.string,
  handleChangeDelayRandom: PropTypes.func,
  delayRandomError: PropTypes.bool,
  jitterRandom: PropTypes.string,
  handleChangeJitterRandom: PropTypes.func,
  jitterRandomError: PropTypes.bool,
  bandwidthRandom: PropTypes.string,
  handleChangeBandwidthRandom: PropTypes.func,
  bandwidthRandomError: PropTypes.bool,
};

Node.defaultProps = {
  edit: false,
  handleChangeDevice: () => {},
  deviceError: false,
  ipCache: '',
  checked: false,
  toggleChecked: () => {},
  quantity: '',
  handleChangeQuantity: () => {},
  quantityError: false,
  deviceChecked: '',
  handleChangeDeviceCheck: () => {},
  deviceCheckedError: false,
  delayRandom: '',
  handleChangeDelayRandom: () => {},
  delayRandomError: false,
  jitterRandom: '',
  handleChangeJitterRandom: () => {},
  jitterRandomError: false,
  bandwidthRandom: '',
  handleChangeBandwidthRandom: () => {},
  bandwidthRandomError: false,
};

export default Node;
