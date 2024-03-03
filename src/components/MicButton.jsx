import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Fab, Tooltip } from "@mui/material";
import MicNoneIcon from "@mui/icons-material/MicNone";
import SettingsVoiceIcon from "@mui/icons-material/SettingsVoice";
import LockIcon from "@mui/icons-material/Lock";

export default function MicButton(props) {
  const [recording, setRecording] = React.useState(false);
  const [microphoneAccess, setMicrophoneAccess] = React.useState(true);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const mediaRecorder = React.useRef(null);
  const timeoutId = React.useRef(null);
  const timerId = React.useRef(null);

  React.useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "microphone",
        });
        if (permissionStatus.state === "granted") {
          setMicrophoneAccess(true);
        } else if (permissionStatus.state === "prompt") {
          setMicrophoneAccess(false);
        }
      } catch (error) {
        console.error("Error checking microphone permission:", error);
        setMicrophoneAccess(false);
      }
    };

    checkMicrophonePermission();
  }, []);

  const startRecording = () => {
    mediaRecorder.current = new window.webkitSpeechRecognition();
    mediaRecorder.current.lang = "en-US";
    mediaRecorder.current.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      console.log("Transcripted Text -", speechToText);
      props.setTypedText(speechToText);
      if (speechToText.trim()) {
        props.transcribe();
      } else {
        props.speakResponse("Sorry, I could not get you. please come again.");
      }
    };
    mediaRecorder.current.start();
    setRecording(true);
    timeoutId.current = setTimeout(stopRecording, 10000);
    timerId.current = setInterval(
      () => setElapsedTime((prev) => prev + 1),
      100
    );
    console.log("Recording...");

    // sending audio file for future use

    // navigator.mediaDevices
    //   .getUserMedia({ audio: true })
    //   .then((stream) => {
    //     setMicrophoneAccess(true);
    //     mediaRecorder.current = new MediaRecorder(stream);
    //     mediaRecorder.current.ondataavailable = props.handleAudioData;
    //     mediaRecorder.current.start();
    //     setRecording(true);
    //     timeoutId.current = setTimeout(stopRecording, 10000);
    //     timerId.current = setInterval(
    //       () => setElapsedTime((prev) => prev + 1),
    //       100
    //     );
    //     console.log("recoding");
    //   })
    //   .catch((err) => {
    //     console.error("Error accessing microphone:", err);
    //     setMicrophoneAccess(false);
    //   });
  };

  const enableMicrophoneAccess = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        setMicrophoneAccess(true);
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
        setMicrophoneAccess(false);
      });
  };

  const stopRecording = () => {
    if (mediaRecorder?.current) {
      mediaRecorder.current.stop();
    }
    setRecording(false);
    clearTimeout(timeoutId.current);
    clearInterval(timerId.current);
    setElapsedTime(0);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <CircularProgress
        variant="determinate"
        value={elapsedTime}
        style={{ height: "4rem", width: "4rem" }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!microphoneAccess ? (
          <Fab
            color="error"
            aria-label="mic-locked"
            onClick={enableMicrophoneAccess}
          >
            <LockIcon />
          </Fab>
        ) : (
          <Tooltip title="Hold to Speak">
            <Fab
              disabled={props.speaking}
              color={recording ? "warning" : "info"}
              aria-label="ask"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
            >
              {recording ? <SettingsVoiceIcon /> : <MicNoneIcon />}
            </Fab>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
