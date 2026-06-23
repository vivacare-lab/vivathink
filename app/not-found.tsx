// not-found.tsx
export default function NotFound() {
  // /dashboard/children/1234 처럼 잘못된 children ID로 접속하는 경우
  // /dashboard/childrens 처럼 잘못된 주소로 접속하는 경우

  return <div>404 Not Found</div>;
}
