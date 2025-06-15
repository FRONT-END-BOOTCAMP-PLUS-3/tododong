# 🏀 토도동 - NBA 실시간 데이터 및 채팅

## 배포링크

> https://tododong.com

<br/>

## 🗂️ 목차

- [🔎 서비스 소개](#-서비스-소개)
- [👥 팀원 소개](#-팀원-소개)
- [🛠️ 기술 스택](#-기술-스택)
- [📝 협업 방식](#-협업-방식)
- [✨ 기능 소개](#-기능-소개)
- [💾 ERD](#-ERD)
- [📁 프로젝트 구조](#-프로젝트-구조)

<br/>

## 🔎 서비스 소개

1.  NBA 경기 일정 및 영상 함께 제공
2.  실시간 경기 데이터 제공
- 경기 점수: 현재 스코어 업데이트
- 선수 기록: 득점, 리바운드, 어시스트 등 주요 통계 제공
- 중계 텍스트: 경기 흐름을 실시간으로 텍스트 중계
3.  경기 별 실시간 채팅 기능

<br/>

## 👥 팀원 소개

| [김승수](https://github.com/seungsu-K) | [고가연](https://github.com/gayeongogo) | [윤지수](https://github.com/yoonmallang22) | [장주원](https://github.com/joowon-jang) |
| :--------------: | :--------------: | :--------------: | :--------------: |
|       <img src="https://github.com/seungsu-K.png" width="300" />       |       <img src="https://github.com/gayeongogo.png" width="300" />        |         <img src="https://github.com/yoonmallang22.png" width="300" />         |         <img src="https://github.com/joowon-jang.png" width="300" />         |
| 팀장 | 팀원 | 팀원 | 팀원 |

<br/>

## 🛠 기술 스택

### Frontend

| 카테고리 | 사용 기술 |
| --------- | --------- |
| Framework | <img src="https://img.shields.io/badge/NEXT.JS-000000?style=for-the-badge&logo=NEXT.JS&logoColor=white" /> |
| Language  | <img src="https://img.shields.io/badge/TYPESCRIPT-3178C6?style=for-the-badge&logo=TYPESCRIPT&logoColor=white" /> |
| Styling   | <img src="https://img.shields.io/badge/CSS%20MODULES-000000?style=for-the-badge&logo=CSS%20MODULES&logoColor=white" /> <img src="https://img.shields.io/badge/SASS-CC6699?style=for-the-badge&logo=SASS&logoColor=white" /> |
| Library   | <img src="https://img.shields.io/badge/SWIPER-6332F6?style=for-the-badge&logo=SWIPER&logoColor=white" /> <img src="https://img.shields.io/badge/DAY.JS-FF5F4C?style=for-the-badge&logo=DAY.JS&logoColor=white" /> <img src="https://img.shields.io/badge/REACT%20CALENDAR-61DAFB?style=for-the-badge&logo=REACT%20CALENDAR&logoColor=white" /> |

### Bankend

| 카테고리 | 사용 기술 |
| --------- | --------- |
| ORM        | <img src="https://img.shields.io/badge/PRISMA-2D3748?style=for-the-badge&logo=PRISMA&logoColor=white" /> |
| WebSockets | <img src="https://img.shields.io/badge/SOCKET.IO-010101?style=for-the-badge&logo=SOCKET.IO&logoColor=white" /> |

### Development

| 카테고리    | 사용 기술 |
| --------- | --------- |
| 패키지 관리 | <img src="https://img.shields.io/badge/PNPM-F69220?style=for-the-badge&logo=PNPM&logoColor=white" /> |
| 협업 도구  | <img src="https://img.shields.io/badge/FIGMA-F24E1E?style=for-the-badge&logo=FIGMA&logoColor=white" /> <img src="https://img.shields.io/badge/NOTION-000000?style=for-the-badge&logo=NOTION&logoColor=white" /> <img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=GITHUB&logoColor=white" /> <img src="https://img.shields.io/badge/DISCORD-5865F2?style=for-the-badge&logo=DISCORD&logoColor=white" /> |

<br/>

## 📝 협업 방식

### Git Flow 전략
![image](https://github.com/user-attachments/assets/415629da-3500-47a6-89b8-f15ba245a62e)

### 커밋 컨벤션
```
#   ✨ feat    : 기능 한 줄 설명 (새로운 기능, 새로운 브랜치 생성)
#   예시) ✨ feat  : 알림 읽음 처리 기능 추가 (기능 설명)

#   🐛 fix     : 버그 수정 설명
#   예시) 🐛 fix   : 스토리 댓글 기능 게시 버튼 작동

#   🎨 design   : css 디자인 설명
#   예시) 🎨 design : flexbox 추가

#   💄 style   : 스타일 (코드 형식, 명칭 변경, 주석 추가 또는 수정 -> 동작에 영향 없음)
#   예시) 💄 style : 알림 리스트 클래스 뷰 변수() 문구 변경

#   📝 docs    : 문서 (README 등 각종 Markdown만)
#   예시) 📝 docs  : readme 팀원 추가

#   🔧 chore   : 기타 변경사항 (빌드 스크립트 수정 등 MD 제외 모든 파일)
#   예시) 🔧 chore : gitignore redis 추가, chore : migrations 파일 추가

#   ♻️ refactor : 이미 올렸던 코드 변경 했을 때 (로직 변경)
```

### PR 점검사항 (코드 리뷰)

- 웹 접근성
- 성능 향상
- 코드 가독성
- 아키텍처 분리

<br/>

## ✨ 기능 소개
### 로그인
<img src="https://github.com/user-attachments/assets/4ec95b42-8cca-4c59-b4d8-244631960f28" width="100%"/>

- JWT 토큰 발급
- accessToken을 cookie에 저장해 세션 관리
- bcryptjs로 비밀번호 암호화

### 회원가입
<img src="https://github.com/user-attachments/assets/20b5c79c-23f0-4d78-ab75-f4c8054e896b" width="100%"/>

- bcryptjs로 비밀번호 암호화
- nodemailer 이용해 이메일 인증코드 발송

### 경기 일정 조회
<img src="https://github.com/user-attachments/assets/d05c50a7-1dd4-4ac4-8d45-862a733af004" width="100%"/>

- react-calender, swiper를 활용한 날짜 선택 및 경기 일정 조회
- 날짜 계산, 포맷팅 전반에 dayjs 활용
- 날짜별 경기 수 달력에 표시
- 경기별 영상 / 선수 기록 / 실시간 중계 페이지로 이동

### 경기 정보 조회
<img src="https://github.com/user-attachments/assets/d342aaab-ebf0-49b0-88c5-e863a9485080" width="100%"/>

#### 영상
- 특정 경기의 영상을 Youtube Data API 사용해 표시
- Intersection Oberserver API로 스크롤에 반응하는 렌더링 구현
#### 선수 기록
- NBA 공식 데이터 활용
 선수 기록 컬럼별 정렬
#### 실시간 중계
- 일정 시간 간격으로 쿼터별 실시간 중계 내용 표시

### 실시간 채팅
<img src="https://github.com/user-attachments/assets/0b660309-e5de-4cd1-8a49-d3990818ab8a" width="100%"/>

- 별도의 소켓 서버 호스팅 
- Socket IO 기반 경기별 실시간 채팅 지원
- 최근 50개 메세지 DB 조회 후 렌더링

<br/>

## 💾 ERD
![ERD](https://github.com/user-attachments/assets/61178fd1-9f74-43b8-86bd-cad7e4c6d840)

<br/>

## 📁 프로젝트 구조

### 클린 아키텍처

- UI(Page) [프레젠테이션 계층]: Next.js의 app 디렉터리 내부의 page.tsx 파일들
- API Routes [Adapter 계층]: /app/api 디렉터리 내부의 API 핸들러
- UseCase(Service) [비즈니스 로직 계층]: /application/usecases 디렉터리에서 애플리케이션의 핵심 로직을 처리
- Entity [도메인 계층]: /domain/entities 디렉터리에서 데이터 구조 및 도메인 모델 정의

<img src="https://velog.velcdn.com/images/juwon98/post/2c77cf45-fc8b-4a00-bb89-81de6ccb81ac/image.png" width="100%" />
