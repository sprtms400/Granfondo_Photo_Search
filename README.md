# Granfondo Photo Search

마라톤·그란폰도 대회 사진에서 내 사진을 찾아주는 검색 서비스의 API 서버다.

> 2023~2024년 작업이다. `app.granphotossearch.com` 에 초기 서비스를 배포했었다.

---

# 개요

## 1. 어떤 문제를 해결하려 했나요?

대회가 끝나면 주최측이나 동호회 카페에 사진 수천 장이 올라온다. 그중 내가 찍힌 사진을 찾으려면 처음부터 끝까지 눈으로 넘겨야 한다.

배번호로 찾으면 되지 않느냐 싶지만, 사진에 배번표가 안 나온 경우가 많다. 뒤에서 찍혔거나, 몸이 가렸거나, 흔들렸거나. 그러면 방법이 없다.

## 2. 어떻게 되었나요

사진마다 자동으로 꼬리표를 붙였다. 배번호는 물론이고 성별, 헬멧 색, 상의 색, 하의 색, 자전거 색까지 읽어냈다.

그래서 배번표가 안 보이는 사진도 찾을 수 있다. "노란 상의에 빨간 자전거" 라고 검색하면 그런 차림의 사람이 찍힌 사진이 나온다.

```
검색 : "Yellow shirts and red bike"
```

![검색 결과](https://github.com/sprtms400/Granfondo_Photo_Search/assets/26298389/57f1c18b-cdc5-444b-9025-9a471df9a6ba)

## 3. 향후 과제

배번표 검색은 아직 붙이지 못했다. 번호를 읽어내는 부분은 만들었지만 검색에 연결하지 않았다.

색인해둔 대회도 2023 상주그란폰도 하나뿐이다. 대회가 늘어나면 사진 수집부터 라벨링까지 자동으로 도는 구조가 필요하다.

|기능|상태|
|---|---|
|인상착의 검색|동작|
|배번표 검색|미연결|

---

# 상세

## 1. 기존 문제 설정

대회 사진 검색의 어려움은 두 가지다.

**사진에 붙은 정보가 없다.** 올라온 사진은 그냥 이미지 파일이다. 누가 찍혔는지, 뭘 입었는지 아무 정보도 없다. 파일명은 `DSC_0413.jpg` 같은 것뿐이다.

**배번호에만 기대면 절반은 놓친다.** 배번표는 앞쪽에만 달려 있고 사진은 옆이나 뒤에서도 찍힌다. 번호가 안 보이는 사진은 어떤 방법으로도 주인을 찾아줄 수 없다.

## 2. 해결방안 제시

**사진을 읽어서 꼬리표를 붙인다.** 사람이 일일이 볼 수는 없으니 모델에게 시킨다. 배번호는 배번표 영역을 찾아낸 뒤 글자를 읽고, 옷차림은 이미지를 이해하는 모델에게 물어본다.

**옷차림으로도 찾게 한다.** 배번호가 없어도 "노란 상의, 빨간 자전거" 라는 조합이면 후보를 크게 줄일 수 있다. 대회 참가자 수천 명 중 그 조합에 맞는 사람은 몇 명 되지 않는다.

**검색은 글자 맞추기 대신 뜻으로 한다.** 사람이 "노란 티" 라고 쳐도 꼬리표에는 "yellow shirts" 라고 적혀 있을 수 있다. 뜻이 가까우면 걸리도록 벡터 검색을 쓴다.

## 3. 구현 상세

### 시스템 구조

![시스템 아키텍처](https://github.com/sprtms400/Granfondo_Photo_Search/assets/26298389/bd32ea8a-23fe-44b5-8bd6-c344615fe534)

### 데이터 흐름

검색 로직은 13번부터 보면 된다.

![데이터 흐름](https://github.com/sprtms400/Granfondo_Photo_Search/assets/26298389/28254c7d-3681-4e5e-9cc8-35cfc0ec8f9a)

### 배번호 읽기

Grounding DINO 로 사진에서 배번표가 있는 영역을 먼저 찾는다. 그 영역만 잘라내 전처리한 다음 easyOCR 로 숫자를 읽는다. 사진 전체에 OCR을 돌리면 배경 글자까지 다 읽혀서 쓸 수 없다.

![배번표 검출 로직](https://github.com/sprtms400/Granfondo_Photo_Search/assets/26298389/bfb19af6-2e4e-4c73-8c4f-609e2cd7954c)

### 옷차림 읽기

LLaVA 라는, 이미지를 보고 답하는 모델을 직접 띄워서 쓴다. 성별, 헬멧, 고글, 상의, 하의, 양말, 신발, 자전거를 각각 물어보고 색과 착용 여부를 받아온다.

답이 제멋대로 나오면 쓸 수 없으니, 원하는 형식의 예시를 몇 개 보여주고 그대로 흉내내게 했다.

![인상착의 검출 로직](https://github.com/sprtms400/Granfondo_Photo_Search/assets/26298389/9e76b7a4-9ce7-4c2c-84b7-a122d2a54244)

### 저장소 구성

이 서비스는 저장소 다섯 개로 나뉘어 있다. 여기는 그중 API 서버다.

| 저장소 | 하는 일 |
|---|---|
| **Granfondo_Photo_Search** (여기) | API 서버. 검색과 콘텐츠 관리 |
| [Granfondo_Photo_Search_Front](https://github.com/sprtms400/Granfondo_Photo_Search_Front) | 사용자가 쓰는 웹 화면 |
| [Naver_Cafe_Image_Crawler](https://github.com/sprtms400/Naver_Cafe_Image_Crawler) | 대회 사진 수집 |
| [ocrDINO_NumberExtractor](https://github.com/sprtms400/ocrDINO_NumberExtractor) | 배번호 읽기 |
| [appearance-llava](https://github.com/sprtms400/appearance-llava) | 옷차림 읽기 |

### 빌려 쓴 것들

- [LLaVA](https://llava-vl.github.io/) — 이미지를 보고 답하는 모델. 옷차림 읽기에 씀
- [Grounding DINO](https://github.com/IDEA-Research/GroundingDINO) — 사진에서 배번표 영역 찾기
- [easyOCR](https://github.com/JaidedAI/EasyOCR) — 배번표에서 숫자 읽기
- [LangChain](https://python.langchain.com/docs/get_started/introduction) — 외부 모델 API를 다루는 틀

### 실행

```
nvm install 20.11
npm install
npx ts-node server.ts
```

Ubuntu 20.04, Node 20.11 에서 개발했다.

## 4. 한계점

- 배번표 검색이 연결돼 있지 않다. 번호를 읽는 부분은 만들었지만 검색에 붙이지 않았다.
- 색인된 대회가 2023 상주그란폰도 하나뿐이다.
- 옷차림 읽기는 LLaVA 를 직접 띄워야 해서 GPU 가 필요하다. 사진이 늘어나면 처리 시간이 그대로 늘어난다.
- 사진 수집이 네이버 카페 앨범 게시판에 맞춰져 있다. 다른 곳에서 가져오려면 크롤러를 새로 만들어야 한다.
- 테스트 코드가 없다.
