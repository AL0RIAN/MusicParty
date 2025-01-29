from django.utils import timezone
from datetime import timedelta
from requests import post, put, get
from .models import SpotifyToken
from .config import CLIENT_ID, CLIENT_SECRET, BASE_URL


def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id).first()
    
    if user_tokens:
        return user_tokens
    return None
    
def update_or_create_user_tokens(
    session_id,
    access_token,
    token_type,
    expires_in,
    refresh_token
):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)
    
    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token, 
                              refresh_token=refresh_token, expires_in=expires_in, token_type=token_type)
        tokens.save()


def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token
    
    response = post('https://accounts.spotify.com/api/token', headers={'content-type': 'application/x-www-form-urlencoded',}, data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }).json()
    
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    
    update_or_create_user_tokens(session_id=session_id, access_token=access_token, 
                                 token_type=token_type, expires_in=expires_in, refresh_token=refresh_token)

def is_spotify_authenicated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)
        return True
    return False


def execute_spotify_api_request(session_id, endpoint='', post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokens.access_token
    }
    
    if post_:
        response = post(BASE_URL + endpoint, headers=headers)
        return response
    if put_:
        response = put(BASE_URL + endpoint, headers=headers)
        return response
        
    response = get(BASE_URL + endpoint, headers=headers)
    
    if response.status_code == 204:
        return {'msg': 'No Content'}
    elif response.status_code == 200:
        return response.json()   
    else:
        return {'error': response}


def about_user(session_id):
    return execute_spotify_api_request(session_id=session_id)

def play_song(session_id):
    return execute_spotify_api_request(session_id, 'player/play', put_=True)


def pause_song(session_id):
    return execute_spotify_api_request(session_id, 'player/pause', put_=True)


def skip_song(session_id):
    return execute_spotify_api_request(session_id, 'player/next', post_=True)
