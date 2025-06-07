// components/RecommendationClient.js
"use client";

import { useState } from 'react';
import { runRecommendationAlgorithm, translateSelectOption } from '../../lib/utils'; // 유틸리티 함수 임포트

// UI와 상태 관리, 사용자 인터랙션을 담당하는 컴포넌트
export default function RecommendationClient({ allSideHustles }) {
  // allSideHustles는 서버 컴포넌트로부터 props로 전달받은 데이터입니다.
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [timeCommitment, setTimeCommitment] = useState('medium');
  const [preferredField, setPreferredField] = useState('easy_start');
  const [initialCapital, setInitialCapital] = useState('none');

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // 데이터가 없는 경우 처리 (서버에서 로딩 실패 시)
    if (!allSideHustles || allSideHustles.length === 0) {
        setError("추천할 부업 데이터가 없습니다. 페이지를 새로고침 해주세요.");
        setIsLoading(false);
        return;
    }
    const userInputs = { 
        userTimeCommitment: timeCommitment, 
        userPreferredField: preferredField, 
        userInitialCapital: initialCapital 
    };

    // 클라이언트에서 추천 알고리즘 실행
    // setTimeout을 사용해 로딩 상태를 시각적으로 보여주는 효과를 줄 수 있습니다.
    setTimeout(() => {
      const results = runRecommendationAlgorithm(allSideHustles, userInputs);
      setRecommendations(results);
      setIsLoading(false);
    }, 500); // 0.5초 딜레이
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* 시간 투자 */}
          <div>
              <label htmlFor="timeCommitment" className="block text-sm font-medium text-darktext mb-1">1. 일주일에 부업에 투자할 수 있는 시간은?</label>
              <select id="timeCommitment" value={timeCommitment} onChange={(e) => setTimeCommitment(e.target.value)}
                  className="mt-1 block w-full py-3 px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                  <option value="low">5시간 미만</option>
                  <option value="medium">5-10시간</option>
                  <option value="high">10시간 이상</option>
              </select>
          </div>
          {/* 다른 select 요소들도 동일하게配置 */}
          <div>
              <label htmlFor="preferredField" className="block text-sm font-medium text-darktext mb-1">2. 어떤 분야의 부업을 선호하시나요?</label>
              <select id="preferredField" value={preferredField} onChange={(e) => setPreferredField(e.target.value)}
                    className="mt-1 block w-full py-3 px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                  <option value="digital_online">디지털/온라인</option>
                  <option value="creative_art">창작/예술</option>
                  <option value="offline_active">오프라인/활동적인 일</option>
                  <option value="easy_start">특별한 기술 없이 쉽게 시작</option>
              </select>
          </div>
          <div>
              <label htmlFor="initialCapital" className="block text-sm font-medium text-darktext mb-1">3. 부업 시작을 위해 어느 정도의 초기 자본을 생각하시나요?</label>
                <select id="initialCapital" value={initialCapital} onChange={(e) => setInitialCapital(e.target.value)}
                    className="mt-1 block w-full py-3 px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                  <option value="none">거의 없음 (0원)</option>
                  <option value="low">조금 (10만원 미만)</option>
                  <option value="medium_or_high">괜찮음 (10만원 이상)</option>
              </select>
          </div>

          <button type="submit" disabled={isLoading}
              className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
              {isLoading ? '추천 찾는 중...' : '나에게 맞는 부업 추천받기'}
          </button>
      </form>

      <div id="resultsContainer" className="mt-10">
          <h2 className="text-2xl font-semibold text-darktext mb-4 pb-2 border-b-2 border-primary">추천 부업</h2>
          {isLoading && <div className="text-center p-4"><div className="loader inline-block"></div></div>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!isLoading && !error && recommendations.length === 0 && <p className="text-mediumtext text-center">질문에 답변하고 '추천 받기' 버튼을 눌러주세요.</p>}
          {!isLoading && !error && recommendations.length > 0 && (
              <div className="space-y-4">
                  {recommendations.map(hustle => (
                      <div key={hustle.id} className="bg-gray-50 p-4 rounded-lg shadow animate-fade-in">
                          <h3 className="text-xl font-semibold text-primary mb-2">{hustle.name} <span className="text-sm font-normal text-gray-500">(추천점수: {hustle.score.toFixed(1)})</span></h3>
                          <p className="text-sm text-gray-700 mb-1"><strong className="font-medium text-darktext">간단 설명:</strong> {hustle.description || '설명 없음'}</p>
                          <p className="text-sm text-gray-700 mb-1"><strong className="font-medium text-darktext">예상 시간 투자:</strong> {translateSelectOption(hustle.time_commitment, 'time')}</p>
                          <p className="text-sm text-gray-700 mb-1"><strong className="font-medium text-darktext">초기 자본 수준:</strong> {translateSelectOption(hustle.initial_cost, 'cost')}</p>
                          <p className="text-sm text-gray-700 mb-1"><strong className="font-medium text-darktext">주요 분야 태그:</strong> {hustle.field_tags && hustle.field_tags.length > 0 ? hustle.field_tags.map(tag => translateSelectOption(tag, 'field')).join(', ') : '태그 없음'}</p>
                          {hustle.income_potential && <p className="text-sm text-gray-700 mb-1"><strong className="font-medium text-darktext">수입 잠재력:</strong> ${translateSelectOption(hustle.income_potential, 'income')}</p>}
                          <p className="text-sm text-gray-700"><strong className="font-medium text-darktext">세부사항:</strong> {hustle.details || '추가 정보 없음'}</p>
                      </div>
                  ))}
              </div>
          )}
      </div>
       <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}
