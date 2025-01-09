import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography  from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Room from "./Room";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";


export default function HomePage() {
    const [roomCode, setRoomCode] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/user_in_room/")
        .then((response) => response.data)
        .then((data) => {
            setRoomCode(data.code);
        });
    }, []);

    function clearRoomCode() {
        setRoomCode(null);
    }

    function renderHomePage() {
        if (roomCode == null) {
            return (
                <Grid container spacing={3} justifyContent="center" flexDirection={"column"}>
                    <Grid xs={12} alignItems="center">
                        <Typography variant="h3" component="h3">
                            House Party
                        </Typography>
                    </Grid>
                    <Grid xs={12} alignItems={"center"}>
                        <ButtonGroup disableElevation variant="contained" color="primary">
                            <Button color="primary" to="/room/join/" component={ Link }>
                                Join a Room
                            </Button>
                            <Button color="secondary" to="/room/create/" component={ Link }>
                                Create a Room
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            )
        } else {
            return (
                <Navigate to={`/room/${roomCode}/`}/>
            );
        }
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={renderHomePage()}/>
                    <Route path="/room/create/" element={<CreateRoomPage />} />
                    <Route path="/room/join/" element={<RoomJoinPage />} />
                    <Route path="room/:roomCode/" element={<Room clearRoomCodeCallback={clearRoomCode} />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}