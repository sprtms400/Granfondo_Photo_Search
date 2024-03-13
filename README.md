# 마라톤, 그란폰도 대회 이미지 검색 및 컨텐츠 관리 API 서비스
마라톤, 그란폰도 대회 이미지에 대하여 자동 수집 및 컨텐츠 분석과 검색이 가능한 시스템입니다.
대회중에 찍힌 사진에 대하여 자동적으로 아래 항목에 대하여 레이블링을 진행합니다.

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

### 프로젝트의 관련 Repositories
1. 네이버 이미지 크롤러 : https://github.com/sprtms400/Naver_Cafe_Image_Crawler
2. 배번표 분석기 : https://github.com/sprtms400/ocrDINO_NumberExtractor
3. 인상착의 분석기 : https://github.com/sprtms400/appearance-llava

### 기능 설명
![image](https://github.com/sprtms400/Granfondo_Photo_Search/assets/26298389/c6dc48a4-7b52-41c6-95f8-1810a8ffb910)
본 Repository는 위의 시스템 아키텍처에서 녹색 사각형으로 하이라이팅한 부분에 대한 리포지터리입니다.
제공하는 기능은 다음과 같습니다.
1. 사진에 대한 업로드 및 메타데이터 추출
2. 대회 정보에대한 관리
3. 이용자 관리

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
