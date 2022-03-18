import { createContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

export const ScenarioContext = createContext({});
let time;

export function ScenarioProvider({ children }) {
  const [isExecute, setExecute] = useState(false);
  const [name, onChangeName] = useState('');
  const [execApkStatus, setExecApkStatus] = useState('');
  const [countupExecuteTime, setCountupExecuteTime] = useState(0);

  useEffect(() => {
    const nameSave = async () => {
      const getName = await JSON.parse(localStorage.getItem('name'));
      onChangeName(getName);
    };
    nameSave();
  }, []);

  const isDisableBecauseExecApp = useMemo(() => {
    switch (execApkStatus) {
      case 'EXECUTING':
        return true;

      default:
        return false;
    }
  }, [execApkStatus]);

  useEffect(() => {
    time = setInterval(() => {
      setCountupExecuteTime((prev) => prev + 1);
    }, 1000);
    if (execApkStatus !== 'EXECUTING') {
      console.log(`${countupExecuteTime}s`);
      setCountupExecuteTime(0);
      clearInterval(time);
    }

    return () => clearInterval(time);
  }, [countupExecuteTime, execApkStatus]);

  const cleanScenarioStates = () => {
    onChangeName('');
    setExecApkStatus('');
    setCountupExecuteTime(0);
    setExecute(false);
  };

  return (
    <ScenarioContext.Provider
      value={{
        isExecute,
        setExecute,
        name,
        onChangeName,
        execApkStatus,
        setExecApkStatus,
        isDisableBecauseExecApp,
        cleanScenarioStates,
      }}
    >
      {children}
    </ScenarioContext.Provider>
  );
}

ScenarioProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
