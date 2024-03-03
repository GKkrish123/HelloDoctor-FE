import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import maleNurse from "../assets/male-nurse.png";
import MicButton from "./MicButton";
import SpeakingLoader from "./SpeakingLoader";
import {
  cancelAppointment,
  getAvailableSlots,
  rescheduleAppointment,
  scheduleAppointment,
  transcribeData,
} from "../services";
import Emotion from "./Emotion";
import { CardHeader, Paper, TextField } from "@mui/material";

export default function Avatar(props) {
  const [speaking, setSpeaking] = React.useState(false);
  const [typedText, setTypedText] = React.useState("");
  const [audioChunks, setAudioChunks] = React.useState([]);

  React.useEffect(() => {
    speakResponse("Hi I'm Dr. Gokul's assistant. How can I help you?");
  }, []);

  const handleAudioData = async (event) => {
    if (event.data.size > 0) {
      setAudioChunks([...audioChunks, event.data]);
    }
    await transcribe();
  };

  const speakResponse = (response) => {
    props.setResponseText(response);
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const handleKeyDown = async (event) => {
    if (typedText.trim() && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await transcribe();
    }
  };

  const transcribe = async () => {
    try {
      const payloadSessionData = props.sessionData;
      let payloadAudioBlob = null;
      if (audioChunks.length === 0) {
        payloadSessionData.querytext = typedText;
      } else {
        payloadAudioBlob = new Blob(audioChunks, { type: "audio/wav" });
      }
      const data = await transcribeData(payloadAudioBlob, payloadSessionData);
      speakResponse(data.reply_text);
      props.setSessionData(data);
      localStorage.setItem("sessionData", JSON.stringify(data));
      const resSessionData = data;
      if (resSessionData.make_data_call) {
        let resData = {};
        if (resSessionData.main_intent === "book_appointment") {
          resData = await scheduleAppointment(resSessionData.data_call_payload);
          const modSessionData = {
            ...data,
            main_intent: "",
            appointmentid: resData.appointment_details.appointmentid,
          };
          props.setSessionData(modSessionData);
          localStorage.setItem("sessionData", JSON.stringify(modSessionData));
        } else if (resSessionData.main_intent === "cancel_appointment") {
          const appointmentid = resSessionData.appointmentid;
          resData = await cancelAppointment(appointmentid);
          const modSessionData = {
            ...data,
            main_intent: "",
            appointmentid: null,
          };
          props.setSessionData(modSessionData);
          localStorage.setItem("sessionData", JSON.stringify(modSessionData));
        } else if (resSessionData.main_intent === "reschedule_appointment") {
          const appointmentid = resSessionData.appointmentid;
          resData = await rescheduleAppointment(
            appointmentid,
            resSessionData.data_call_payload
          );
          const modSessionData = {
            ...data,
            main_intent: "",
            appointmentid: resData.appointment_details.appointmentid,
          };
          props.setSessionData(modSessionData);
          localStorage.setItem("sessionData", JSON.stringify(modSessionData));
        } else if (
          resSessionData.main_intent === "provide_availability" ||
          resSessionData.intent === "provide_availability"
        ) {
          resData = await getAvailableSlots(resSessionData.doctorid);
          const modSessionData = {
            ...data,
            slots_details: resData.slots_details,
          };
          if (resSessionData.main_intent === "provide_availability") {
            modSessionData.main_intent = "";
          }
          props.setSessionData(modSessionData);
          localStorage.setItem("sessionData", JSON.stringify(modSessionData));
        }
        speakResponse(resData.reply_text);
      }
    } catch {
      speakResponse(
        "There seems to be maintanence going on at our end. Please feel free to call our office directly with this number 808505404. Thanks!"
      );
    }
  };

  return (
    <Paper sx={{ padding: "0px 20px 20px 20px" }} elevation={5}>
      <Card sx={{ maxWidth: 345, padding: "0px 50px 0px 50px" }} elevation={0}>
        <CardHeader
          title="Dr. Gokul's Assistant"
          sx={{ maxWidth: 345, padding: "20px 0px" }}
        />
        <CardMedia
          component="img"
          alt="assistant"
          height="300"
          image={maleNurse}
        />
        <CardActions sx={{ padding: "20px 20px 0px 0px" }}>
          <Emotion intent={props.sessionData?.intent} />
          <SpeakingLoader speaking={speaking} />
        </CardActions>
        <CardActions sx={{ justifyContent: "center" }}>
          <MicButton
            handleAudioData={handleAudioData}
            speaking={speaking}
            setTypedText={setTypedText}
            speakResponse={speakResponse}
            transcribe={transcribe}
          />
        </CardActions>
      </Card>
      <TextField
        fullWidth
        value={typedText}
        onChange={(e) => setTypedText(e.target.value)}
        onKeyDown={handleKeyDown}
        label="Type and press Enter to ask"
        disabled={speaking}
      />
    </Paper>
  );
}
