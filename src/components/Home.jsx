import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Paper from "@mui/material/Paper";
import {
  Stack,
  Avatar as AvatarIcon,
  CardHeader,
  Tooltip,
} from "@mui/material";
import Avatar from "./Avatar";
import TypingText from "./TypingText";
import helloDoctorIcon from "../assets/hello-doctor.png";
import RecyclingIcon from "@mui/icons-material/Recycling";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const DisplayPaper = styled(Paper)(({ theme }) => ({
  width: "30%",
  height: 400,
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: "center",
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Home() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [responseText, setResponseText] = React.useState("");
  const [sessionData, setSessionData] = React.useState({});

  React.useEffect(() => {
    const storedSessionData = localStorage.getItem("sessionData");
    if (storedSessionData) {
      setSessionData(JSON.parse(storedSessionData));
    }
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} color="transparent">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <AvatarIcon
            style={{ width: "auto", borderRadius: "0px" }}
            alt="Hello Doctor"
            src={helloDoctorIcon}
          />
          <Typography variant="h6" noWrap component="div">
            Hello Doctor
          </Typography>
          <Tooltip title="Clear cache">
            <IconButton
              color="error"
              aria-label="clear cache"
              onClick={() =>
                localStorage.setItem("sessionData", JSON.stringify({}))
              }
              sx={{ marginLeft: "auto" }}
              edge="end"
            >
              <RecyclingIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography variant="h6">Available Doctors</Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["Dr. Gokul"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Stack
          width="100%"
          direction="row"
          justifyContent="center"
          alignItems="center"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={5}
        >
          <Avatar
            responseText={responseText}
            sessionData={sessionData}
            setResponseText={setResponseText}
            setSessionData={setSessionData}
          />
          <DisplayPaper square={false} elevation={5}>
            <CardHeader title="Display Window" />
            <TypingText text={responseText} delay={50} />
          </DisplayPaper>
        </Stack>
      </Main>
    </Box>
  );
}
