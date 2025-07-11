import React from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  min-height: 240px;
`;

function Editor() {
  const editor = useCreateBlockNote();

  editor.onChange((editor, { getChanges }) => {
    console.log('Editor updated');
    const changes = getChanges();
    console.log(changes);
  });

  return (
    <Wrapper>
      <BlockNoteView editor={editor} theme="light" />
    </Wrapper>
  );
}

export default Editor;
