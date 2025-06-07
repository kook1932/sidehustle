// app/page.js

import { supabase } from '../../lib/supabaseClient';
import RecommendationClient from '../components/RecommendationClient';

// 서버에서 데이터를 미리 가져오는 함수
async function fetchSideHustles() {
  // 서버에서 직접 Supabase 클라이언트를 호출합니다.
  const { data, error } = await supabase
    .from('side_hustles')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching side hustles from server:', error);
    return []; // 오류 발생 시 빈 배열 반환
  }
  return data;
}

// 메인 페이지 컴포넌트. async 함수로 선언하여 서버에서 데이터 페칭 가능
export default async function HomePage() {
  // 페이지가 렌더링되기 전에 서버에서 데이터를 가져옵니다.
  const allSideHustles = await fetchSideHustles();

  return (
    <>
      <div className="bg-lightgray text-darktext min-h-screen flex flex-col items-center justify-center p-4 font-['Inter',_sans-serif]">
        <div className="container bg-white shadow-xl rounded-lg p-6 md:p-10 w-full max-w-2xl">
          <header className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">맞춤 부업 추천</h1>
              <p className="text-mediumtext text-sm md:text-base">몇 가지 질문에 답해주시면 최적의 부업을 찾아드릴게요!</p>
          </header>

          <main>
            {/* 클라이언트 컴포넌트에 서버에서 가져온 데이터를 props로 전달합니다. */}
            <RecommendationClient allSideHustles={allSideHustles} />
          </main>

          <footer className="text-center mt-10 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} 맞춤 부업 추천. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  );
}
