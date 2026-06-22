```
다음 단계...
1. 안정화 + Beta 배포
2. 앱(PWA)화
3. 학습 데이터 분석
```

# 프로젝트

### Executive Summary

name : 창의력 질문 훈련소 Creative Question Training Platform
sub title : 창의력 체육관
description : 부모-자녀 협력 기반의 AI 활용 창의적 질문 능력 개발 어플리케이션입니다. 아이들이 주어진 키워드로 창의적인 질문을 만들고, AI가 이를 평가하여 더 나은 질문으로 발전 시킬 수 있도록 가이드 합니다. 부모는 아이의 학습 진행도를 모니터링 하고, 목표 달성 시 선물/용돈을 제공 할 수 있습니다.

## Stack

frontend: React + javascript (MVP 생성용)
mobile : React Native(Expo)
backend : Node.js +Express
database: supabase (DB + 인증)
ai : OpenAIGPT-3.5
hosting : Vercel +Firebase

## util

```
## UI
npx shadcn@latest init

## AI
npm install openai

## Backend
npm install @supabase/supabase-js

## 상태관리
npm install zustand

## Form
npm install react-hook-form zod

## 유틸
npm install clsx tailwind-merge
```

# 불필요한 파일 검토 (프로젝트 Root에서 실행)

```
## TypeScript 타입 체크

npx tsc --noEmit

## ESLint

npm run lint

## 사용하지 않는 파일/exports 탐지

npx knip

## 사용하지 않는 dependencies 탐지

npx depcheck

## 특정 파일 참조 확인

grep -R "openai" .
grep -R "@/ai/gemini" .
grep -R "@google/genai" .
grep -R "training-records" .
```

# DB 구조 (변동 될 수 있음)

user

```spl
id
name
email
created_at
```

questions

```spl
id
title
content
difficulty
category
created_at
```

answers

```spl
id
user_id
question_id
answer
ai_feedback
score
created_at
```

training_logs

```spl
id
user_id
date
training_time
score
```
