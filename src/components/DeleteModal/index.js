/* eslint-disable no-nested-ternary */
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

  const textSubmit = useMemo(() => {
    if (Object.keys(data).length === 0) {
      return 'delete nodes and edges';
    }
    const node = data?.dataNode?.nodes && 'node';
    const end =
      data?.dataNode?.nodes && data?.dataNode?.edges?.length > 0 ? 'end' : '';
    const edges =
      data?.dataNode?.edges?.length === 1
        ? 'edge'
        : data?.dataNode?.edges?.length > 1
        ? 'edges'
        : '';
    return `${data.action} ${node} ${end} ${edges}`;
  }, [data]);

  console.log(data);
  const title = useMemo(() => {
    if (Object.keys(data).length === 0) {
      return 'nodes and edges';
    }
    const node = data?.dataNode?.nodes && 'node';
    const end =
      data?.dataNode?.nodes && data?.dataNode?.edges?.length > 0 ? 'end' : '';
    const edges =
      data?.dataNode?.edges?.length === 1
        ? 'link'
        : data?.dataNode?.edges?.length > 1
        ? 'links'
        : '';
    return `${data.action} ${node} ${end} ${edges}`;
  }, [data]);

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
            Are you sure you want to remove these {title}?
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
