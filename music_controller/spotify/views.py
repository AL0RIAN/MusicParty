from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from requests import Request, post
from .config import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from .util import *
from api.models import Room
from .models import Vote

class AuthURL(APIView):
    def get(self, request):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        url = Request('Get', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url
        
        return Response({'url': url}, status=status.HTTP_200_OK)
    

def spotify_callback(request):
    code = request.GET.get('code')
    
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()
    
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    
    if not request.session.session_key:
        request.session.create()
        
    update_or_create_user_tokens(session_id=request.session.session_key, access_token=access_token, 
                                refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
    
    return redirect('http://127.0.0.1:5173/')


class IsAuthenticated(APIView):
    def get(self, request):
        is_authenticated = is_spotify_authenicated(request.session.session_key)
        return Response({'is_authenticated': is_authenticated}, status=status.HTTP_200_OK)


class AboutMe(APIView):
    def get(self, request):
        data = about_user(request.session.session_key)
        return Response({'data': data}, status=status.HTTP_200_OK)
        

class CurrentSong(APIView):
    def get(self, request):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room:
            room = room.first()
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        
        host = room.host
        endpoint = 'player/currently-playing'
        
        response = execute_spotify_api_request(host, endpoint)
        
        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')
        
        artist_string = ''
        
        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ', '
            name = artist.get('name')
            artist_string += name
        
        votes = len(Vote.objects.filter(room=room, song_id=song_id))
        
        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id
        }
        
        self.update_room_song(room, song_id)
        
        return Response(data=song, status=status.HTTP_200_OK)
    
    def update_room_song(self, room, song_id):
        current_song = room.current_song
        
        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            votes = Vote.objects.filter(room=room).delete()

class PauseSong(APIView):
    def put(self, request):
        room_code = request.session.get('room_code')
        room = Room.objects.filter(code=room_code).first()
        if request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_403_FORBIDDEN)


class PlaySong(APIView):
    def put(self, request):
        room_code = request.session.get('room_code')
        room = Room.objects.filter(code=room_code).first()
        if request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_403_FORBIDDEN)


class SkipSong(APIView):
    def post(self, request):
        room_code = request.session.get('room_code')
        room = Room.objects.filter(code=room_code).first()
        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip
        
        if request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
            votes.delete()
            skip_song(room.host)
        else:
            vote = Vote(user=request.session.session_key,
                        room=room, song_id=room.current_song)
            vote.save()
        
        return Response({}, status.HTTP_204_NO_CONTENT)
    