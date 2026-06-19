# stat

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

# 불필요한 파일 검토 (프로젝트 푸트에서 실행)

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

# DB 구조

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
