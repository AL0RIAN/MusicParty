# Music Party

This web application allows multiple users to connect to a single room and listen to music together from Spotify. 
The backend is powered by Django Rest Framework, handling authentication and API interactions with Spotify, while the frontend is built with React for a smooth user experience.

## Tech Stack
- **Backend:** Django Rest Framework, Spotify Api
- **Frontend:** React.js
- **Authentication**: Spotify OAuth

## Features:
- **Authentication:** Users authenticate via Spotify OAuth to access and play their own music.
- **Rooms:** An authenticated user can create a room to share their music with others. 
Other users can join the room using a unique room code.
- **Playback Control:** Users can pause, resume, and skip tracks in real time.

## Example
<p align="center">
  <img src=https://github.com/user-attachments/assets/416c9482-e1df-4bd7-94e8-590bcc12d7a0 width="800" alt="demo1" />
  <br>
  <i>Room Creation and Authentication</i>
</p>
<p align="center">
  <img src=https://github.com/user-attachments/assets/76f38867-96c2-4f8c-8fdb-f19adab5966c width="800" alt="demo2" />
  <br>
  <i>Room Connection</i>
</p>
<p align="center">
  <img src=https://github.com/user-attachments/assets/937b252c-bf59-4fc0-bbce-71c9cfde0127 width="800" alt="demo3" />
  <br>
  <i>User needs Spotify Premium to skip/pause/unpause songs</i>
</p>

## How to run

### 1. Create an App on the Spotify Dashboard

Create an app on the <a href="https://developer.spotify.com/dashboard">Spotify Dashboard</a> and save the **Client ID** and **Client Secret**.

<img src=https://github.com/user-attachments/assets/a01809e7-8551-4835-893e-cca46b90ca19 width="750"/>

### 2. Environment Configuration

Create an .env file in the project root and fill it with the following variables:
```bash
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://127.0.0.1:8000/spotify/redirect/
BASE_URL=https://api.spotify.com/v1/me/
```

### 3. Installation:

#### Backend (Django)
Navigate to MusicParty/music_controller and install dependencies:
```bash
pip install -r requirements.txt 
```

#### Frontend (React)
Navigate to MusicParty/frontend and install dependencies:
```bash
npm install
```

### 4. Running the Application:

Start the Backend
```bash
cd music_controller
python manage.py runserver
```

#### Start the Frontend
```bash
cd frontend
npm run dev
```
