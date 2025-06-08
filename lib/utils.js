// lib/utils.js
// 재사용 가능한 로직과 헬퍼 함수들을 모아놓은 파일입니다.

// 고도화된 추천 알고리즘
export function runRecommendationAlgorithm(allHustles, userInputs) {
    const { userTimeCommitment, userPreferredField, userInitialCapital } = userInputs;
    
    // 1. 태그 관계도 정의 (확장성을 위해 분리)
    // 사용자가 선택할 만한 대표 분야(key)와 그에 속하는 세부 태그(value)들을 매핑합니다.
    const tagRelations = {
        "digital_online": ["content_creation", "writing", "marketing", "design", "data_processing", "tech", "sales", "passive_income", "home_based"],
        "creative_art": ["content_creation", "design", "writing", "crafting"],
        "knowledge_sharing": ["service", "tech", "expert_skill"],
        "service": ["knowledge_sharing", "home_based", "sales"],
        "marketing": ["content_creation", "writing", "sales"],
        "offline_active": ["service"]
    };

    let scoredHustles = [];

    allHustles.forEach(hustle => {
        let score = 0;

        // 2. 점수 계산 로직 (시간 및 비용은 기존 유지)
        // 시간 부합도 점수
        if (hustle.time_commitment === userTimeCommitment) score += 3;
        else if (userTimeCommitment === 'high' && (hustle.time_commitment === 'medium' || hustle.time_commitment === 'low')) score += 1.5;
        else if (userTimeCommitment === 'medium' && hustle.time_commitment === 'low') score += 1;
        else if (userTimeCommitment === 'low' && (hustle.time_commitment === 'medium' || hustle.time_commitment === 'high')) score -= 5;
        else if (userTimeCommitment === 'medium' && hustle.time_commitment === 'high') score -= 3;

        // 초기 비용 부합도 점수
        if (userInitialCapital === "none" && (hustle.initial_cost === "low" || hustle.initial_cost === "medium_or_high")) score -= 4;
        else if (userInitialCapital === "low" && hustle.initial_cost === "medium_or_high") score -= 2;
        else if (hustle.initial_cost === userInitialCapital || (userInitialCapital === "medium_or_high") || (userInitialCapital === "low" && hustle.initial_cost === "none")) score += 2;

        // 3. 고도화된 선호 분야 점수 로직
        if (hustle.field_tags && hustle.field_tags.length > 0) {
            // 3-1. 완전 일치 점수 (가중치: 5)
            if (hustle.field_tags.includes(userPreferredField)) {
                score += 5;
            }

            // 3-2. 연관 분야 점수 (가중치: 태그당 1.5)
            const relatedTags = tagRelations[userPreferredField] || [];
            hustle.field_tags.forEach(tag => {
                // 완전 일치로 점수를 받은 태그는 중복 계산하지 않음
                if (tag !== userPreferredField && relatedTags.includes(tag)) {
                    score += 1.5;
                }
            });

            // 3-3. 범용 태그 추가 점수 (가중치: 0.5)
            // '쉬운 시작'은 언제나 좋은 옵션이므로 약간의 추가 점수를 줍니다.
            if (hustle.field_tags.includes("easy_start")) {
                score += 0.5;
            }
        }
        
        // 최종 점수가 1점 이상인 경우에만 추천 목록에 포함
        if (score >= 1) {
            scoredHustles.push({ ...hustle, score });
        }
    });

    // 최종 점수 순으로 내림차순 정렬 후 상위 3개 반환
    scoredHustles.sort((a, b) => b.score - a.score);
    return scoredHustles.slice(0, 3);
}


// 기존 번역 함수 (변경 없음)
export function translateSelectOption(value, type) {
    const timeTranslations = { 'low': '주 5시간 미만', 'medium': '주 5-10시간', 'high': '주 10시간 이상' };
    const costTranslations = { 'none': '거의 없음 (무자본)', 'low': '낮음 (10만원 미만)', 'medium_or_high': '보통 이상 (10만원 이상)' };
    const fieldTranslations = { "digital_online": "디지털/온라인", "content_creation": "콘텐츠 제작", "easy_start": "쉬운 시작", "creative_art": "창작/예술", "offline_active": "오프라인/활동적", "knowledge_sharing": "지식 공유", "writing": "글쓰기", "marketing": "마케팅", "service": "서비스", "design": "디자인", "crafting": "공예", "expert_skill": "전문 기술", "passive_income": "소극적 소득", "home_based": "재택", "data_processing": "데이터 처리", "tech": "IT/기술", "sales": "판매/유통"};

    if (type === 'time') return timeTranslations[value] || value;
    if (type === 'cost') return costTranslations[value] || value;
    if (type === 'field') return fieldTranslations[value] || value;
    return value;
}