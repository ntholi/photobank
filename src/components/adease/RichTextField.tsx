import { ActionIcon, Box, Group, InputProps, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, RichTextEditor } from '@mantine/tiptap';
import '@mantine/tiptap/styles.css';
import { IconMaximize, IconMinimize } from '@tabler/icons-react';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';

type Props = {
  height?: number;
  defaultValue?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
} & InputProps;

export default function RichTextField(props: Props) {
  const [opened, { close, open }] = useDisclosure(false);
  const [content, setContent] = useState(
    props.value || props.defaultValue || ''
  );

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    props.onChange?.(newContent);
  };

  return (
    <Box>
      <style>
        {`
          .mantine-RichTextEditor-content img {
            max-height: 100px !important;
            height: auto !important;
            width: auto !important;
          }
        `}
      </style>
      <Modal
        opened={opened}
        onClose={close}
        size='100%'
        title={props.label || 'Rich Text Editor'}
        closeButtonProps={{
          icon: <IconMinimize />,
        }}
      >
        <RichTextComponent
          {...props}
          content={content}
          onContentChange={handleContentChange}
          height={window.innerHeight - 160}
        />
      </Modal>

      <Group justify='space-between' align='end'>
        <Text fw='bold'>{props.label}</Text>
        <ActionIcon variant='default' onClick={open}>
          <IconMaximize size={'1rem'} />
        </ActionIcon>
      </Group>
      <RichTextComponent
        {...props}
        content={content}
        onContentChange={handleContentChange}
      />
    </Box>
  );
}

type RichTextComponentProps = Props & {
  content: string;
  onContentChange: (newContent: string) => void;
};

function RichTextComponent(props: RichTextComponentProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: props.content,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== props.content) {
      editor.commands.setContent(props.content);
    }
  }, [editor, props.content]);

  editor?.on('update', () => {
    props.onContentChange(editor.getHTML());
  });

  return (
    <>
      <RichTextEditor mt={5} editor={editor} mih={props.height || 300}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </>
  );
}
