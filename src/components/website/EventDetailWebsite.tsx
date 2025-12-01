import { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Modal } from '@mui/material';
import { Edit as EditIcon, Public as PublicIcon } from '@mui/icons-material';
import parse from 'html-react-parser';
import type { WebsitePayload, UpdateEventWebsiteDetailsPayload } from '../../types/eventTypes';
import EventWebsiteForm from './EventWebsiteForm';
import { getEventWebsiteUrl } from '../../utils/eventWebsiteUtils';

interface EventDetailWebsiteProps {
  eventWebsite: WebsitePayload | null | undefined;
  onUpdateEventWebsite: (websiteData: UpdateEventWebsiteDetailsPayload) => Promise<void>;
}

const EventDetailWebsite = ({
  eventWebsite,
  onUpdateEventWebsite,
}: EventDetailWebsiteProps) => {
  const [isWebsiteFormVisible, setIsWebsiteFormVisible] = useState(false);

  const handleOpenWebsiteForm = () => {
    setIsWebsiteFormVisible(true);
  };

  const handleCloseWebsiteForm = () => {
    setIsWebsiteFormVisible(false);
  };

  const handleWebsiteFormSubmit = async (websiteData: UpdateEventWebsiteDetailsPayload) => {
    try {
      await onUpdateEventWebsite(websiteData);
      handleCloseWebsiteForm();
    } catch (error) {
      console.error("Failed to update event website:", error);
      // Error handling will be done by the parent component
    }
  };

  const handleViewLiveWebsite = () => {
    if (eventWebsite?.customUrlSlug && eventWebsite.published) {
      const url = getEventWebsiteUrl(eventWebsite.customUrlSlug);
      window.open(url, '_blank');
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Event Website</Typography>
          <Box>
            {eventWebsite?.customUrlSlug && eventWebsite.published && (
              <IconButton onClick={handleViewLiveWebsite} color="primary" title="View Live Website">
                <PublicIcon />
              </IconButton>
            )}
            <IconButton onClick={handleOpenWebsiteForm} color="primary" title="Edit Website">
              <EditIcon />
            </IconButton>
          </Box>
        </Box>

        {eventWebsite?.title ? (
          <Box>
            {eventWebsite.headerImageUrl && (
              <Box
                component="img"
                src={eventWebsite.headerImageUrl}
                alt="Website Header"
                sx={{
                  width: '100%',
                  height: 180,
                  objectFit: 'cover',
                  borderRadius: 1,
                  mb: 2,
                }}
              />
            )}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Title: <Typography component="span">{eventWebsite.title}</Typography>
            </Typography>

            {eventWebsite.customUrlSlug && (
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                URL: <Typography component="span">{`/events/site/${eventWebsite.customUrlSlug}`}</Typography>
              </Typography>
            )}

            {eventWebsite.welcomeMessage && (
              <Box mt={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Welcome Message:
                </Typography>
                <Box sx={{ pl: 2, borderLeft: 3, borderColor: 'primary.main' }}>
                  {parse(eventWebsite.welcomeMessage)}
                </Box>
              </Box>
            )}

            <Typography variant="subtitle1" fontWeight="bold" mt={2} gutterBottom>
              Status: <Typography component="span">{eventWebsite.published ? 'Published' : 'Draft'}</Typography>
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
              {eventWebsite.sections?.length || 0} sections
            </Typography>

            {eventWebsite.sections?.map((section) => (
              <Box key={section.id} mt={2} p={2} bgcolor="background.paper" borderRadius={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {section.title}
                </Typography>
                <Box mt={1}>{parse(section.content)}</Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography color="textSecondary">No website details set up yet.</Typography>
        )}

        <Modal
          open={isWebsiteFormVisible}
          onClose={handleCloseWebsiteForm}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
            <EventWebsiteForm
              initialWebsiteData={eventWebsite ? {
                title: eventWebsite.title,
                customUrlSlug: eventWebsite.customUrlSlug,
                welcomeMessage: eventWebsite.welcomeMessage,
                sections: eventWebsite.sections,
                published: eventWebsite.published || false,
                websiteThemeId: eventWebsite.websiteThemeId,
                headerImageUrl: eventWebsite.headerImageUrl
              } : undefined}
              onSubmit={handleWebsiteFormSubmit}
              onCancel={handleCloseWebsiteForm}
            />
          </Box>
        </Modal>
      </CardContent>
    </Card>
  );
};

export default EventDetailWebsite;
