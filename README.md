# 🏀 토도동 - NBA 실시간 데이터 및 채팅

## 배포링크

```
tododong.com
```

<br/>

## 🗂️ 목차

- [🔎 서비스 소개](#-서비스-소개)
- [👥 팀원 소개](#-팀원-소개)
- [🛠️ 기술 스택](#-기술-스택)
- [📝 협업 방식](#-협업-방식)
- [✨ 기능 소개](#-기능-소개)
- [📁 프로젝트 구조](#-프로젝트-구조)

<br/>

## 🔎 서비스 소개

1.	NBA 경기 일정 및 영상 함께 제공
2.	실시간 경기 데이터 제공
- 경기 점수: 현재 스코어 업데이트
- 선수 기록: 득점, 리바운드, 어시스트 등 주요 통계 제공
- 중계 텍스트: 경기 흐름을 실시간으로 텍스트 중계
3.	경기 별 실시간 채팅 기능

<br/>

## 👥 팀원 소개

| [김승수](https://github.com/seungsu-K) | [고가연](https://github.com/gayeongogo) | [윤지수](https://github.com/yoonmallang22) | [장주원](https://github.com/joowon-jang) |
| :--------------: | :--------------: | :--------------: | :--------------: |
|       <img src="https://github.com/seungsu-K.png" width="300" />       |       <img src="https://github.com/gayeongogo.png" width="300" />        |         <img src="https://github.com/yoonmallang22.png" width="300" />         |         <img src="https://github.com/joowon-jang.png" width="300" />         |
| 팀장 | 팀원 | 팀원 | 팀원 |

<br/>

## 🛠️ 기술 스택


### Frontend

| 카테고리 | 사용 기술 |
| --------- | --------- |
| Framework | <img src="https://img.shields.io/badge/NEXT.JS-000000?style=for-the-badge&logo=NEXT.JS&logoColor=white" /> |
| Language  | <img src="https://img.shields.io/badge/TYPESCRIPT-3178C6?style=for-the-badge&logo=TYPESCRIPT&logoColor=white" /> |
| Styling   | <img src="https://img.shields.io/badge/CSS MODULES-000000?style=for-the-badge&logo=CSS MODULES&logoColor=white" /> <img src="https://img.shields.io/badge/SASS-CC6699?style=for-the-badge&logo=SASS&logoColor=white" /> |
| Library   | <img src="https://img.shields.io/badge/SWIPER-6332F6?style=for-the-badge&logo=SWIPER&logoColor=white" /> <img src="https://img.shields.io/badge/DAY.JS-FF5F4C?style=for-the-badge&logo=DAY.JS&logoColor=white" /> <img src="https://img.shields.io/badge/REACT CALENDAR-61DAFB?style=for-the-badge&logo=REACT CALENDAR&logoColor=white" /> |

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


<br/>

## 📁 프로젝트 구조

클린 아키텍처 사용

<br/>

## ✨ 기능 소개
### 로그인
<img src="https://github.com/user-attachments/assets/1c5946e0-02ea-42fa-89d4-2c3ea221fd16" width="100%"/>

- JWT 토큰 발급
- accessToken을 cookie에 저장해 세션 관리
- bcryptjs로 비밀번호 암호화

### 회원가입
<img src="https://github.com/user-attachments/assets/aef23ac9-11b1-4bc6-8080-9eb3f7e8fdc7" width="100%"/>

- bcryptjs로 비밀번호 암호화
- nodemailer 이용해 이메일 인증코드 발송

### 경기 일정 조회
<img src="https://github.com/user-attachments/assets/e1d9e08c-4488-4c9a-ab2a-1be762be7e8e" width="100%"/>

- react-calender, swiper를 활용한 날짜 선택 및 경기 일정 조회
- 날짜 계산, 포맷팅 전반에 dayjs 활용
- 날짜별 경기 수 달력에 표시
- 경기별 영상 / 선수 기록 / 실시간 중계 페이지로 이동

### 경기 정보 조회
<img src="https://github.com/user-attachments/assets/30c4e2e5-101a-4b87-8837-e49f2103b50b" width="100%"/>

#### 영상
- 특정 경기의 영상을 Youtube Data API 사용해 표시
- Intersection Oberserver API로 스크롤에 반응하는 렌더링 구현
#### 선수 기록
- NBA 공식 데이터 활용
 선수 기록 컬럼별 정렬
#### 실시간 중계
- 일정 시간 간격으로 쿼터별 실시간 중계 내용 표시

### 실시간 채팅
<img src="https://github.com/user-attachments/assets/b8d80c71-55ce-4034-b4cc-756ffc7540bc" width="100%"/>

- 별도의 소켓 서버 호스팅 
- Socket IO 기반 경기별 실시간 채팅 지원
- 최근 50개 메세지 DB 조회 후 렌더링



