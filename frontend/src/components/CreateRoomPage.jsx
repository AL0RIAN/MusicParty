import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid2"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import FormHelperText from "@mui/material/FormHelperText"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import { Link } from "react-router-dom"
import { RadioGroup } from "@mui/material"
import { useState } from "react"

export default function CreateRoomPage(props) {
    let defaultVotes = 2;
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
    const [guestCanPause, setGuestCanPause] = useState(true);
    const [example, setExample] = useState("{}");

    function handleVotesChange(e) {
        setVotesToSkip(e.target.value);
    }

    function handleGuestCanPauseChange(e) {
        setGuestCanPause(e.target.value);
    }

    function handleCreateRoomButton() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause
            })
        };
        
        fetch("http://127.0.0.1:8000/api/room/create/", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setExample(JSON.stringify(data))
            });
    }


    return (
        <>
            <Grid container spacing={1}>
                <Grid size={{ xs: 12 }} align="center">
                    <Typography component="h4" variant="h4">
                        Create A Room
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">
                                Guest Control Of Playback State
                            </div>
                        </FormHelperText>
                        <RadioGroup row defaultValue={true} onChange={handleGuestCanPauseChange}>
                            <FormControlLabel
                                value={true}
                                control={<Radio color="primary" />}
                                label="Play/Pause"
                                labelPlacement="bottom"
                            />
                            <FormControlLabel
                                value={false}
                                control={<Radio color="secondary" />}
                                label="No Control"
                                labelPlacement="bottom"
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
                                    style: { "textAlign": "center" },
                                } 
                            }}
                        />
                        <FormHelperText>
                            <div align="center">
                                Votews Required To Skip Song
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
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
            <Grid align="center">
                <p>Example: {example}</p>
            </Grid>
        </>
    );
}