from main import chatbot_start
from DTO.chatbotDTO import spring_input_value

from customlog.CustomFormatter import CustomFormatter
import logging

import os

from keras.models import load_model
from sentence_transformers import SentenceTransformer

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

local_path = os.path.dirname(os.path.realpath(__file__)) + '/'

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

ch = logging.StreamHandler()
ch.setFormatter(CustomFormatter())

os.system("cls")

if ch not in logger.handlers:
    logger.addHandler(ch)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_sbert_model()

    logger.debug("모델(의도 분류, SBert)들을 불러옵니다.")

    try:
        global intent_classify_model
        intent_classify_model = load_model(
            local_path+'models/CNN_library_involve_name_4_labels_location.h5')
    except Exception as e:
        logger.critical("의도 분류 모델을 불러오는 중 에러가 발생했습니다: " + str(e))
        logger.critical("코드를 종료합니다.")
        return

    try:
        global sbert_model
        sbert_model = SentenceTransformer(
            local_path+'models/saved_sbert_model')
    except Exception as e:
        logger.critical("SBERT 모델 초기화 하던 중 에러가 발생했습니다: " + str(e))
        logger.critical("코드를 종료합니다.")
        return

    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def init_sbert_model():
    sbert_saved_path = local_path + 'models/saved_sbert_model'

    if not os.path.exists(sbert_saved_path):
        logger.info("sbert 모델이 없습니다. [" + sbert_saved_path + "] 위치에 생성하겠습니다.")

        # sbert_model = SentenceTransformer(
        #     'sentence-transformers/all-roberta-large-v1')
        sbert_model = SentenceTransformer(
            'snunlp/KR-SBERT-V40K-klueNLI-augSTS')

        try:
            sbert_model.save(sbert_saved_path)
        except Exception as e:
            logger.critical(e)
            logger.critical("코드를 종료합니다.")
            return False

        logger.info("모델 생성이 완료되었습니다.")


@app.post("/chatbot")
async def prints(request: Request, value: spring_input_value):
    logger.info("[Spring Boot]\n" + f"IP: {request.client.host}\n의도: {value.intent}\n메시지: '{value.user_message}'")

    ans = await chatbot_start(intent_classify_model, sbert_model,
                              value.user_message, value.intent)

    temp = {'chatbotIntent': int(ans.intent), 'lib_book_cd': ans.lib_book_cd, 'bookCode': ans.t_book_cd, 'bookTitle': ans.title, 'bookAuthor': ans.author,
            'bookImg': ans.b_img, 'bookAvailableForRent': ans.rent_yn, 'bookIntro': ans.b_intro, 'libraryName': ans.library_nm, 'response': ans.response}

    return JSONResponse(content=temp)


if __name__ == "__main__":
    uvicorn.run("fastapi_main:app", reload=True, host="127.0.0.1", port=8000)
