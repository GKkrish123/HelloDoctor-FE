import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import EditNoteIcon from "@mui/icons-material/EditNote";

export default function Emotion({ intent }) {
  if (!intent || intent === "greet") {
    return <SentimentSatisfiedAltIcon fontSize="large" />;
  } else if (intent === "deny") {
    return <SentimentDissatisfiedIcon fontSize="large" />;
  } else if (intent === "affirm") {
    return <ThumbUpOffAltIcon fontSize="large" />;
  }
  return <EditNoteIcon fontSize="large" />;
}
