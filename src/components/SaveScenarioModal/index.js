/* eslint-disable consistent-return */
import { useState, forwardRef, useImperativeHandle, useContext } from 'react';

import scenarioApi from '~/services/scenario';

import { ApiContext } from '~/context/ApiContext';
import { GraphContext } from '~/context/GraphContext';
import { SnackbarContext } from '~/context/SnackContext';
import { ScenarioContext } from '~/context/ScenarioContext';
import CustomNetworkModal from '../CustomNetworkModal';

const SaveScenarioModal = forwardRef((props, ref) => {
  const { graph, convertionalScenery } = useContext(GraphContext);
  const { name } = useContext(ScenarioContext);
  const { snackBarOpen } = useContext(SnackbarContext);
  const { ip } = useContext(ApiContext);
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
    setOpen((x) => !x);
  };

  async function handleSuccess() {
    if (graph?.nodes.length === 0) {
      snackBarOpen('Scenario not be void!', 'error');
      return;
    }
    const scenerioTestbed = convertionalScenery(graph);
    try {
      snackBarOpen('Loading Scenery', 'info');
      const { data } = await scenarioApi.saveScenario(
        ip,
        name,
        scenerioTestbed
      );
      if (data.code === 400) {
        snackBarOpen(data.message, 'error');
      } else {
        snackBarOpen(data.message, 'success');
      }
    } catch (error) {
      snackBarOpen('Erro', 'error');
    } finally {
      setOpen((x) => !x);
    }
  }

  return (
    <>
      {open && (
        <CustomNetworkModal
          open={open}
          title={`Do you want to save the ${name} scenario?`}
          titleCancel="Cancel"
          titleSubmit="Save"
          handleClose={handleClose}
          handleSubmit={handleSuccess}
        />
      )}
    </>
  );
});

SaveScenarioModal.displayName = 'SaveScenarioModal';

export default SaveScenarioModal;
