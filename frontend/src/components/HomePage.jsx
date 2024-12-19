import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from "./App";

export default function HomePage() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<p>This is the home page</p>}/>
                    <Route path="/create" element={<CreateRoomPage />} />
                    <Route path="/join" element={<RoomJoinPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}