# utils.py
import uuid

def upload_to_firebase(image):
    """
    Simulate image upload to Firebase or cloud.
    Replace this with real Firebase SDK or signed URL upload.
    """
    unique_id = uuid.uuid4()
    # For demo: return a fake Firebase URL
    return f"https://firebasestorage.googleapis.com/v0/b/YOUR_BUCKET/o/category_icons%2F{unique_id}.jpg?alt=media"
