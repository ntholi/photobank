import '@mantine/tiptap/styles.css';
import { ActionIcon, Box, Group, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, RichTextEditor } from '@mantine/tiptap';
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
  placeholder?: string;
  value?: any;
  onChange?: any;
  checked?: any;
  error?: any;
  onFocus?: any;
  onBlur?: any;
  disabled?: boolean;
  hidden?: boolean;
};

export default function RichTextField(props: Props) {
  const [opened, { close, open }] = useDisclosure(false);
  const [content, setContent] = useState(
    props.value || props.defaultValue || '',
  );

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    props.onChange?.(newContent);
  };

  return (
    <Box>
      <Modal
        opened={opened}
        onClose={close}
        size='100%'
        title={props.label}
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
        {props.label && <Text fw='bold'>{props.label}</Text>}
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
    <RichTextEditor mt={5} editor={editor} mih={props.height || 300}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
