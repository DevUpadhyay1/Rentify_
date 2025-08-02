import uuid
from django.conf import settings
import pyrebase

firebase = pyrebase.initialize_app(settings.FIREBASE_CONFIG)
storage = firebase.storage()

def upload_to_firebase(image):
    filename = f"category_icons/{uuid.uuid4().hex}_{image.name}"
    
    # Upload image using file object directly
    storage.child(filename).put(image)  # No .read(), let pyrebase handle the file
    
    # Construct public URL
    base_url = "https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media"
    bucket = settings.FIREBASE_CONFIG['storageBucket']
    path = filename.replace("/", "%2F")
    
    return base_url.format(bucket=bucket, path=path)
