import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Box, Toolbar, IconButton, Tooltip, Divider } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Title,
  Link as LinkIcon
} from '@mui/icons-material';

export interface RichTextEditorRef {
  setContent: (content: string) => void;
  getContent: () => string;
}

interface RichTextEditorProps {
  initialContent?: string;
  onChangeContent?: (text: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const RichTextEditor = ({
  initialContent = '',
  onChangeContent,
  placeholder = 'Start typing...',
  minHeight = 200,
}: RichTextEditorProps) => {
  const editorRef = useRef<RichTextEditorRef>({
    setContent: () => {},
    getContent: () => ''
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChangeContent?.(html);
    },
  });

  useEffect(() => {
    if (editor) {
      editorRef.current = {
        setContent: (content: string) => editor.commands.setContent(content),
        getContent: () => editor.getHTML()
      };
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const toggleFormat = (format: string) => {
    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline': {
        // TipTap doesn't have built-in underline, we use marks
        const attrs = { class: 'underline' };
        if (editor.isActive('textStyle', attrs)) {
          editor.chain().focus().unsetMark('textStyle').run();
        } else {
          editor.chain().focus().setMark('textStyle', attrs).run();
        }
        break;
      }
      case 'heading-one':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'bullet-list':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'ordered-list':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'align-left':
        editor.chain().focus().setTextAlign('left').run();
        break;
      case 'align-center':
        editor.chain().focus().setTextAlign('center').run();
        break;
      case 'align-right':
        editor.chain().focus().setTextAlign('right').run();
        break;
      case 'link': {
        const url = window.prompt('Enter URL');
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
        break;
      }
    }
  };

  const isActive = (format: string) => {
    switch (format) {
      case 'bold':
        return editor.isActive('bold');
      case 'italic':
        return editor.isActive('italic');
      case 'underline':
        return editor.isActive('textStyle', { class: 'underline' });
      case 'heading-one':
        return editor.isActive('heading', { level: 1 });
      case 'bullet-list':
        return editor.isActive('bulletList');
      case 'ordered-list':
        return editor.isActive('orderedList');
      case 'align-left':
        return editor.isActive({ textAlign: 'left' });
      case 'align-center':
        return editor.isActive({ textAlign: 'center' });
      case 'align-right':
        return editor.isActive({ textAlign: 'right' });
      case 'link':
        return editor.isActive('link');
      default:
        return false;
    }
  };

  const ToolbarButton = ({ format, icon: Icon, tooltip }: { format: string; icon: typeof FormatBold; tooltip: string }) => (
    <Tooltip title={tooltip}>
      <IconButton
        size="small"
        onClick={() => toggleFormat(format)}
        color={isActive(format) ? 'primary' : 'default'}
      >
        <Icon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  return (
    <Box
      sx={{
        minHeight,
        border: '1px solid hsl(var(--border))',
        borderRadius: '0.375rem',
        backgroundColor: 'hsl(var(--background))'
      }}
    >
      <Toolbar variant="dense" sx={{ borderBottom: '1px solid hsl(var(--border))', gap: 0.5 }}>
        <ToolbarButton format="bold" icon={FormatBold} tooltip="Bold" />
        <ToolbarButton format="italic" icon={FormatItalic} tooltip="Italic" />
        <ToolbarButton format="underline" icon={FormatUnderlined} tooltip="Underline" />
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        <ToolbarButton format="heading-one" icon={Title} tooltip="Heading 1" />
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        <ToolbarButton format="bullet-list" icon={FormatListBulleted} tooltip="Bullet List" />
        <ToolbarButton format="ordered-list" icon={FormatListNumbered} tooltip="Number List" />
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        <ToolbarButton format="align-left" icon={FormatAlignLeft} tooltip="Align Left" />
        <ToolbarButton format="align-center" icon={FormatAlignCenter} tooltip="Align Center" />
        <ToolbarButton format="align-right" icon={FormatAlignRight} tooltip="Align Right" />
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <ToolbarButton format="link" icon={LinkIcon} tooltip="Insert Link" />
      </Toolbar>

      <Box sx={{ p: 2 }}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default RichTextEditor;
