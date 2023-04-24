from answer import Answer
from node import Node

import os
import re
from collections import deque
import pandas as pd
import torch
from keras.models import load_model

local_path = dir_path = os.path.dirname(os.path.realpath(__file__)) + '/'


def set_node_list1(intent_classify_model, sbert_model):
    # 통합 문의 데이터 로드
    inquiry_data_all = pd.read_csv(
        local_path+'data/csv/inquiry/inquiry_all.csv', encoding='cp949')
    inquiry_embedding_data_all = torch.load(
        local_path+'data/embedding_data/inquiry_embedding_data_all.pt')

    # 개별 문의 데이터 로드
    # 광진
    inquiry_data_GWJ = pd.read_csv(
        local_path+'data/csv/inquiry/inquiry_GWJ.csv', encoding='cp949')
    # inquiry_embedding_data_GWJ = torch.load(local_path+'data/embedding_data/inquiry_embedding_data_GWJ.pt')
    # 자양
    inquiry_data_JAY = pd.read_csv(
        local_path+'data/csv/inquiry/inquiry_JAY.csv', encoding='cp949')
    # inquiry_embedding_data_JAY = torch.load(local_path+'data/embedding_data/inquiry_embedding_data_JAY.pt')
    # 군자
    inquiry_data_GUJ = pd.read_csv(
        local_path+'data/csv/inquiry/inquiry_GUJ.csv', encoding='cp949')
    # inquiry_embedding_data_GUJ = torch.load(local_path+'data/embedding_data/inquiry_embedding_data_GUJ.pt')
    # 합정
    inquiry_data_HJ = pd.read_csv(
        local_path+'data/csv/inquiry/inquiry_HJ.csv', encoding='cp949')
    # inquiry_embedding_data_HJ = torch.load(local_path+'data/embedding_data/inquiry_embedding_data_HJ.pt')

    # node 생성1
    node1 = Node("<System> 의도 분류 모델 작동")
    node1.set_key(1)
    node1.set_model(intent_classify_model)

    node2 = Node("<System> (조회) 도서명,작가명 Tokenizer 작동, 도서명 혹은 작가명 틀릴 시 초기화")
    node2.set_key(2)

    node3 = Node("<System> (추천) 알고리즘 작동")
    node3.set_key(3)

    node4 = Node("<System> (문의사항)문장 유사도 모델 작동")
    node4.set_key(4)
    node4.set_model(sbert_model)  # sbert_model
    node4.set_emd_data(inquiry_data_all, inquiry_embedding_data_all)
    node4.set_emd_data(inquiry_data_GWJ, inquiry_embedding_data_all)
    node4.set_emd_data(inquiry_data_JAY, inquiry_embedding_data_all)
    node4.set_emd_data(inquiry_data_GUJ, inquiry_embedding_data_all)
    node4.set_emd_data(inquiry_data_HJ, inquiry_embedding_data_all)

    return node1, node2, node3, node4


def set_node_list2():

    # node 생성2

    node5 = Node("<System> (negative) 예외 처리 클래스, 데이터 수집 후 초기화")
    node5.set_key(5)

    node6 = Node("<System> DB 접근 후 도서 유무 확인")
    node6.set_key(6)

    node7 = Node("<System> 도서 보유 , 대출 가능 or 불가능 확인")
    node7.set_key(7)

    node8 = Node("<System> 도서 미보유 , node1으로")
    node8.set_key(8)

    return node5, node6, node7, node8


def set_graph(node1, node2, node3, node4, node5, node6, node7, node8):

    # 그래프 설정
    graph = [
            [],
            [node2, node3, node4, node5],
            [node6],
            [],
            [],
            [],
            [node7, node8],
            [],
            []
    ]

    # 노드별로 방문 정보를 리스트로 표현
    visited = [False] * 9

    return graph, visited

# BFS 메서드 정의


def bfs(graph, node, visited, user_input, btn_intent):

    # Answer 인스턴스
    # 도서명, 작가명 등의 정보를 기록할 객체
    ans = Answer()

    # 큐 구현을 위한 deque 라이브러리 활용
    queue = deque([node])

    # 큐가 완전히 빌 때까지 반복
    while queue:

        # 큐에 삽입된 순서대로 노드 하나 꺼내기
        poped_node = queue.popleft()

        # 현재 노드를 방문 처리
        visited[poped_node.get_key()] = True

        ans, next_node = poped_node.task(
            graph, poped_node, user_input, ans, btn_intent)

        # 현재 처리 중인 노드에서 방문하지 않은 인접 노드를 모두 큐에 삽입
        for idx, node in enumerate(graph[poped_node.get_key()]):

            if idx != next_node.get_rmv_idx():
                visited[node.get_key()] = True

            if not (visited[node.get_key()]):

                queue.append(node)

    return ans


async def chatbot_start(intent_classify_model, saved_KR_sbert_model, user_input, btn_intent):
    node1, node2, node3, node4 = set_node_list1(
        intent_classify_model, saved_KR_sbert_model, )
    node5, node6, node7, node8 = set_node_list2()
    graph, visited = set_graph(
        node1, node2, node3, node4, node5, node6, node7, node8)

    ans = bfs(graph, node1, visited, user_input, btn_intent)

    return ans
