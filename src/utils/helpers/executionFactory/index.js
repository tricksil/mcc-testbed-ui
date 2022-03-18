const createElement = (aux) =>
  aux.reduce((previusLog, currentLog) => {
    const {
      executionCpuTime,
      uploadTime,
      donwloadTime,
      uploadSize,
      downloadSize,
    } = currentLog.log
      .substring(
        currentLog.log.indexOf('[') + 1,
        currentLog.log.indexOf(']') - 1
      )
      .split(', ')
      .reduce((previusElement, currentElement) => {
        const variables = currentElement.split('=');
        if (variables[0] === 'currentTimeMillis') return previusElement;
        previusElement[`${variables[0]}`] = Number(variables[1]);
        return previusElement;
      }, {});
    previusLog.push({
      execution_number: currentLog.execution_number,
      executionCpuTime,
      uploadTime,
      donwloadTime,
      uploadSize,
      downloadSize,
    });
    return previusLog;
  }, []);

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const removeChars = (text, symbols) =>
  text.substring(text.indexOf(symbols) + 1);

const createExecutionLogs = (logsMocks) => {
  let logsAux = logsMocks;
  const logs = [];
  while (logsAux.length > 0) {
    const firstElement = logsAux[0];
    const aux = logsAux.filter(
      (element) => element.device_name === firstElement.device_name
    );
    logsAux = logsAux.filter(
      (element) => element.device_name !== firstElement.device_name
    );
    const element = {
      device_name: capitalize(removeChars(aux[0].device_name, '.')),
      logs: createElement(aux),
    };
    logs.push(element);
  }
  return logs;
};

export { createExecutionLogs };
