# 마라톤, 그란폰도 대회 이미지 검색 및 컨텐츠 관리 API 서비스
마라톤, 그란폰도 대회 이미지에 대하여 자동 수집 및 컨텐츠 분석과 검색이 가능한 시스템입니다.
대회중에 찍힌 사진에 대하여 자동적으로 아래 항목에 대하여 레이블링을 진행, 이를 이용하여 검색이 가능합니다!

### 레이블링 항목
1. 배번표 배번번호
2. 성별
3. 헬멧 착용 여부와 색상
4. 고글혹은 선글라스의 착용 여부와 색상
5. 상의 긴팔/반판 여부와 색상
6. 하의 신바지/반바지 여부와 색상
7. 양말 착용 여부와 색상
8. 신발 색상
9. 자전거 탑승 여부와 색상

## :tada: Try this! 

> Release page : https://app.granphotossearch.com/#/search

마침내 초기서비스를 배포하였습니다. 위의링크에서 시도해보실 수 있습니다!.
다음은 
```
검색 : "Yellow shirts and red bike"
```
쿼리를 검색한 결과의 예시.
![image](https://github.com/sprtms400/Granfondo_Photo_Search/assets/26298389/57f1c18b-cdc5-444b-9025-9a471df9a6ba)


현재 이용가능한 검색기능은 다음과 같습니다.
|기능명|가능여부|
|---|---|
|인상착의 검색| :o:|
|배번표 검색| :x:|

현재 검색가능한 대회 목록은 다음과 같습니다.

|대회명|가능여부|
|---|---|
|2023 상주그란폰도| :o:|

## How it works? :mag_right:
몇가지 핵심 아이디어에 대해 소개시켜드립니다.
1. 해당 프로젝트에서 VectorDB를 이용하여 유사도 검색을 수행하는 이유 (#)
2. Llava2를 이용하여 대회 이미지에서 성별, 헬멧이나 모자, 상의, 하의부터 자전거까지 색상 정보를 추출하는 법. (#)
3. rule 기반의 자연어로 구성된 이미지 설명 컨텍스트 생성기법. (#)
4. Ontoogy 와 LLM을 이용한 자연어로 구성된 검색쿼리에 대하여 구조적으로 분해하는법. (#)


## 프로젝트의 관련 Repositories 와 용도
1. 네이버 이미지 크롤러 : https://github.com/sprtms400/Naver_Cafe_Image_Crawler <br>🙋 대회별 이미지를 수집하기 위해 개발됨.
2. 배번표 분석기 : https://github.com/sprtms400/ocrDINO_NumberExtractor <br>🙋 이미지 내에서 Grounding DINO를 이용하여 배번표 영역을 검출하고 OCR진행을 수행하기위해 개발됨
3. 인상착의 분석기 : https://github.com/sprtms400/appearance-llava <br>🙋 Onpremise 환경에 구성된 Llava2 모델을 이용하여 이미지 내에서 인상착의를 Zero-shot learning을 통하여 검출하기위해 개발됨.
5. 서비스 웹페이지 프로젝트: https://github.com/sprtms400/Granfondo_Photo_Search_Front <br>🙋 Vue로 개발된 인터페이스.

## 이용된 외부 프로젝트
1. Llava2 : https://llava-vl.github.io/ <br>🙋 인상착의 분석기에서 Zero-shot Learning을 통하여 이미지 내의 정보수집을 위해 이용됨.
2. Grounding DINO : https://github.com/IDEA-Research/GroundingDINO  <br>🙋 이미지내에서 배번표 영역 검출을 위하여 이용됨
3. Langchain : https://python.langchain.com/docs/get_started/introduction  <br>🙋 Openai와 같은 외부 api를 이용하여 쉽게 개발할 수 있는 프레임워크
4. easyOCR : https://github.com/JaidedAI/EasyOCR <br>🙋 배번표 영역에서 배번표 번호를 추출하기 위해 이용됨

## 기능 설명
1. 시스템 아키텍처
![image](https://github.com/sprtms400/Granfondo_Photo_Search/assets/26298389/bd32ea8a-23fe-44b5-8bd6-c344615fe534)

2. 전체 시스템 데이터 흐름 구조도 (검색 로직은 13부터 참고하세요)
![image](https://github.com/sprtms400/Granfondo_Photo_Search/assets/26298389/28254c7d-3681-4e5e-9cc8-35cfc0ec8f9a)

3. ocrDINO 작동 로직 (배번표 검출 및 번호 검출방법)
![image](https://github.com/sprtms400/Granfondo_Photo_Search/assets/26298389/bfb19af6-2e4e-4c73-8c4f-609e2cd7954c)

4. appearance-llava 작동 로직 (인상책의 검출 방법)
![image](https://github.com/sprtms400/Granfondo_Photo_Search/assets/26298389/9e76b7a4-9ce7-4c2c-84b7-a122d2a54244)

## 개발된 환경 및 구성

OS : Ububtu 20.04

Node Version : 20.11
```
nvm install 20.11
```
의존 패키지 설치
```
npm install
```
실행 방법
```
npx ts-node server.ts
```
