import uvicorn
from fastapi import APIRouter, FastAPI
from fastapi import HTTPException
import base64
import time
from app.schema.recognotion import Recognotion as SchemaRecognotion

from app.utils.utils import recognition

router = APIRouter()


@router.post("/get-Image")
async def request(recognition_data: SchemaRecognotion):
    try:
        # Extraire les données de base64 à partir de l'URL
        image_data = recognition_data.url.split(",")[1]

        # Convertir les données base64 en bytes
        binary_data = base64.b64decode(image_data)

        # Écrire les bytes dans un fichier
        with open("application_data/input_image/input_image.jpg", "wb") as file:
            file.write(binary_data)

        # recognition()

        user = {}

        info = [
            {
                "name": "Olongo",
                "code": "16V2073",
                "level": "Licence 3",
                "access": "true",
            }
        ]

        user["infoUser"] = info

        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
