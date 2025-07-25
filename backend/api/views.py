from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import (
    LoginSerializer, 
    RegisterSerializer,
    RegisteredUserSerializer,
    RoomSerializer,
    AttendanceSerializer
) # Make sure this matches your serializer name
from rest_framework_simplejwt.tokens import RefreshToken
# from .tokens import get_tokens_for_user  # You need to define this (see below)
from api.models import User, Room, Attendance
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.db import IntegrityError

# Create your views here.

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)

        return Response(
            {
                "tokens": tokens,
                "msg": "User login success",
                "user": {
                    "student_id": user.student_id,
                    "email": user.email,
                    "name": user.name,
                    "role": "admin" if user.is_staff else "participant"
                }
            },
            status=status.HTTP_200_OK
        )

    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response(
            {"tokens": tokens, "msg": "User registration success"},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"]) 
@permission_classes([AllowAny])
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response(
                {"msg": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST
            )
        
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(
            {"msg": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT
        )
    except Exception :
        return Response({"msg": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def get_user_count(request):
    total_users = User.objects.filter(is_active=True).count()  # count only active users
    return Response({'total_users': total_users})

@api_view(['GET'])
def registered_users(request):
    users = User.objects.all()
    serializer = RegisteredUserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        user.delete()
        return Response({'detail': 'User deleted'}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_attendance(request):
    attendance = Attendance.objects.all().order_by('-timestamp')
    serializer = AttendanceSerializer(attendance, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_rooms(request):
    rooms = Room.objects.all().order_by('-created_at')
    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

from django.http import JsonResponse

def total_recognized_faces(request):
    count = Attendance.objects.count()
    return JsonResponse({'total_recognized_faces': count})

def get_total_rooms(request):
    total = Room.objects.count()
    return JsonResponse({"total_rooms": total})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_logs(request):
    logs = Attendance.objects.order_by('-timestamp')[:10]  # latest 10
    serializer = AttendanceSerializer(logs, many=True)
    return Response(serializer.data)

#face capturing APIs
import cv2
import pickle
import numpy as np
import os
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["POST"])
@permission_classes([AllowAny])
def capture_faces(request):
    name = request.data.get('name')
    if not name:
        return Response({"error": "Name is required"}, status=400)

    facedetect = cv2.CascadeClassifier('./data/haarcascade_frontalface_default.xml')
    video = cv2.VideoCapture(0)

    faces_data = []
    i = 0

    while True:
        ret, frame = video.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = facedetect.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            crop_img = frame[y:y + h, x:x + w, :]
            resized_img = cv2.resize(crop_img, (50, 50))
            if len(faces_data) <= 100 and i % 10 == 0:
                faces_data.append(resized_img)
            i += 1
            cv2.putText(frame, str(len(faces_data)), (50,50), cv2.FONT_HERSHEY_COMPLEX, 1, (50,50,255), 1)
            cv2.rectangle(frame, (x,y), (x+w, y+h), (50,50,255), 1)

        cv2.imshow("Frame",frame)
        k=cv2.waitKey(1)
        if k==ord('q') or len(faces_data)==100:
            break


    video.release()
    cv2.destroyAllWindows()

    faces_data = np.asarray(faces_data).reshape(100, -1)

    # Save name data
    names_path = './data/names.pkl'
    faces_path = './data/faces_data.pkl'

    if os.path.exists(names_path):
        with open(names_path, 'rb') as f:
            names = pickle.load(f)
    else:
        names = []

    names += [name] * 100
    with open(names_path, 'wb') as f:
        pickle.dump(names, f)

    if os.path.exists(faces_path):
        with open(faces_path, 'rb') as f:
            faces = pickle.load(f)
        faces = np.append(faces, faces_data, axis=0)
    else:
        faces = faces_data

    with open(faces_path, 'wb') as f:
        pickle.dump(faces, f)

    return Response({"message": "Face data captured and saved successfully"})



@api_view(["GET"])
@permission_classes([AllowAny])
def get_faces_data(request):
    faces_data_file = './data/faces_data.pkl'
    names_file = './data/names.pkl'

    if os.path.exists(faces_data_file) and os.path.exists(names_file):
        with open(faces_data_file, 'rb') as f:
            faces_data = pickle.load(f)
        with open(names_file, 'rb') as f:
            names = pickle.load(f)

        return Response({
            "names": names,
            "faces_data": faces_data.tolist()  # Convert NumPy array to list for JSON serialization
        })
    else:
        return Response({"error": "No data found"}, status=404)
    

# delete face data
import os
import pickle
import numpy as np
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Attendance


@api_view(["POST"])
@permission_classes([AllowAny])
def delete_face_data(request):
    name_to_delete = request.data.get('name')
    if not name_to_delete:
        return Response({"error": "Name is required"}, status=400)

    names_path = './data/names.pkl'
    faces_path = './data/faces_data.pkl'

    if not (os.path.exists(names_path) and os.path.exists(faces_path)):
        return Response({"error": "Face data files not found."}, status=404)

    # Load data from pkl files
    with open(names_path, 'rb') as f:
        names = pickle.load(f)
    with open(faces_path, 'rb') as f:
        faces = pickle.load(f)

    # Check if name exists
    if name_to_delete not in names:
        return Response({"error": f"No face data found for '{name_to_delete}'."}, status=404)

    # Filter out entries for the target name
    filtered_names = []
    filtered_faces = []

    for i, person_name in enumerate(names):
        if person_name != name_to_delete:
            filtered_names.append(person_name)
            filtered_faces.append(faces[i])

    # Save updated pkl files
    with open(names_path, 'wb') as f:
        pickle.dump(filtered_names, f)

    with open(faces_path, 'wb') as f:
        pickle.dump(np.array(filtered_faces), f)

    # Delete attendance records from the database
    deleted_count, _ = Attendance.objects.filter(student_name=name_to_delete).delete()

    return Response({
        "message": f"Deleted face data and {deleted_count} attendance record(s) for '{name_to_delete}'."
    }, status=200)


    
import cv2
import pickle
import numpy as np
import time
from sklearn.neighbors import KNeighborsClassifier
from datetime import date
from .models import Attendance
from .serializers import AttendanceSerializer
@api_view(["GET"])
@permission_classes([AllowAny])
def recognize_faces(request):
    # Load Haar cascade and data
    facedetect = cv2.CascadeClassifier('./data/haarcascade_frontalface_default.xml')
    video = cv2.VideoCapture(0)

    with open('./data/names.pkl', 'rb') as f:
        names = pickle.load(f)
    with open('./data/faces_data.pkl', 'rb') as f:
        faces = pickle.load(f)

    if faces.shape[0] != len(names):
        return Response({"error": "Mismatch between names and face data."}, status=500)

    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(faces, names)

    recognized = []

    frame_count = 0
    while frame_count < 20:
        ret, frame = video.read()
        if not ret:
            continue

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        face_rects = facedetect.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in face_rects:
            crop_img = frame[y:y+h, x:x+w, :]
            resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)

            try:
                predicted_name = knn.predict(resized_img)[0]
                print("Predicted:", predicted_name)
                recognized.append(predicted_name)
            except Exception as e:
                print("Prediction error:", e)

        frame_count += 1

    video.release()
    cv2.destroyAllWindows()

    # Remove duplicates
    recognized = list(set(recognized))
    print("Final recognized:", recognized)

    # Mark attendance
    today = date.today()
    entries = []

    for name in recognized:
        if not Attendance.objects.filter(student_name=name, date=today).exists():
            entry = Attendance.objects.create(student_name=name, date=today)
            entries.append(entry)

    serializer = AttendanceSerializer(entries, many=True)
    return Response({
        "recognized": [entry.student_name for entry in entries],
        "records": serializer.data
    })




# from django.http import StreamingHttpResponse

# def gen_frames():
#     facedetect = cv2.CascadeClassifier('./data/haarcascade_frontalface_default.xml')
#     video = cv2.VideoCapture(0)

#     with open('./data/names.pkl', 'rb') as f:
#         names = pickle.load(f)
#     with open('./data/faces_data.pkl', 'rb') as f:
#         faces = pickle.load(f)

#     knn = KNeighborsClassifier(n_neighbors=5)
#     knn.fit(faces, names)

#     while True:
#         success, frame = video.read()
#         if not success:
#             break
#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         face_rects = facedetect.detectMultiScale(gray, 1.3, 5)

#         for (x, y, w, h) in face_rects:
#             crop_img = frame[y:y+h, x:x+w, :]
#             resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)
#             output = knn.predict(resized_img)
#             name = output[0]
#             cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
#             cv2.putText(frame, name, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)

#         ret, buffer = cv2.imencode('.jpg', frame)
#         frame = buffer.tobytes()

#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

#     video.release()

from django.http import StreamingHttpResponse

#for websocket alerts
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def gen_frames():
    # Initialize face detector and video capture
    facedetect = cv2.CascadeClassifier('./data/haarcascade_frontalface_default.xml')
    video = cv2.VideoCapture(0)

    # Load known faces data and labels
    with open('./data/names.pkl', 'rb') as f:
        names = pickle.load(f)
    with open('./data/faces_data.pkl', 'rb') as f:
        faces = pickle.load(f)

    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(faces, names)

    recognized_today = set()  # Track recognized faces for today

     # For no face detection alert
    last_face_time = time.time()
    face_missing_alert_sent = False
    # For unknown face alert
    unknown_face_alert_sent = False


    while True:
        success, frame = video.read()
        if not success:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        face_rects = facedetect.detectMultiScale(gray, 1.3, 5)

        if len(face_rects) > 0:
            # Update timestamp since face detected
            last_face_time = time.time()
            face_missing_alert_sent = False  # Reset if face appears

            for (x, y, w, h) in face_rects:
                crop_img = frame[y:y+h, x:x+w, :]
                resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)

                # try:
                #     output = knn.predict(resized_img)
                #     name = output[0]
                #     if name not in names:
                #         if not unknown_face_alert_sent:
                #             channel_layer = get_channel_layer()
                #             async_to_sync(channel_layer.group_send)(
                #                 "face_alerts",
                #                 {
                #                     "type": "send_alert",
                #                     "message": f"Unknown face detected: {name}"
                #                 }
                #             )
                #             unknown_face_alert_sent = True
                #     else:
                #         unknown_face_alert_sent = False  # Reset if known face detected

                try:
                    output = knn.predict(resized_img)
                    name = output[0]
                except Exception:
                    name = "Unknown"

                # If unknown face detected, send alert
                if name == "Unknown" and not unknown_face_alert_sent:
                    channel_layer = get_channel_layer()
                    async_to_sync(channel_layer.group_send)(
                        "face_alerts",
                        {
                            "type": "send_alert",
                            "message": " Unrecognized face detected"
                        }
                    )
                    unknown_face_alert_sent = True
                elif name != "Unknown":
                    unknown_face_alert_sent = False  # Reset if recognized face appears

                    today = date.today()
                    if name not in recognized_today:
                        from .models import Attendance  # Lazy import to avoid circular import
                        if not Attendance.objects.filter(student_name=name, date=today).exists():
                            Attendance.objects.create(student_name=name, date=today)
                            recognized_today.add(name)

                # Draw the detection on the frame (red for unknown, green for recognized)
                color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
                cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
                cv2.putText(frame, name, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)

        else:
            # No face detected – check if >4 seconds have passed
            if time.time() - last_face_time > 4 and not face_missing_alert_sent:
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    "face_alerts",
                    {
                        "type": "send_alert",
                        "message": " No face detected for over 4 seconds"
                    }
                )
                face_missing_alert_sent = True

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    video.release()


@api_view(["GET"])
@permission_classes([AllowAny])
def video_feed(request):
    return StreamingHttpResponse(gen_frames(), content_type='multipart/x-mixed-replace; boundary=frame')



from django.shortcuts import render
from .accuracy import evaluate_model

def evaluate_model_view(request):
    result = evaluate_model()
    return render(request, 'accuracy.html', {
        'accuracy': result['accuracy'],
        'report': result['report'],
        'confusion_matrix_image': result['confusion_matrix_image']
    })
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_room(request):
    room_id = request.data.get("id")
    if not room_id:
        return Response({"error": "Room ID is required"}, status=400)
    try:
        room = Room.objects.create(id=room_id)
        print("Room created with ID:", room.id)
        return Response({"message": "Room created", "id": room.id})
    except IntegrityError:
        return Response({"error": "Room with this ID already exists."}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@ensure_csrf_cookie
def get_csrf_cookie(request):
    return JsonResponse({'detail': 'CSRF cookie set'})