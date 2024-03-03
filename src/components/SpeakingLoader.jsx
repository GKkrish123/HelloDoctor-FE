import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export default function SpeakingLoader(props) {
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);
  const progressRef = React.useRef(() => {});

  React.useEffect(() => {
    if (props.speaking) {
      progressRef.current = () => {
        if (progress > 50) {
          setProgress(Math.random() * 100);
          setBuffer(Math.random() * 100);
        } else {
          const diff = Math.random() * 10;
          const diff2 = Math.random() * 10;
          setProgress(progress + diff);
          setBuffer(progress + diff + diff2);
        }
      };
    }
  });

  React.useEffect(() => {
    if (props.speaking) {
      const timer = setInterval(() => {
        progressRef.current();
      }, 500);

      return () => {
        clearInterval(timer);
      };
    } else {
      setProgress(100);
      setBuffer(100);
    }
  }, [props.speaking]);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
    </Box>
  );
}
