/* eslint-disable react/prop-types */
import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react';

import { Container, IpContent, Input, Error } from './styles';
import { GraphContext } from '~/context/GraphContext';
import { ipExist } from '~/helpers/deviceFactory';

const IpMaskInput = ({ onChange, value, error, setError, rangerAdd }) => {
  const { graph } = useContext(GraphContext);
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [field3, setField3] = useState('');
  const [field4, setField4] = useState('');
  const field1Ref = useRef(null);
  const field2Ref = useRef(null);
  const field3Ref = useRef(null);
  const field4Ref = useRef(null);
  const [finalValue, setFinalValue] = useState('');
  const [firstUpdateValue, setFirstUpdateValue] = useState(true);
  const [ipExistError, setIpExistError] = useState(false);

  const formatIp = (fieldValue1, fieldValue2, fieldValue3, fieldValue4) => {
    let valueIp = '';
    valueIp = `${fieldValue1}.`;

    valueIp = `${valueIp}${fieldValue2}.`;

    valueIp = `${valueIp}${fieldValue3}.`;

    valueIp = `${valueIp}${fieldValue4}`;

    return valueIp;
  };

  const validationIpValue = useCallback(
    (fieldValue1, fieldValue2, fieldValue3, fieldValue4) => {
      if (
        ipExist(
          `${fieldValue1}.${fieldValue2}.${fieldValue3}.${fieldValue4}`,
          graph
        )
      ) {
        setIpExistError(true);
        return true;
      }
      if (fieldValue1 && fieldValue2 && fieldValue3 && fieldValue4)
        return false;
      setIpExistError(false);

      return true;
    },
    [graph]
  );

  console.log();

  useEffect(() => {
    if (firstUpdateValue) {
      if (rangerAdd) {
        setField1('10');
        setField2('0');
        setField3('0');
        return;
      }
      if (value) {
        const values = value.split('.');
        setField1(values[0]);
        setField2(values[1]);
        setField3(values[2]);
        setField4(values[3]);
        setFirstUpdateValue((x) => !x);
      }
    }
  }, [firstUpdateValue, value, rangerAdd]);

  useEffect(() => {
    onChange(formatIp(field1, field2, field3, field4));
  }, [field1, field2, field3, field4, onChange]);

  useEffect(() => {
    const valid = validationIpValue(field1, field2, field3, field4);
    setError(valid);
  }, [field1, field2, field3, field4, setError, validationIpValue]);

  const validation = (fieldValue) => {
    if (Number(fieldValue) >= 0 && Number(fieldValue) <= 255) return true;
    return false;
  };

  const hadleChangeField1 = (event) => {
    const valueUpdate = event.target.value.trim().replace(/\D/g, '');
    if (validation(valueUpdate)) setField1(valueUpdate);
  };
  const hadleChangeField2 = (event) => {
    const valueUpdate = event.target.value.trim().replace(/\D/g, '');
    if (validation(valueUpdate)) setField2(valueUpdate);
  };
  const hadleChangeField3 = (event) => {
    const valueUpdate = event.target.value.trim().replace(/\D/g, '');
    if (validation(valueUpdate)) setField3(valueUpdate);
  };
  const hadleChangeField4 = (event) => {
    const valueUpdate = event.target.value.trim().replace(/\D/g, '');
    if (validation(valueUpdate)) setField4(valueUpdate);
  };
  const hadleKeyPressField1 = (event) => {
    if (event.key === 'Enter' && field1) field2Ref.current?.focus();
  };
  const hadleKeyPressField2 = (event) => {
    if (event.key === 'Backspace' && !field2) field1Ref.current?.focus();
    if (event.key === 'Enter' && field2) field3Ref.current?.focus();
  };
  const hadleKeyPressField3 = (event) => {
    if (event.key === 'Backspace' && !field3) field2Ref.current?.focus();
    if (event.key === 'Enter' && field3) field4Ref.current?.focus();
  };
  const hadleKeyPressField4 = (event) => {
    if (event.key === 'Backspace' && !field4) field3Ref.current?.focus();
    if (event.key === 'Enter' && field4)
      setFinalValue(`${field4}.${field4}.${field4}.${field4}`);
  };

  return (
    <Container>
      <h4>Ip</h4>
      <IpContent>
        <Input
          inputRef={field1Ref}
          autoFocus
          // margin="dense"
          id="api"
          type="text"
          value={field1}
          onChange={hadleChangeField1}
          autoComplete="off"
          aria-autocomplete="none"
          placeholder="0 - 255"
          inputProps={{ maxLength: 3 }}
          onKeyDown={hadleKeyPressField1}
          error={error}
          disabled={rangerAdd}
        />
        <span>.</span>
        <Input
          inputRef={field2Ref}
          // margin="dense"
          id="api"
          type="text"
          value={field2}
          onChange={hadleChangeField2}
          autoComplete="off"
          aria-autocomplete="none"
          placeholder="0 - 255"
          inputProps={{ maxLength: 3 }}
          onKeyDown={hadleKeyPressField2}
          error={error}
          disabled={rangerAdd}
        />
        <span>.</span>
        <Input
          inputRef={field3Ref}
          // margin="dense"
          id="api"
          type="text"
          value={field3}
          onChange={hadleChangeField3}
          autoComplete="off"
          aria-autocomplete="none"
          placeholder="0 - 255"
          inputProps={{ maxLength: 3 }}
          onKeyDown={hadleKeyPressField3}
          error={error}
          disabled={rangerAdd}
        />
        <span>.</span>
        <Input
          inputRef={field4Ref}
          // margin="dense"
          id="api"
          type="text"
          value={field4}
          onChange={hadleChangeField4}
          autoComplete="off"
          aria-autocomplete="none"
          placeholder="0 - 255"
          inputProps={{ maxLength: 3 }}
          onKeyDown={hadleKeyPressField4}
          error={error}
        />
      </IpContent>
      {ipExistError && <Error>Ip already exists</Error>}
    </Container>
  );
};

export default IpMaskInput;
