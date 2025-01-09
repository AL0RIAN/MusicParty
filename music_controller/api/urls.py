from django.urls import path
from .views import (
        RoomCreateView,
        RoomUpdateView, 
        RoomListView, 
        RoomDetailsView, 
        CheckHostView, 
        RoomJoinView, 
        UserInRoomView,
        LeaveRoomView,
    )

urlpatterns = [
    path('room/create/', RoomCreateView.as_view()),
    path('room/update/', RoomUpdateView.as_view()),
    path('room/list/', RoomListView.as_view()),
    path('room/join/', RoomJoinView.as_view()),
    path('room/leave/', LeaveRoomView.as_view()),
    path('room/<str:roomCode>/', RoomDetailsView.as_view()),
    path('room/check_host/<int:room_id>/', CheckHostView.as_view()),
    path('user_in_room/', UserInRoomView.as_view()),
]
