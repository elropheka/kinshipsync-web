import { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box, Switch, FormControlLabel } from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { WebsitePayload, UpdateEventWebsiteDetailsPayload, EventWebsiteSection } from '../../types/eventTypes';
import RichTextEditor from '../common/RichTextEditor';
import { useAppTheme } from '../../hooks/useAppTheme';

interface EventWebsiteFormProps {
  initialWebsiteData?: WebsitePayload;
  onSubmit: (websiteData: UpdateEventWebsiteDetailsPayload) => Promise<void>;
  onCancel: () => void;
}

interface SortableSectionProps {
  section: EventWebsiteSection;
  index: number;
  onRemove: (index: number) => void;
  onSectionChange: (index: number, field: keyof EventWebsiteSection, value: string) => void;
}

const SortableSection = ({ section, index, onRemove, onSectionChange }: SortableSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{ mb: 2, p: 2, cursor: 'grab' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Section {index + 1}</Typography>
        <Button
          color="error"
          onClick={() => onRemove(index)}
        >
          Remove
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Section Title"
        value={section.title}
        onChange={(e) => onSectionChange(index, 'title', e.target.value)}
        margin="normal"
      />

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Content
        </Typography>
        <RichTextEditor
          initialContent={section.content}
          onChangeContent={(content) => onSectionChange(index, 'content', content)}
          placeholder="Enter content for this section..."
          minHeight={200}
        />
      </Box>
    </Card>
  );
};

const EventWebsiteForm = ({
  initialWebsiteData,
  onSubmit,
  onCancel,
}: EventWebsiteFormProps) => {
  const [title, setTitle] = useState(initialWebsiteData?.title || '');
  const [customUrlSlug, setCustomUrlSlug] = useState(initialWebsiteData?.customUrlSlug || '');
  const [welcomeMessage, setWelcomeMessage] = useState(initialWebsiteData?.welcomeMessage || '');
  const [sections, setSections] = useState(initialWebsiteData?.sections || []);
  const [published, setPublished] = useState(initialWebsiteData?.published || false);
  const { currentTheme } = useAppTheme();
  const [selectedWebsiteThemeId] = useState<string>(
    initialWebsiteData?.websiteThemeId || currentTheme.id || 'default'
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpdateEventWebsiteDetailsPayload = {
      sections: sections.map((s, index) => ({ ...s, order: index })),
      websiteThemeId: selectedWebsiteThemeId,
      published,
    };

    // Only include title if it's not empty
    if (title.trim()) {
      payload.title = title.trim();
    }
    if (customUrlSlug && customUrlSlug.trim()) {
      payload.customUrlSlug = customUrlSlug.trim();
    }
    if (welcomeMessage.trim()) {
      payload.welcomeMessage = welcomeMessage.trim();
    }

    await onSubmit(payload);
  };

  const addSection = () => {
    const newSectionId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setSections([...sections, { id: newSectionId, title: '', content: '', order: sections.length }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index: number, field: keyof typeof sections[0], value: string) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setSections(updatedSections);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Website Details
          </Typography>
          
          <TextField
            fullWidth
            label="Website Title (Optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            helperText="Leave empty if you don't want to create a website"
          />

          <TextField
            fullWidth
            label="Custom URL Slug (Optional)"
            value={customUrlSlug}
            onChange={(e) => setCustomUrlSlug(e.target.value)}
            helperText="e.g., my-event-2025"
            margin="normal"
          />

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Welcome Message (Optional)
            </Typography>
            <RichTextEditor
              initialContent={welcomeMessage}
              onChangeContent={setWelcomeMessage}
              placeholder="Welcome to our event! We're so excited to celebrate with you."
              minHeight={150}
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
            }
            label={published ? "Published (Visible to Public)" : "Draft (Not Visible)"}
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Website Sections</Typography>
            <Button variant="outlined" onClick={addSection}>
              Add Section
            </Button>
          </Box>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {sections.map((section, index) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  index={index}
                  onRemove={removeSection}
                  onSectionChange={handleSectionChange}
                />
              ))}
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" type="submit">
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EventWebsiteForm;
