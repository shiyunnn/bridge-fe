import React, { useState } from 'react';
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

function Editor({ onContentChange }: { onContentChange: (content: string) => void }) {
  const [markdown, setMarkdown] = useState<string>("");

  const editor = useCreateBlockNote();

  const onChange = async () => {
    const markdown = await editor.blocksToMarkdownLossy(editor.document);
    setMarkdown(markdown);
    onContentChange(markdown);
  };

  return (
    <Wrapper>
      <BlockNoteView editor={editor} onChange={onChange} theme="light" />
    </Wrapper>
  );
}

export default Editor;
