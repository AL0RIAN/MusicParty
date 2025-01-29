import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";


export default function Room(props) {
    const [roomData, setRoomData] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [error, setError] = useState(null);
    const [showSetings, setShowSettings] = useState(null);
    const [song, setSong] = useState({});
    const [spotifyAuth, setSpotifyAuth] = useState(false);
    const navigate = useNavigate();

    const { roomCode } = useParams();

    function getCurrentSong() {
        axios.get('http://127.0.0.1:8000/spotify/current-song/')
        .then((response) => {
            if (response.status != 200) {
                console.log(response);
            } else {
                setSong(response.data);
            }
        })
    }

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
            <Grid container spacing={1} justifyContent="center" alignItems="center" flexDirection="column">
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
        axios.get(`http://127.0.0.1:8000/api/room/${roomCode}/`)
        .then((room_data) => {
            setRoomData(room_data.data);
            axios.get(`http://127.0.0.1:8000/api/room/check_host/${room_data.data.id}/`)
            .then((host_check) => {
                setIsHost(host_check.data);
                if (host_check.data) {
                    authenticated();
                }
            });
        })
        .catch((err) => {
            setError(err.room_data?.data?.error || "Error fetching room data");
            props.clearRoomCodeCallback();
            navigate("/");
        })
    }

    function authenticated() {
        axios.get("http://127.0.0.1:8000/spotify/is-authenticated/")
        .then((data) => {
            setSpotifyAuth(data.is_authenticated);
            if (!data.data.is_authenticated) {
                axios.get("http://127.0.0.1:8000/spotify/get-auth-url/")
                .then((response) => {
                    window.location.href = response.data.url;
                })
            }
        })
    }

    useEffect(() => {
        const interval = setInterval(getCurrentSong, 1000);

        return () => {
            clearInterval(interval);
          };
    }, []);

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
        <Grid container spacing={1} display="flex" flexDirection="column" alignItems="center">
            <Grid>
                <Typography fontWeight="bold" color="#fff" variant="h3" component="h3">
                    Code: {roomCode}
                </Typography>
            </Grid> 
            <MusicPlayer {...song}/>
            {isHost ? renderSettingsButton() : null}
            <Grid size={{xs: 12}} display="flex" justifyContent="center">
                <Button variant="contained" color="secondary" component={Link} onClick={leaveRoom}>
                    Leave Room
                </Button>              
            </Grid>
        </Grid>
    )
}