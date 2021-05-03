/* eslint-disable func-names */
import PropTypes from 'prop-types';
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
  useMemo,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import { GraphContext } from '~/context/GraphContext';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const DeleteModal = forwardRef(({ data, removeData }, ref) => {
  const { removeNodeOrEdges } = useContext(GraphContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen((x) => !x);
    },
    close: () => {
      setOpen((x) => !x);
    },
  }));

  const handleClose = () => {
    removeData();
    setOpen((x) => !x);
  };

  function clearStates() {
    setOpen((x) => !x);
  }

  function handleSubmit() {
    const { dataNode } = data;
    removeNodeOrEdges(dataNode.nodes)(dataNode.edges);
    clearStates();
  }

  const textSubmit = useMemo(
    () =>
      `${data.action} ${data?.dataNode?.nodes && 'node'} ${
        data?.dataNode?.nodes && data?.dataNode?.edges?.length > 0 ? 'end' : ''
      } ${data?.dataNode?.edges?.length > 0 ? 'edges' : ''}`,
    [data.action, data?.dataNode?.edges?.length, data?.dataNode?.nodes]
  );

  return (
    <>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="customized-dialog-title" className={classes.title}>
            Are you sure you want to remove these nodes and links?
          </DialogTitle>
          <DialogContent />
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {textSubmit}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
});

DeleteModal.displayName = 'DeleteModal';

DeleteModal.propTypes = {
  removeData: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default DeleteModal;
