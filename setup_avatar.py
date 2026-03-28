import requests
import os

AVATARS_DIR = "backend/static/avatars"
os.makedirs(AVATARS_DIR, exist_ok=True)

# A high-quality professional portrait from Unsplash
IMAGE_URL = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"

def download_avatar():
    try:
        print(f"Downloading avatar image from {IMAGE_URL}...")
        response = requests.get(IMAGE_URL, stream=True)
        response.raise_for_status()
        
        target_path = os.path.join(AVATARS_DIR, "girl.jpg")
        with open(target_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Successfully downloaded girl.jpg to {target_path}")
    except Exception as e:
        print(f"Error downloading avatar: {e}")

if __name__ == "__main__":
    download_avatar()
