import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";

const TypingText = ({ text, delay }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.substring(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [text, delay]);

  return <Typography variant="body1">{displayText}</Typography>;
};

export default TypingText;
