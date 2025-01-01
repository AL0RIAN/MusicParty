from django.shortcuts import render
from rest_framework.generics import ListAPIView
from rest_framework import status
from .serializers import RoomSerializer, CreateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Room


class RoomCreateView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not request.session.session_key:
            request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            
            host = request.session.session_key
            queryset = Room.objects.filter(host=host)
            
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                request.session['room_code'] = room.code
                request.session.save()
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()
                request.session.save()
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        
        return Response({'Bad Request': 'Invalid data.'}, status=status.HTTP_400_BAD_REQUEST)


class RoomDetails(APIView):
    def get(self, reuqest, roomCode):
        room = Room.objects.filter(code=roomCode).first()

        if room:
            serializer = RoomSerializer(room)
            return Response(serializer.data, status.HTTP_200_OK)
        
        return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        
        
class CheckHost(APIView):
    def get(self, request, room_id):
        try:
            room = Room.objects.get(pk=room_id)
            data = request.session.session_key == room.host
            return Response(data, status=status.HTTP_200_OK)
        except Room.DoesNotExist:
            return Response({'Room Not Found': 'Invalid Room Id'}, status.HTTP_404_NOT_FOUND)       
    

class RoomListView(ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class RoomJoinView(APIView):
    def post(self, request):
        if not request.session.session_key:
            request.session.create()
        
        code = request.data.get('code')
        
        if code != None:
            room = Room.objects.filter(code=code).first()
            if room:
                request.session['room_code'] = code
                return Response({'message': 'Room joined'}, status=status.HTTP_200_OK)
            return Response({'message': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'message': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)
    
            
        
        