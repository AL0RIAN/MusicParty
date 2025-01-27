import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios"

export default function RoomJoinPage(props) {
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function handleTextFieldChange(e) {
        setRoomCode(e.target.value);
    }

    function enterRoom() {
        const requestData = {
            "code": roomCode,
        };

        axios.post("http://127.0.0.1:8000/api/room/join/", requestData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            navigate(`/room/${roomCode}`);
        })
        .catch((error) => {
            console.log(error)
            setError("Room Not Found");
        })
    }

    return (
        <Grid container spacing={1} flexDirection={"column"} alignItems={"center"}>
            <Grid size={{xs: 12}}>
                <Typography variant="h4" component="h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid size={{xs: 12}}>
                <TextField xs={12} 
                    error={true}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={roomCode}
                    helperText={error}
                    variant="outlined"
                    onChange={handleTextFieldChange}
                />
            </Grid>
            <Grid size={{xs: 12}}>
                <Button variant="contained" color="primary" onClick={enterRoom}>
                    Enter Room
                </Button>
            </Grid>
            <Grid size={{xs: 12}}>
                <Button variant="contained" color="secondary" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    )
}