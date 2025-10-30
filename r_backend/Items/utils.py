import os
from datetime import datetime
import tempfile
from pathlib import Path
from decouple import config
from .firebase_config import storage


def upload_to_firebase(image_file, folder_path, filename=None):
    """
    Upload image to Firebase Storage with organized folder structure.
    
    Args:
        image_file: Django InMemoryUploadedFile or TemporaryUploadedFile
        folder_path: Path structure (e.g., 'profile_images/123')
        filename: Optional custom filename (auto-generates if None)
    
    Returns:
        str: Public URL of uploaded image
    """
    try:
        # Generate filename if not provided
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            extension = Path(image_file.name).suffix
            filename = f"{timestamp}{extension}"
        
        # Create full Firebase path
        firebase_path = f"{folder_path}/{filename}"
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(image_file.name).suffix) as temp_file:
            for chunk in image_file.chunks():
                temp_file.write(chunk)
            temp_file_path = temp_file.name
        
        # Upload to Firebase
        storage.child(firebase_path).put(temp_file_path)
        
        # Get public URL
        url = storage.child(firebase_path).get_url(None)
        
        # Clean up temp file
        os.unlink(temp_file_path)
        
        return url
    
    except Exception as e:
        # Clean up temp file on error
        if 'temp_file_path' in locals():
            try:
                os.unlink(temp_file_path)
            except:
                pass
        raise Exception(f"Firebase upload failed: {str(e)}")


def delete_from_firebase(file_url):
    """
    Delete file from Firebase Storage using its URL.
    
    Args:
        file_url: Full Firebase Storage URL
    """
    try:
        if not file_url:
            return
        
        # Extract path from URL
        storage_bucket = config("FIREBASE_STORAGE_BUCKET")
        if storage_bucket in file_url:
            # Extract path after bucket name
            path_start = file_url.find(storage_bucket) + len(storage_bucket) + 1
            path_end = file_url.find('?') if '?' in file_url else len(file_url)
            firebase_path = file_url[path_start:path_end]
            
            # Delete from Firebase
            storage.delete(firebase_path, None)
    
    except Exception as e:
        print(f"⚠️ Firebase deletion warning: {str(e)}")