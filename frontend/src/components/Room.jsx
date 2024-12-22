import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Room(props) {
    const [roomData, setRoomData] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [error, setError] = useState(null);

    const { roomCode } = useParams();

    useEffect(() => {
        const getRoomData = async () => {
            try {
                const room_data = await axios.get(`http://127.0.0.1:8000/api/room/${roomCode}/`);
                setRoomData(room_data.data);

                const host_check = await axios.get(`http://127.0.0.1:8000/api/room/check_host/${room_data.data.id}/`);
                setIsHost(host_check.data);
            } catch (err) {
                setError(err.room_data?.data?.error || "Error fetching room data");
            }
        }

        getRoomData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!roomData) {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
            <h3>{roomCode}</h3>
            <p>Votes: {roomData.votes_to_skip}</p>
            <p>Guest Can Pause: {roomData.guest_can_pause}</p>
            <p>Host: {isHost.toString()}</p>
            <p>Session: {roomData.host}</p>
        </div>
    )
}