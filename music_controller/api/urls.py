from django.urls import path
from .views import RoomCreateView, RoomListView, RoomDetails, CheckHost

urlpatterns = [
    path('room/create/', RoomCreateView.as_view()),
    path('room/list/', RoomListView.as_view()),
    path('room/<str:roomCode>/', RoomDetails.as_view()),
    path('room/check_host/<int:room_id>/', CheckHost.as_view()),
]
