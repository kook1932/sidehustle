// lib/utils.js
// 재사용 가능한 로직과 헬퍼 함수들을 모아놓은 파일입니다.

export function runRecommendationAlgorithm(allHustles, userInputs) {
    const { userTimeCommitment, userPreferredField, userInitialCapital } = userInputs;
    let scoredHustles = [];

    allHustles.forEach(hustle => {
        let score = 0;

        // 시간 부합도 점수
        if (hustle.time_commitment === userTimeCommitment) score += 3;
        else if (userTimeCommitment === 'high' && (hustle.time_commitment === 'medium' || hustle.time_commitment === 'low')) score += 1.5;
        else if (userTimeCommitment === 'medium' && hustle.time_commitment === 'low') score += 1;
        else if (userTimeCommitment === 'low' && (hustle.time_commitment === 'medium' || hustle.time_commitment === 'high')) score -= 5;
        else if (userTimeCommitment === 'medium' && hustle.time_commitment === 'high') score -= 3;

        // 선호 분야 부합도 점수
        if (hustle.field_tags && hustle.field_tags.includes(userPreferredField)) score += 5;
        if (userPreferredField === "digital_online" && hustle.field_tags && (hustle.field_tags.includes("content_creation") || hustle.field_tags.includes("knowledge_sharing") || hustle.field_tags.includes("marketing"))) score += 1;
        if (userPreferredField === "creative_art" && hustle.field_tags && (hustle.field_tags.includes("content_creation") || hustle.field_tags.includes("writing") || hustle.field_tags.includes("crafting"))) score += 1;
        if (hustle.field_tags && hustle.field_tags.includes("easy_start") && userPreferredField !== "easy_start") score += 0.5;

        // 초기 자본 부합도 점수
        if (userInitialCapital === "none" && hustle.initial_cost !== "none") score -= 4;
        else if (userInitialCapital === "low" && hustle.initial_cost === "medium_or_high") score -= 2;
        else if (hustle.initial_cost === userInitialCapital || (userInitialCapital === "medium_or_high") || (userInitialCapital === "low" && hustle.initial_cost === "none")) score += 2;
        
        if (score >= 1) {
            scoredHustles.push({ ...hustle, score });
        }
    });

    scoredHustles.sort((a, b) => b.score - a.score);
    return scoredHustles.slice(0, 3);
}

export function translateSelectOption(value, type) {
    const timeTranslations = { 'low': '주 5시간 미만', 'medium': '주 5-10시간', 'high': '주 10시간 이상' };
    const costTranslations = { 'none': '거의 없음 (무자본)', 'low': '낮음 (10만원 미만)', 'medium_or_high': '보통 이상 (10만원 이상)' };
    const fieldTranslations = { "digital_online": "디지털/온라인", "content_creation": "콘텐츠 제작", "easy_start": "쉬운 시작", "creative_art": "창작/예술", "offline_active": "오프라인/활동적", "knowledge_sharing": "지식 공유", "writing": "글쓰기", "marketing": "마케팅", "service": "서비스", "crafting": "수공예" };
    const incomeTranslations = { 'low': '낮음', 'medium': '중간', 'high': '높음' };

    if (type === 'time') return timeTranslations[value] || value || '정보 없음';
    if (type === 'cost') return costTranslations[value] || value || '정보 없음';
    if (type === 'field') return fieldTranslations[value] || value || '정보 없음';
    if (type === 'income') return incomeTranslations[value] || value || '정보 없음';
    return value || '정보 없음';
}
