import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText"
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import { Link } from "react-router-dom";
import { RadioGroup } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function CreateRoomPage({ 
    defaultVotes = 2,
    defaultGuestCanPause = true, 
    update = false,
    roomCode = null,
    updateCallback = () => { }
}) {
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
    const [guestCanPause, setGuestCanPause] = useState(defaultGuestCanPause);
    const [message, setMessage] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const navigate = useNavigate();

    function handleVotesChange(e) {
        setVotesToSkip(e.target.value);
    }

    function handleGuestCanPauseChange(e) {
        setGuestCanPause(e.target.value);
    }

    function renderCreateButtons() {
        return (
            <Grid container flexDirection="row">
                <Grid size={{ xs: 12 }} align="center">
                    <Button color="primary" variant="contained" onClick={handleCreateRoomButton}>
                        Create A Room
                    </Button>
                </Grid>
                <Grid size={{ xs: 12 }} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        )
    }

    function renderUpdateButtons() {
        return (
            <>
                <Grid size={{ xs: 12 }} align="center"> 
                        <Button color="primary" variant="contained" onClick={handleUpdateRoomButton}>
                            Update
                        </Button>
                </Grid>
            </>
        )
    }
 
    function handleCreateRoomButton() {
        const requestData = {
            votes_to_skip: votesToSkip,
            guest_can_pause: guestCanPause,
        };
    
        axios.post("http://127.0.0.1:8000/api/room/create/", requestData, { 
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true 
        })
        .then((response) => {
            navigate(`/room/${response.data.code}/`);
        })
        .catch((error) => {
            console.error("Room creating error:", error);
        });
    }

    function handleUpdateRoomButton() {
        const requestData = {
            votes_to_skip: votesToSkip,
            guest_can_pause: guestCanPause,
            code: roomCode
        };
    
        axios.patch("http://127.0.0.1:8000/api/room/update/", requestData, { 
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true 
        })
        .then((response) => {
            setMessage("Room updated successfully!");
            updateCallback();
        })
        .catch((error) => {
            setErrMessage("Room updating error");
        });
    }

    function checkMessage() {
        if (message == "Room updated successfully!") {
            return (<Alert severity="success" onClose={() => setMessage("")}>{message}</Alert>)
        }

        if (errMessage.includes("Room updating error:")) {
            return (<Alert severity="error" onClose={() => setErrMessage("")}>{errMessage}</Alert>)
        }
    }

    const title = update ? "Update a Room" : "Create a Room"

    return (
        <>
            <Grid container spacing={1} justifyContent="center">
                <Grid xs={12} alignItems="center">
                    <Collapse in={message != "" || errMessage != ""}>
                        {checkMessage()}
                        {/* {message == "Room updated successfully!" && !message.includes("Room updating error:") ? (
                            <Alert severity="success" onClose={() => setMessage("")}>{message}</Alert>
                        ) : (
                            <Alert severity="error" onClose={() => setErrMessage("")}>{errMessage}</Alert>
                        )} */}
                    </Collapse>
                </Grid>
                <Grid size={{ xs: 12 }} align="center">
                    <Typography fontWeight="bold" color="#fff" component="h4" variant="h4">
                        { title }
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText sx={{color: "rgba(255, 255, 255, .7)"}}>
                            <div align="center">
                                Guest Control Of Playback State
                            </div>
                        </FormHelperText>
                        <RadioGroup row defaultValue={true} onChange={handleGuestCanPauseChange}>
                            <FormControlLabel
                                value={true}
                                control={<Radio color="primary" sx={{color: "#fff"}}/>}
                                label="Play/Pause"
                                labelPlacement="bottom"
                                sx={{
                                    "& .MuiFormControlLabel-label": {
                                        color: "#fff"
                                    }
                                }}
                            />
                            <FormControlLabel
                                value={false}
                                control={<Radio color="primary" sx={{color: "#fff"}}/>}
                                label="No Control"
                                labelPlacement="bottom"
                                sx={{
                                    "& .MuiFormControlLabel-label": {
                                        color: "#fff"
                                    }
                                }}
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }} align="center">
                    <FormControl>
                        <TextField
                            required={true}
                            type="number"
                            onChange={handleVotesChange}
                            defaultValue={defaultVotes}
                            slotProps={{
                                htmlInput: {
                                    min: 1,
                                    style: { "textAlign": "center", "color": "#fff"},
                                } 
                            }}
                            focused 
                        />
                        <FormHelperText sx={{color: "rgba(255, 255, 255, .7)"}}>
                            <div align="center">
                                Votes Required To Skip Song
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>
            {update ? renderUpdateButtons() : renderCreateButtons()}
        </>
    );
}