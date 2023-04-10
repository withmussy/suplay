import React, {useEffect, useState} from 'react';
import {Modal, Button, Alert} from 'antd';
import styled from 'styled-components';

interface PropsType {
  show: boolean;
  word: string;
  onResume: () => void;
}

const DefinitionBase = {
  definition: '',
  keyText: '',
};

const WordDefinition = (props: PropsType) => {
  const {show, word, onResume} = props;

  const [DefinitionResult, setDefinitionResult] =
    useState<typeof DefinitionBase>(DefinitionBase);

  useEffect(() => {
    if (show && word.length !== 0) getDefinition();
  }, [show]);

  const getDefinition = () => {
    // ipcRenderer.send('search', word);
    // ipcRenderer.on('search-reply', (event, res) => {
    //   setDefinitionResult(res)
    // });
  };

  const handleCancel = () => {
    onResume();
  };

  const {definition, keyText} = DefinitionResult;

  return (
    <Modal
      title="Word Definition"
      footer={null}
      onCancel={handleCancel}
      visible={show}>
      {definition.length !== 0 && keyText !== word && (
        <StyledAlert type="error" message="not match but similar" />
      )}
      {definition.length !== 0 ? (
        <Wrapper dangerouslySetInnerHTML={{__html: definition}} />
      ) : (
        <StyledAlert message="404- not found" type="error" />
      )}
    </Modal>
  );
};

export default WordDefinition;

const Wrapper = styled.div`
  * {
    font-family: VazirLight !important;
  }
`;

const StyledAlert = styled(Alert)`
  font-size: 20px;
  margin-bottom: 10px;
  text-align: center;
  font-family: VazirBold;
`;
