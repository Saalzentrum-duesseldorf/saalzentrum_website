import { Popover, Typography, Box } from "@mui/material";
import { CustomCalendarEvent } from "../CustomCalendar.tsx";

interface EventPopoverProps {
  event: CustomCalendarEvent | null;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const EventPopover = (props: EventPopoverProps) => {
  if (!props.event) return null; // Frühzeitiges Beenden, falls kein Event ausgewählt ist.

  return (
    <Popover
      id={props.open ? 'event-popover' : undefined}
      open={props.open}
      anchorEl={props.anchorEl}
      onClose={props.onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">{props.event.name}</Typography>
        {/* Füge hier weitere Eventdetails hinzu Start und end zeit */}
        <Typography variant="body2">
          {props.event.dateFrom?.toLocaleTimeString()} - {props.event.dateTo?.toLocaleTimeString()}

          <Typography variant="body2">{props.event.email}</Typography>
          <Typography variant="body2">{props.event.description}</Typography>

        </Typography>
      </Box>
    </Popover>
  );
};

export default EventPopover;
