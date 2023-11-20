from pydantic import BaseModel


class Recognotion(BaseModel):
    url: str

    class Config:
        orm_mode = True
