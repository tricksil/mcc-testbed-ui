import PropTypes from 'prop-types';
import { useState, forwardRef, useImperativeHandle, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { GraphContext } from '~/context/GraphContext';
import CustomNetworkModal from '../CustomNetworkModal';
import { useNodeTitle } from './hooks';

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

  const title = useNodeTitle(data);

  return (
    <>
      {open && (
        <CustomNetworkModal
          open={open}
          classes={classes}
          title={`Are you sure you want to remove these ${title}`}
          titleCancel="Cancel"
          titleSubmit={title}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
        />
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
