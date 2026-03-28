import requests
import os

WAV2LIP_BIN = "backend/wav2lip/checkpoints"
os.makedirs(WAV2LIP_BIN, exist_ok=True)

# Wav2Lip GAN official weights (Google Drive links are hard to download via script, 
# so we use a direct mirror if possible or instructions)
MODELS = {
    "wav2lip_gan.pth": "https://huggingface.co/marcelop/Wav2Lip/resolve/main/wav2lip_gan.pth",
    "wav2lip.pth": "https://huggingface.co/marcelop/Wav2Lip/resolve/main/wav2lip.pth"
}

def download_file(url, filename):
    path = os.path.join(WAV2LIP_BIN, filename)
    if os.path.exists(path):
        print(f"{filename} already exists. Skipping.")
        return
    
    try:
        print(f"Downloading {filename} from {url}...")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Successfully downloaded {filename}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

if __name__ == "__main__":
    for name, url in MODELS.items():
        download_file(url, name)
    print("\nModel weights setup complete. Place 's3fd.pth' in 'backend/wav2lip/face_detection/detection/sfd/' if it's missing.")
