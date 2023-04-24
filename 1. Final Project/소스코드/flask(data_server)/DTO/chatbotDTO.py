from pydantic import BaseModel, validator

class spring_input_value(BaseModel):
    user_message: str
    intent: int

    @validator("intent")
    def check_intent(cls, value):
        if value not in [0, 1]:
            raise ValueError("값은 오로지 0 혹은 1이여야 합니다.")
        return value