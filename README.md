# chinese_study

중국어 학습을 돕기 위한 웹 애플리케이션입니다.  
단어 암기, 문장 학습, 발음 연습 기능을 목표로 개발하고 있습니다.

## ✨ 주요 기능

- 중국어 단어 및 문장 학습
- 중국어 발음 지원 (TTS)
- 회차별로 정리된 학습 리스트
- 진행 상황 저장 기능 (예정)

## 📚 기술 스택

- **Next.js** 14 (App Router 사용)
- **React** 18
- **Vercel** (배포)
- **ESLint** / **Prettier** (코드 품질 관리)

## 📂 프로젝트 구조

```plaintext
src/
├── app/
│   └── page.jsx      # 메인 페이지
public/               # 정적 파일 (이미지, 아이콘 등)
next.config.js        # Next.js 설정 파일
```

## 🚀 설치 및 실행 방법

1. 프로젝트 클론

```bash
git clone https://github.com/dev-hupark/chinese_study.git
cd chinese_study
```

2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

3. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

4. 브라우저에서 열기

```plaintext
http://localhost:3000
```

## 🛠️ 배포

- [Vercel](https://vercel.com/)을 통해 배포되어 있습니다.
- 배포된 웹사이트: [https://chinese-study-liart.vercel.app](https://chinese-study-liart.vercel.app)

## 🧩 향후 계획

- 유저 로그인 및 학습 진도 저장 기능 추가
- 학습내용을 기반 한 랜덤 문제 출제 기능 추가
- 문장 듣기(TTS) 기능 개선
- 모바일 최적화
- 테스트 코드 추가 및 코드 커버리지 개선
