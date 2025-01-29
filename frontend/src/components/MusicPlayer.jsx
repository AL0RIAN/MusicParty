import { useState } from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from '@mui/material/Alert';
import { PlayArrow, SkipNext, Pause } from "@mui/icons-material"
import CircularProgress from '@mui/material/CircularProgress';
import "axios"
import axios from "axios";

export default function MusicPlayer(props) {
    const songProgress = (props.time / props.duration) * 100;
    const [message, setMessage] = useState("");
    const [disabled, setDisabled] = useState(false);

    function pauseSong() {
        axios.put("http://127.0.0.1:8000/spotify/pause/")
        .then((response) => {
            if (response.status == 204) {
            }
        })
        .catch((err) => {
            setMessage(
                <>
                  You cannot pause/resume/skip songs without a <a href="https://www.spotify.com/premium" target="_blank" rel="noopener noreferrer">Spotify Premium</a>.
                </>
              );
            setDisabled(true);
        });
    }

    function playSong() {
        axios.put("http://127.0.0.1:8000/spotify/play/")
        .catch((err) => {
            setMessage(
                <>
                  You cannot pause/resume/skip songs without a <a href="https://www.spotify.com/premium" target="_blank" rel="noopener noreferrer">Spotify Premium</a>.
                </>
              );
            setDisabled(true);
        });
    }

    function skipSong() {
        axios.post("http://127.0.0.1:8000/spotify/skip/")
        .catch((err) => {
            setMessage(
                <>
                  You cannot pause/resume/skip songs without a <a href="https://www.spotify.com/premium" target="_blank" rel="noopener noreferrer">Spotify Premium</a>.
                </>
              );
            setDisabled(true);
        });
    }

    function renderMusicCard() {
        if (props.title) {
            return (
            <Grid container display="flex" justifyContent="center">
                <Grid container size={10} flexDirection="column" alignContent="center">
                    {message != "" ? (
                        <Grid>
                            <Alert severity="error" onClose={() => setMessage("")}>{message}</Alert>
                        </Grid>
                    ) : (
                        null
                    )}
                    <Grid display={"flex"}  justifyContent="center" >
                        <img src={props.image_url} width="100%" />
                    </Grid>
                    <Grid display="flex" flexDirection="column" alignItems="center" sx={{backgroundColor: "#fff"}}>
                        <Typography component="h5" variant="h5">
                            {props.title}
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1">
                            {props.artist}
                        </Typography>
    
                        <div className="control-panel">
                            <IconButton onClick={() => {props.is_playing ? pauseSong() : playSong()}} disabled={disabled}>
                                {props.is_playing ? <Pause /> : <PlayArrow/>}
                            </IconButton>
                            <IconButton onClick={() => skipSong()} disabled={disabled}>
                                <SkipNext /> {props.votes} / {props.votes_required}
                            </IconButton>
                        </div>
                    </Grid>
                </Grid>
                <Grid size={10}>
                    <LinearProgress variant="determinate" value={songProgress} />
                </Grid>
            </Grid>
            )
        } else {
            return (
                <CircularProgress />
            )
        }
    }

    return (
        renderMusicCard()
    )
}