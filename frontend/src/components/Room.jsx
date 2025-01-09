import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";


export default function Room(props) {
    const [roomData, setRoomData] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [error, setError] = useState(null);
    const [showSetings, setShowSettings] = useState(null);
    const navigate = useNavigate();

    const { roomCode } = useParams();

    function leaveRoom() {
        axios.post("http://127.0.0.1:8000/api/room/leave/", {
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(() => {
            props.clearRoomCodeCallback();
            navigate("/");
        })
        
    }

    function updateShowSettings(value) {
        setShowSettings(value);
    }

    function renderSettingsButton() {
        return (
            <Grid xs={12} alignItems="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => updateShowSettings(true)}
                >
                    Settings
                </Button>
            </Grid>
        )
    }

    function renderSettings() {
        return (
            <Grid container spacing={1} justifyContent="center">
                <Grid xs={12} alignItems="center">
                    <CreateRoomPage 
                        update={true}
                        votesToSkip={roomData.votes_to_skip}
                        guestCanPause={roomData.guest_can_pause}
                        roomCode={roomCode}
                        updateCallback={getRoomData}
                    />
                </Grid>
                <Grid xs={12} alignItems="center">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => updateShowSettings(false)}
                    >
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    }
    
    const getRoomData = async () => {
        try {
            console.log("DEBUG")
            const room_data = await axios.get(`http://127.0.0.1:8000/api/room/${roomCode}/`);
            setRoomData(room_data.data);
            const host_check = await axios.get(`http://127.0.0.1:8000/api/room/check_host/${room_data.data.id}/`);
            setIsHost(host_check.data);
        } catch (err) {
            setError(err.room_data?.data?.error || "Error fetching room data");
            props.clearRoomCodeCallback();
            navigate("/");
        }
    }

    useEffect(() => {
        getRoomData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!roomData) {
        return <div>Loading...</div>;
    }
    
    if (showSetings) {
        return renderSettings();
    } 
    return (
        <Grid container spacing={1} flexDirection={"column"} alignItems={"center"}>
            <Grid xs={12} alignItems="center">
                <Typography variant="h3" component="h3">
                    Code: {roomCode}
                </Typography>
            </Grid> 
            <Grid xs={12} alignItems="center">
                <Typography variant="h6" component="h6">
                    Votes: {roomData.votes_to_skip}
                </Typography>
            </Grid> 
            <Grid xs={12} alignItems="center">
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {roomData.guest_can_pause.toString()}
                </Typography>
            </Grid> 
            <Grid xs={12} alignItems="center">
                <Typography variant="h6" component="h6">
                    Host: {isHost.toString()}
                </Typography>              
            </Grid>
            {isHost ? renderSettingsButton() : null}
            <Grid xs={12} alignItems="center">
                <Button variant="contained" color="secondary" component={Link} onClick={leaveRoom}>
                    Leave Room
                </Button>              
            </Grid>  
        </Grid>
    )
}