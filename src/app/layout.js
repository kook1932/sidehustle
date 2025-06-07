// app/layout.js
import './globals.css'; // 전역 CSS 파일 임포트
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// 페이지의 메타 데이터를 정의합니다.
export const metadata = {
  title: '맞춤 부업 추천',
  description: 'Next.js와 Supabase로 만든 부업 추천 앱',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      {/* <body> 태그에 폰트 클래스를 적용합니다. */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}
