import React, { useState } from "react";
import { ClickAwayListener, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import PropTypes from "prop-types";

function CopyButton({ copyText, fontSize }) {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleCopyEvent = () => {
    navigator.clipboard.writeText(copyText);
    setOpen(true);
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <Tooltip
          PopperProps={{
            disablePortal: true
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableTouchListener
          title="Copied"
        >
          <IconButton onClick={handleCopyEvent}>
            <ContentCopyIcon sx={{ fontSize: fontSize ?? "18px" }} />
          </IconButton>
        </Tooltip>
      </ClickAwayListener>
    </>
  );
}

export default CopyButton;

// CopyButton.propTypes = {
//   copyText: PropTypes.string,
//   fontSize: PropTypes.string
// };
