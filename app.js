/**
 * maimai DX CIRCLE PLUS DX Rating Calculator & Recommendation Engine
 * Standalone JavaScript Logic
 */

// Global State
let currentLang = 'ko';
let currentVersion = 'circle_plus';
let savedTracks = []; // Holds all saved track objects: { id, name, category, constant, achievement, comboMark, rating, exact, rank }
let activeFilter = 'all'; // 'all', 'new', 'old'
let validStepPoints = []; // Holds achievement points that ACTUALLY upgrade single chart rating

// Dictionary for Internationalization (i18n)
const i18n = {
  ko: {
    subtitle: 'maimai DX CIRCLE PLUS DX 레이팅 계산 & 스코어링 추천 툴',
    versionLabel: '게임 버전',
    trackInputHeader: '트랙 성과 입력',
    singleTrackMode: '단곡 계산 모드',
    trackNameLabel: '곡명 / 메모 (선택사항)',
    trackNamePlaceholder: '예: FREEDOM DiVE, 14.7, Master 등',
    trackCategoryLabel: '곡 구분 (신곡 / 구곡)',
    catNew: '신곡 枠 (CiRCLE)',
    catNewSub: '상위 15곡 적용',
    catOld: '구곡 枠 (Best)',
    catOldSub: '상위 35곡 적용',
    trackConstant: '보면 상수 (Internal Level)',
    levelHint: '범위: 1.0 - 15.4',
    achievement: '달성률 (%)',
    comboMark: '달성 마크 (Clear / All Perfect)',
    markClearSub: '일반 클리어 / FC (보너스 없음)',
    markApSub: '레이팅 +1 보너스 적용',
    singleTrackRating: '단곡 DX 레이팅',
    b50Contribution: 'Best 50 기여도:',
    baseConstant: '보면 상수',
    rankFactor: '랭크 계수',
    effectiveAchieve: '계산 달성률 (Cap 100.5%)',
    apBonusLabel: 'AP / AP+ 보너스',
    exactDecimal: '소수점 계산치',
    addTrackToBest50: 'Best 50 리스트에 추가 / 갱신',
    recommendationHeader: '달성률 상승 시 DX 레이팅 획득 시뮬레이터',
    recommendationSub: '슬라이더가 레이팅이 실제로 상승하는 최소 달성률 지점으로 스냅됩니다',
    best50Header: 'Best 50 & DX 레이팅 요약',
    totalRating: '최종 DX RATING',
    export: '내보내기',
    import: '가져오기',
    clearAll: '전체 삭제',
    emptyBest50Msg: '저장된 트랙이 없습니다. 왼쪽에서 트랙 성과를 입력하고 "Best 50 리스트에 추가"를 클릭하세요!',
    tableCategory: '구분',
    tableTrackName: '곡명 / 메모',
    tableConstant: '상수',
    tableAchieve: '달성률',
    tableMark: '마크',
    tableRank: '랭크',
    tableRating: 'RATING',
    tableAction: '삭제',
    footerNotice: 'maimai DX 및 DX RATING은 SEGA Interactive의 상표 및 게임 서비스입니다. 본 서비스는 리듬게임 유저 커뮤니티 데이터 및 나무위키를 바탕으로 제작된 비공식 웹 계산기 툴입니다.',
    
    // Simulator & Recommendation texts
    previewTitle: '달성률 상승 예상치',
    targetAchieveLabel: '목표 달성률:',
    achieveDeltaLabel: '필요 상승량:',
    targetRatingLabel: '예상 RATING:',
    ratingGainLabel: '레이팅 상승량:',
    
    recRankTarget: '{targetRank} 랭크 ({targetAchieve}%) 달성',
    recRankDesc: '달성률을 {achieveDelta}% 올려 {targetRank} 랭크 계수({rankFactor}) 적용',
    recMaxPerfTitle: '최고 성과 달성',
    recMaxPerfDesc: '이 트랙은 이미 해당 보면 상수에서 획득 가능한 최고 DX 레이팅(SSS+ AP 100.5%+)을 달성했습니다!',

    confirmClear: 'Best 50 트랙 목록을 모두 삭제하시겠습니까?',
    trackAdded: '트랙 성과가 Best 50 리스트에 추가되었습니다!',

    currTierPrefix: '현재 플레이트: ',
    nextTierPrefix: '다음 플레이트: ',
    needUpPrefix: '다음 등급까지 +',
    needUpSuffix: ' RATING 필요',
    maxTierReached: '최고 등급 (Rainbow) 달성!',
    untitledTrack: '미지정 트랙',
    currentAchieveStep: '현재 달성률',
    tabAll: '전체 (Best 50)',
    tabNew: '신곡 枠 (Top 15)',
    tabOld: '구곡 枠 (Top 35)'
  },
  en: {
    subtitle: 'maimai DX CIRCLE PLUS DX Rating & Scoring Optimization Tool',
    versionLabel: 'Game Version',
    trackInputHeader: 'Track Score Entry',
    singleTrackMode: 'Single Track Mode',
    trackNameLabel: 'Track Name / Memo (Optional)',
    trackNamePlaceholder: 'e.g. FREEDOM DiVE, 14.7, Master, etc.',
    trackCategoryLabel: 'Track Category (New / Old)',
    catNew: 'New Chart (CiRCLE)',
    catNewSub: 'Top 15 Applicable',
    catOld: 'Old Chart (Best)',
    catOldSub: 'Top 35 Applicable',
    trackConstant: 'Chart Constant (Internal Level)',
    levelHint: 'Range: 1.0 - 15.4',
    achievement: 'Achievement Rate (%)',
    comboMark: 'Clear Mark (Clear / All Perfect)',
    markClearSub: 'Normal Clear / FC (No Bonus)',
    markApSub: '+1 Rating Bonus Applied',
    singleTrackRating: 'SINGLE CHART DX RATING',
    b50Contribution: 'Best-50 Contribution:',
    baseConstant: 'Chart Constant',
    rankFactor: 'Rank Factor',
    effectiveAchieve: 'Calculation Achievement (Cap 100.5%)',
    apBonusLabel: 'AP / AP+ Bonus',
    exactDecimal: 'Unfloored Exact',
    addTrackToBest50: 'Add / Update in Best 50 Track List',
    recommendationHeader: 'Achievement & DX Rating Gain Simulator',
    recommendationSub: 'Slider snaps to exact points where DX Rating increases',
    best50Header: 'Best 50 Tracks & DX Rating Summary',
    totalRating: 'TOTAL DX RATING',
    export: 'Export',
    import: 'Import',
    clearAll: 'Clear All',
    emptyBest50Msg: 'No tracks in your Best 50 list yet. Enter a track on the left and click "Add / Update in Best 50 Track List"!',
    tableCategory: 'Type',
    tableTrackName: 'Track / Memo',
    tableConstant: 'Constant',
    tableAchieve: 'Achieve %',
    tableMark: 'Mark',
    tableRank: 'Rank',
    tableRating: 'RATING',
    tableAction: 'Action',
    footerNotice: 'maimai DX & DX RATING are trademarks of SEGA Interactive. Formulas based on maimai community data & Namuwiki.',

    previewTitle: 'Achievement Gain Forecast',
    targetAchieveLabel: 'Target Achieve:',
    achieveDeltaLabel: 'Required Gain:',
    targetRatingLabel: 'Expected RATING:',
    ratingGainLabel: 'Rating Gain:',

    recRankTarget: 'Reach {targetRank} Rank ({targetAchieve}%)',
    recRankDesc: 'Increase achievement by +{achieveDelta}% to trigger {targetRank} factor ({rankFactor})',

    recMaxPerfTitle: 'MAXIMUM PERFORMANCE',
    recMaxPerfDesc: 'This track is already at maximum possible DX Rating (SSS+ AP 100.5%+) for the selected chart constant!',

    confirmClear: 'Are you sure you want to clear your entire Best 50 track list?',
    trackAdded: 'Track added to your Best 50 list!',

    currTierPrefix: 'Current Plate: ',
    nextTierPrefix: 'Next Plate: ',
    needUpPrefix: 'Need +',
    needUpSuffix: ' RATING to rank up',
    maxTierReached: 'MAX TIER (Rainbow) REACHED!',
    untitledTrack: 'Untitled Track',
    currentAchieveStep: 'Current Achieve',
    tabAll: 'All (Best 50)',
    tabNew: 'New Charts (Top 15)',
    tabOld: 'Old Charts (Top 35)'
  }
};

// Rank & Factor Lookup
function getRankData(achievement) {
  if (achievement >= 100.5000) return { rank: 'SSS+', factor: 22.4, css: 'rank-sss-p' };
  if (achievement >= 100.0000) return { rank: 'SSS', factor: 21.6, css: 'rank-sss' };
  if (achievement >= 99.5000) return { rank: 'SS+', factor: 21.1, css: 'rank-ss-p' };
  if (achievement >= 99.0000) return { rank: 'SS', factor: 20.8, css: 'rank-ss' };
  if (achievement >= 98.0000) return { rank: 'S+', factor: 20.3, css: 'rank-s-p' };
  if (achievement >= 97.0000) return { rank: 'S', factor: 20.0, css: 'rank-s' };
  if (achievement >= 94.0000) return { rank: 'AAA', factor: 16.8, css: 'rank-aaa' };
  if (achievement >= 90.0000) return { rank: 'AA', factor: 15.2, css: 'rank-aa' };
  if (achievement >= 80.0000) return { rank: 'A', factor: 13.6, css: 'rank-a' };
  if (achievement >= 75.0000) return { rank: 'BBB', factor: 12.0, css: 'rank-lower' };
  if (achievement >= 70.0000) return { rank: 'BB', factor: 10.0, css: 'rank-lower' };
  if (achievement >= 60.0000) return { rank: 'B', factor: 8.0, css: 'rank-lower' };
  if (achievement >= 50.0000) return { rank: 'C', factor: 5.0, css: 'rank-lower' };
  return { rank: 'D', factor: 0.0, css: 'rank-lower' };
}

// Single Track DX Rating Calculation (AP / AP+ adds +1 bonus rating)
function calculateTrackRating(constant, achievement, comboMark = 'CLEAR') {
  const capAchieve = Math.min(achievement, 100.5000);
  const rankData = getRankData(achievement);
  const isAP = (comboMark === 'AP' || comboMark === 'AP+');
  const apBonus = isAP ? 1 : 0;

  const exactBase = (constant * capAchieve * rankData.factor) / 100.0;
  const baseRating = Math.floor(exactBase);
  const rating = baseRating + apBonus;

  return {
    constant,
    achievement,
    capAchieve,
    rankData,
    isAP,
    apBonus,
    baseRating,
    exact: exactBase + apBonus,
    rating
  };
}

// Color Rating Plate & Sub-tier Lookup
function getTierInfo(ratingVal, isTotalRating = false) {
  const totalEquiv = isTotalRating ? ratingVal : (ratingVal * 50);

  let nameKo = '하양';
  let nameEn = 'White';
  let css = 'tier-white';
  let rangeMin = 0;
  let rangeMax = 999;
  let nextNameKo = '파랑';
  let nextNameEn = 'Blue';
  let nextMin = 1000;

  if (totalEquiv >= 16750) {
    nameKo = '무지개(극) ☆☆☆☆'; nameEn = 'Rainbow (Goku) ☆☆☆☆'; css = 'tier-rainbow';
    rangeMin = 16750; rangeMax = 20000; nextNameKo = 'MAX'; nextNameEn = 'MAX'; nextMin = 16750;
  } else if (totalEquiv >= 16500) {
    nameKo = '무지개(극) ☆☆☆'; nameEn = 'Rainbow (Goku) ☆☆☆'; css = 'tier-rainbow';
    rangeMin = 16500; rangeMax = 16749; nextNameKo = '무지개(극) ☆☆☆☆'; nextNameEn = 'Rainbow (Goku) ☆☆☆☆'; nextMin = 16750;
  } else if (totalEquiv >= 16250) {
    nameKo = '무지개(극) ☆☆'; nameEn = 'Rainbow (Goku) ☆☆'; css = 'tier-rainbow';
    rangeMin = 16250; rangeMax = 16499; nextNameKo = '무지개(극) ☆☆☆'; nextNameEn = 'Rainbow (Goku) ☆☆☆'; nextMin = 16500;
  } else if (totalEquiv >= 16000) {
    nameKo = '무지개(극) ☆'; nameEn = 'Rainbow (Goku) ☆'; css = 'tier-rainbow';
    rangeMin = 16000; rangeMax = 16249; nextNameKo = '무지개(극) ☆☆'; nextNameEn = 'Rainbow (Goku) ☆☆'; nextMin = 16250;
  } else if (totalEquiv >= 15750) {
    nameKo = '무지개 ☆☆☆☆'; nameEn = 'Rainbow ☆☆☆☆'; css = 'tier-rainbow';
    rangeMin = 15750; rangeMax = 15999; nextNameKo = '무지개(극) ☆'; nextNameEn = 'Rainbow (Goku) ☆'; nextMin = 16000;
  } else if (totalEquiv >= 15500) {
    nameKo = '무지개 ☆☆☆'; nameEn = 'Rainbow ☆☆☆'; css = 'tier-rainbow';
    rangeMin = 15500; rangeMax = 15749; nextNameKo = '무지개 ☆☆☆☆'; nextNameEn = 'Rainbow ☆☆☆☆'; nextMin = 15750;
  } else if (totalEquiv >= 15250) {
    nameKo = '무지개 ☆☆'; nameEn = 'Rainbow ☆☆'; css = 'tier-rainbow';
    rangeMin = 15250; rangeMax = 15499; nextNameKo = '무지개 ☆☆☆'; nextNameEn = 'Rainbow ☆☆☆'; nextMin = 15500;
  } else if (totalEquiv >= 15000) {
    nameKo = '무지개 ☆'; nameEn = 'Rainbow ☆'; css = 'tier-rainbow';
    rangeMin = 15000; rangeMax = 15249; nextNameKo = '무지개 ☆☆'; nextNameEn = 'Rainbow ☆☆'; nextMin = 15250;
  } else if (totalEquiv >= 14750) {
    nameKo = '백금 ☆☆'; nameEn = 'Platinum ☆☆'; css = 'tier-platinum';
    rangeMin = 14750; rangeMax = 14999; nextNameKo = '무지개 ☆'; nextNameEn = 'Rainbow ☆'; nextMin = 15000;
  } else if (totalEquiv >= 14500) {
    nameKo = '백금 ☆'; nameEn = 'Platinum ☆'; css = 'tier-platinum';
    rangeMin = 14500; rangeMax = 14749; nextNameKo = '백금 ☆☆'; nextNameEn = 'Platinum ☆☆'; nextMin = 14750;
  } else if (totalEquiv >= 14250) {
    nameKo = '금 ☆☆'; nameEn = 'Gold ☆☆'; css = 'tier-gold';
    rangeMin = 14250; rangeMax = 14499; nextNameKo = '백금 ☆'; nextNameEn = 'Platinum ☆'; nextMin = 14500;
  } else if (totalEquiv >= 14000) {
    nameKo = '금 ☆'; nameEn = 'Gold ☆'; css = 'tier-gold';
    rangeMin = 14000; rangeMax = 14249; nextNameKo = '금 ☆☆'; nextNameEn = 'Gold ☆☆'; nextMin = 14250;
  } else if (totalEquiv >= 13000) {
    nameKo = '은'; nameEn = 'Silver'; css = 'tier-silver';
    rangeMin = 13000; rangeMax = 13999; nextNameKo = '금 ☆'; nextNameEn = 'Gold ☆'; nextMin = 14000;
  } else if (totalEquiv >= 12000) {
    nameKo = '동'; nameEn = 'Bronze'; css = 'tier-bronze';
    rangeMin = 12000; rangeMax = 12999; nextNameKo = '은'; nextNameEn = 'Silver'; nextMin = 13000;
  } else if (totalEquiv >= 10000) {
    nameKo = '보라'; nameEn = 'Purple'; css = 'tier-purple';
    rangeMin = 10000; rangeMax = 11999; nextNameKo = '동'; nextNameEn = 'Bronze'; nextMin = 12000;
  } else if (totalEquiv >= 7000) {
    nameKo = '빨강'; nameEn = 'Red'; css = 'tier-red';
    rangeMin = 7000; rangeMax = 9999; nextNameKo = '보라'; nextNameEn = 'Purple'; nextMin = 10000;
  } else if (totalEquiv >= 4000) {
    nameKo = '노랑'; nameEn = 'Yellow'; css = 'tier-yellow';
    rangeMin = 4000; rangeMax = 6999; nextNameKo = '빨강'; nextNameEn = 'Red'; nextMin = 7000;
  } else if (totalEquiv >= 2000) {
    nameKo = '초록'; nameEn = 'Green'; css = 'tier-green';
    rangeMin = 2000; rangeMax = 3999; nextNameKo = '노랑'; nextNameEn = 'Yellow'; nextMin = 4000;
  } else if (totalEquiv >= 1000) {
    nameKo = '파랑'; nameEn = 'Blue'; css = 'tier-blue';
    rangeMin = 1000; rangeMax = 1999; nextNameKo = '초록'; nextNameEn = 'Green'; nextMin = 2000;
  } else {
    nameKo = '하양'; nameEn = 'White'; css = 'tier-white';
    rangeMin = 0; rangeMax = 999; nextNameKo = '파랑'; nextNameEn = 'Blue'; nextMin = 1000;
  }

  const name = currentLang === 'ko' ? nameKo : nameEn;
  const nextName = currentLang === 'ko' ? nextNameKo : nextNameEn;

  return { nameKo, nameEn, name, css, rangeMin, rangeMax, nextNameKo, nextNameEn, nextName, nextMin };
}

// App Initialization & DOM Binding
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTracksFromStorage();
  setupEventListeners();
  applyLanguage();
  updateAll();
});

function setupEventListeners() {
  const trackNameInput = document.getElementById('trackName');
  if (trackNameInput) {
    trackNameInput.addEventListener('input', updateAll);
  }

  const categoryRadios = document.querySelectorAll('input[name="trackCategory"]');
  categoryRadios.forEach(radio => radio.addEventListener('change', updateAll));

  const constantInput = document.getElementById('trackConstant');
  if (constantInput) {
    constantInput.addEventListener('input', updateAll);
  }

  const achievementInput = document.getElementById('trackAchievement');
  if (achievementInput) {
    achievementInput.addEventListener('input', updateAll);
  }

  const comboRadios = document.querySelectorAll('input[name="comboMark"]');
  comboRadios.forEach(radio => radio.addEventListener('change', updateAll));

  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', toggleLanguage);
  }

  const addBest50Btn = document.getElementById('addBest50Btn');
  if (addBest50Btn) {
    addBest50Btn.addEventListener('click', handleAddTrackToBest50);
  }

  const simAchieveSlider = document.getElementById('simAchieveSlider');
  if (simAchieveSlider) {
    simAchieveSlider.addEventListener('input', handleSliderInput);
  }

  // Filter Tabs
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      filterTabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      activeFilter = e.target.getAttribute('data-filter');
      renderBest50Table();
    });
  });

  // Import / Export / Clear buttons
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportJSON);

  const importBtn = document.getElementById('importBtn');
  const importFileInput = document.getElementById('importFileInput');
  if (importBtn && importFileInput) {
    importBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', importJSON);
  }

  const clearBest50Btn = document.getElementById('clearBest50Btn');
  if (clearBest50Btn) clearBest50Btn.addEventListener('click', clearAllTracks);
}

// Preset Handlers
window.setConstant = function(val) {
  document.getElementById('trackConstant').value = val.toFixed(1);
  updateAll();
};

window.setAchievement = function(val) {
  document.getElementById('trackAchievement').value = val.toFixed(4);
  if (val >= 101.0000) {
    const apRadio = document.querySelector('input[name="comboMark"][value="AP"]');
    if (apRadio) apRadio.checked = true;
  }
  updateAll();
};

// Binary Search for Minimal Target Achievement % to achieve targetRating under specified mark
function findMinAchieveForRating(constant, startAchieve, comboMark, targetRating) {
  let low = Math.round(startAchieve * 10000);
  let high = 1005000; // 100.5000%
  let resultAchieve = null;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    let achieveVal = mid / 10000.0;
    let res = calculateTrackRating(constant, achieveVal, comboMark);
    if (res.rating >= targetRating) {
      resultAchieve = achieveVal;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return resultAchieve;
}

// Compute Score Points that ACTUALLY upgrade DX Rating
function computeValidUpgradeSteps(constant, currentAchieve, currentComboMark, currentResult) {
  validStepPoints = [];

  // Entry 0: Current Achievement
  validStepPoints.push({
    achieve: currentAchieve,
    rating: currentResult.rating,
    ratingGain: 0,
    deltaAchieve: 0,
    comboMark: currentComboMark,
    label: i18n[currentLang].currentAchieveStep
  });

  const maxSameMarkRes = calculateTrackRating(constant, 100.5000, currentComboMark);

  let lastAchieve = currentAchieve;
  for (let targetRating = currentResult.rating + 1; targetRating <= maxSameMarkRes.rating; targetRating++) {
    const minAchieve = findMinAchieveForRating(constant, lastAchieve, currentComboMark, targetRating);
    if (minAchieve !== null && minAchieve > lastAchieve && minAchieve <= 100.5000) {
      const res = calculateTrackRating(constant, minAchieve, currentComboMark);
      if (res.rating > validStepPoints[validStepPoints.length - 1].rating) {
        const rg = res.rating - currentResult.rating;
        validStepPoints.push({
          achieve: minAchieve,
          rating: res.rating,
          ratingGain: rg,
          deltaAchieve: minAchieve - currentAchieve,
          comboMark: currentComboMark,
          label: `+${rg} RATING`
        });
        lastAchieve = minAchieve;
      }
    }
  }

  // If current mark is not AP, add AP option at 100.5000% for the +1 AP bonus
  if (!currentResult.isAP) {
    const apRes = calculateTrackRating(constant, 100.5000, 'AP');
    const lastRating = validStepPoints[validStepPoints.length - 1].rating;
    if (apRes.rating > lastRating) {
      validStepPoints.push({
        achieve: 100.5000,
        rating: apRes.rating,
        ratingGain: apRes.rating - currentResult.rating,
        deltaAchieve: 100.5000 - currentAchieve,
        comboMark: 'AP',
        label: `AP (+${apRes.rating - currentResult.rating} RATING)`
      });
    }
  }

  validStepPoints.sort((a, b) => a.achieve - b.achieve);

  const filtered = [];
  validStepPoints.forEach(pt => {
    if (filtered.length === 0) {
      filtered.push(pt);
    } else {
      const last = filtered[filtered.length - 1];
      if (pt.achieve > last.achieve && pt.rating > last.rating) {
        filtered.push(pt);
      }
    }
  });
  validStepPoints = filtered;
}

// Setup Score Simulator Range Slider
function setupScoreSimulatorRange(currentAchieve) {
  const slider = document.getElementById('simAchieveSlider');
  if (!slider) return;

  const minAchieve = currentAchieve;
  const maxAchieve = 100.5000;

  slider.min = minAchieve.toFixed(4);
  slider.max = maxAchieve.toFixed(4);
  slider.step = '0.0001';

  // Set initial position to first valid upgrade step if available
  if (validStepPoints.length > 1) {
    slider.value = validStepPoints[1].achieve.toFixed(4);
  } else {
    slider.value = minAchieve.toFixed(4);
  }

  handleSliderInput();
}

// Snapping update: As user drags slider, SNAP thumb to nearest achievement in validStepPoints!
function handleSliderInput() {
  const slider = document.getElementById('simAchieveSlider');
  if (!slider || validStepPoints.length === 0) return;

  let rawVal = parseFloat(slider.value);
  if (isNaN(rawVal)) rawVal = validStepPoints[0].achieve;

  // Find nearest discrete step point where DX Rating actually upgrades!
  let closestStep = validStepPoints[0];
  let minDiff = Math.abs(rawVal - closestStep.achieve);

  for (let i = 1; i < validStepPoints.length; i++) {
    let diff = Math.abs(rawVal - validStepPoints[i].achieve);
    if (diff < minDiff) {
      minDiff = diff;
      closestStep = validStepPoints[i];
    }
  }

  // SNAP slider thumb to exact step achievement point so it visually rests at closestStep.achieve position!
  slider.value = closestStep.achieve.toFixed(4);

  const currentAchieve = validStepPoints[0].achieve;
  const deltaAchieve = closestStep.achieve - currentAchieve;
  const ratingGain = closestStep.ratingGain;

  document.getElementById('simAchieveValue').innerText = `${closestStep.achieve.toFixed(4)}%`;
  document.getElementById('simAchieveDelta').innerText = deltaAchieve >= 0 ? `+${deltaAchieve.toFixed(4)}%` : `${deltaAchieve.toFixed(4)}%`;
  document.getElementById('simRatingResult').innerText = `${closestStep.rating} RATING`;
  document.getElementById('simRatingGain').innerText = ratingGain >= 0 ? `+${ratingGain} RATING` : `${ratingGain} RATING`;

  document.getElementById('simAchieveDelta').className = deltaAchieve >= 0 ? 'sim-val delta-pos' : 'sim-val';
  document.getElementById('simRatingGain').className = ratingGain >= 0 ? 'sim-val gain-pos' : 'sim-val';
}

// Master Update Routine
function updateAll() {
  const constant = parseFloat(document.getElementById('trackConstant').value) || 14.0;
  let achievement = parseFloat(document.getElementById('trackAchievement').value);
  if (isNaN(achievement)) achievement = 0.0000;
  if (achievement > 101.0000) achievement = 101.0000;

  const category = document.querySelector('input[name="trackCategory"]:checked')?.value || 'new';
  const comboMark = document.querySelector('input[name="comboMark"]:checked')?.value || 'CLEAR';

  // Compute Single Track Rating
  const res = calculateTrackRating(constant, achievement, comboMark);

  // Update Single Track Result Card
  document.getElementById('ratingValue').innerText = res.rating;
  document.getElementById('ratingContributionValue').innerText = `+${res.rating} RATING`;
  document.getElementById('mBaseConstant').innerText = res.constant.toFixed(1);
  document.getElementById('mRankFactor').innerText = `${res.rankData.factor.toFixed(1)} (${res.rankData.rank})`;
  document.getElementById('mEffectiveAchieve').innerText = `${res.capAchieve.toFixed(4)}%`;
  document.getElementById('mApBonus').innerText = res.isAP ? '+1 (AP)' : '+0';
  document.getElementById('mExactValue').innerText = res.exact.toFixed(3);

  // Rank Badge Update
  const scoreRankLabel = document.getElementById('scoreRankLabel');
  if (scoreRankLabel) {
    scoreRankLabel.innerText = res.rankData.rank;
    scoreRankLabel.className = `rank-badge ${res.rankData.css}`;
  }

  const singleTier = getTierInfo(res.rating, false);
  const tierEmblemBadge = document.getElementById('tierEmblemBadge');
  if (tierEmblemBadge) {
    tierEmblemBadge.innerText = singleTier.name;
    tierEmblemBadge.className = `tier-badge ${singleTier.css}`;
  }

  const formatted = document.getElementById('scoreFormatted');
  if (formatted) {
    formatted.innerText = `${achievement.toFixed(4)}%`;
  }

  // Compute Valid Rating Upgrade Steps
  computeValidUpgradeSteps(constant, achievement, comboMark, res);

  // Setup Discrete Snap Range Slider
  setupScoreSimulatorRange(achievement);

  // Render Milestone Cards
  renderMilestoneCards(constant, achievement, comboMark);

  // Render Best 50 Summary
  renderBest50Summary();
}

// Render Milestone Cards (S, S+, SS, SS+, SSS, SSS+)
function renderMilestoneCards(constant, currentAchieve, currentComboMark) {
  const container = document.getElementById('milestoneCardList');
  if (!container) return;

  container.innerHTML = '';
  const currentRes = calculateTrackRating(constant, currentAchieve, currentComboMark);

  const milestones = [
    { rank: 'SSS+', achieve: 100.5000 },
    { rank: 'SSS', achieve: 100.0000 },
    { rank: 'SS+', achieve: 99.5000 },
    { rank: 'SS', achieve: 99.0000 },
    { rank: 'S+', achieve: 98.0000 },
    { rank: 'S', achieve: 97.0000 }
  ];

  let addedCount = 0;
  milestones.forEach(m => {
    if (m.achieve > currentAchieve) {
      const targetRes = calculateTrackRating(constant, m.achieve, currentComboMark);
      const gain = targetRes.rating - currentRes.rating;
      const delta = m.achieve - currentAchieve;

      const card = document.createElement('div');
      card.className = 'rec-card';
      card.onclick = () => {
        setAchievement(m.achieve);
      };

      const titleText = i18n[currentLang].recRankTarget
        .replace('{targetRank}', m.rank)
        .replace('{targetAchieve}', m.achieve.toFixed(4));
      
      const descText = i18n[currentLang].recRankDesc
        .replace('{achieveDelta}', delta.toFixed(4))
        .replace('{targetRank}', m.rank)
        .replace('{rankFactor}', targetRes.rankData.factor.toFixed(1));

      card.innerHTML = `
        <div class="rec-info">
          <span class="rec-title">${titleText}</span>
          <span class="rec-desc">${descText}</span>
        </div>
        <span class="rec-gain">+${gain} RATING</span>
      `;
      container.appendChild(card);
      addedCount++;
    }
  });

  if (addedCount === 0) {
    const card = document.createElement('div');
    card.className = 'rec-card';
    card.style.cursor = 'default';
    card.innerHTML = `
      <div class="rec-info">
        <span class="rec-title">${i18n[currentLang].recMaxPerfTitle}</span>
        <span class="rec-desc">${i18n[currentLang].recMaxPerfDesc}</span>
      </div>
      <span class="rec-gain">MAX</span>
    `;
    container.appendChild(card);
  }
}

// Add Track to Best 50 List
function handleAddTrackToBest50() {
  const nameInput = document.getElementById('trackName').value.trim();
  const constant = parseFloat(document.getElementById('trackConstant').value) || 14.0;
  const achievement = parseFloat(document.getElementById('trackAchievement').value) || 100.5000;
  const category = document.querySelector('input[name="trackCategory"]:checked')?.value || 'new';
  const comboMark = document.querySelector('input[name="comboMark"]:checked')?.value || 'CLEAR';

  const name = nameInput || `${i18n[currentLang].untitledTrack} (${constant.toFixed(1)})`;
  const res = calculateTrackRating(constant, achievement, comboMark);

  const trackObj = {
    id: Date.now().toString(),
    name,
    category, // 'new' or 'old'
    constant,
    achievement,
    comboMark: comboMark === 'AP' ? 'AP / AP+' : 'CLEAR / FC',
    rank: res.rankData.rank,
    rankCss: res.rankData.css,
    rating: res.rating,
    exact: res.exact
  };

  savedTracks.unshift(trackObj);
  saveTracksToStorage();
  renderBest50Summary();

  alert(i18n[currentLang].trackAdded);
}

// Compute & Render Best 50 Summary
function renderBest50Summary() {
  const newTracks = savedTracks.filter(t => t.category === 'new')
    .sort((a, b) => b.rating - a.rating);
  const oldTracks = savedTracks.filter(t => t.category === 'old')
    .sort((a, b) => b.rating - a.rating);

  const top15New = newTracks.slice(0, 15);
  const top35Old = oldTracks.slice(0, 35);

  const newRatingSum = top15New.reduce((sum, t) => sum + t.rating, 0);
  const oldRatingSum = top35Old.reduce((sum, t) => sum + t.rating, 0);
  const totalRating = newRatingSum + oldRatingSum;

  // Render Total Rating
  document.getElementById('totalRatingValue').innerText = totalRating.toLocaleString();
  document.getElementById('best50CountText').innerText = 
    `신곡 ${top15New.length}/15 | 구곡 ${top35Old.length}/35 (총 ${top15New.length + top35Old.length}/50 트랙)`;

  // Update Rating Tier Badge & Progress Bar
  const tierInfo = getTierInfo(totalRating);
  const badge = document.getElementById('totalTierBadge');
  if (badge) {
    badge.innerText = `${tierInfo.name} (${totalRating.toLocaleString()})`;
    badge.className = `tier-badge ${tierInfo.css}`;
  }

  const currLabel = document.getElementById('currTierLabel');
  const nextLabel = document.getElementById('nextTierLabel');
  const barFill = document.getElementById('tierProgressBar');
  const neededText = document.getElementById('neededRatingText');

  if (currLabel && nextLabel && barFill && neededText) {
    currLabel.innerText = `${i18n[currentLang].currTierPrefix}${tierInfo.name}`;
    
    if (tierInfo.nextName === 'MAX') {
      nextLabel.innerText = i18n[currentLang].maxTierReached;
      barFill.style.width = '100%';
      neededText.innerText = i18n[currentLang].maxTierReached;
    } else {
      nextLabel.innerText = `${i18n[currentLang].nextTierPrefix}${tierInfo.nextName} (${tierInfo.nextMin.toLocaleString()})`;
      const progress = ((totalRating - tierInfo.rangeMin) / (tierInfo.nextMin - tierInfo.rangeMin)) * 100;
      barFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;

      const needed = tierInfo.nextMin - totalRating;
      neededText.innerText = `${i18n[currentLang].needUpPrefix}${needed.toLocaleString()}${i18n[currentLang].needUpSuffix}`;
    }
  }

  renderBest50Table();
}

// Render Best 50 Table
function renderBest50Table() {
  const tbody = document.getElementById('best50TableBody');
  const emptyMsg = document.getElementById('emptyTableMessage');
  if (!tbody || !emptyMsg) return;

  tbody.innerHTML = '';

  let tracksToDisplay = savedTracks;
  if (activeFilter === 'new') {
    tracksToDisplay = savedTracks.filter(t => t.category === 'new').sort((a, b) => b.rating - a.rating).slice(0, 15);
  } else if (activeFilter === 'old') {
    tracksToDisplay = savedTracks.filter(t => t.category === 'old').sort((a, b) => b.rating - a.rating).slice(0, 35);
  } else {
    // All
    const newTop = savedTracks.filter(t => t.category === 'new').sort((a, b) => b.rating - a.rating).slice(0, 15);
    const oldTop = savedTracks.filter(t => t.category === 'old').sort((a, b) => b.rating - a.rating).slice(0, 35);
    tracksToDisplay = [...newTop, ...oldTop].sort((a, b) => b.rating - a.rating);
  }

  if (tracksToDisplay.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  tracksToDisplay.forEach((track, index) => {
    const tr = document.createElement('tr');
    const catBadge = track.category === 'new' ? '<span class="cat-badge new">신곡</span>' : '<span class="cat-badge old">구곡</span>';

    tr.innerHTML = `
      <td class="num-cell">${index + 1}</td>
      <td>${catBadge}</td>
      <td>${escapeHtml(track.name)}</td>
      <td class="num-cell">${track.constant.toFixed(1)}</td>
      <td class="num-cell">${track.achievement.toFixed(4)}%</td>
      <td><span class="mark-badge">${track.comboMark}</span></td>
      <td><span class="rank-badge ${track.rankCss}">${track.rank}</span></td>
      <td class="rating-cell">${track.rating}</td>
      <td><button class="del-btn" onclick="deleteTrack('${track.id}')">✕</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteTrack(id) {
  savedTracks = savedTracks.filter(t => t.id !== id);
  saveTracksToStorage();
  renderBest50Summary();
}

function clearAllTracks() {
  if (confirm(i18n[currentLang].confirmClear)) {
    savedTracks = [];
    saveTracksToStorage();
    renderBest50Summary();
  }
}

// LocalStorage Persistence
function saveTracksToStorage() {
  localStorage.setItem('maimai_saved_tracks', JSON.stringify(savedTracks));
}

function loadSavedTracksFromStorage() {
  const data = localStorage.getItem('maimai_saved_tracks');
  if (data) {
    try {
      savedTracks = JSON.parse(data);
    } catch (e) {
      savedTracks = [];
    }
  }
}

// JSON Import / Export
function exportJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedTracks, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `maimai_dx_best50_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const imported = JSON.parse(evt.target.result);
      if (Array.isArray(imported)) {
        savedTracks = imported;
        saveTracksToStorage();
        renderBest50Summary();
        alert('JSON Data Imported Successfully!');
      }
    } catch (err) {
      alert('Invalid JSON file format.');
    }
  };
  reader.readAsText(file);
}

// i18n & Language Switching
function toggleLanguage() {
  currentLang = currentLang === 'ko' ? 'en' : 'ko';
  applyLanguage();
  updateAll();
}

function applyLanguage() {
  const langText = document.getElementById('langText');
  if (langText) langText.innerText = currentLang === 'ko' ? '한국어 / EN' : 'EN / 한국어';

  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[currentLang][key]) {
      el.innerText = i18n[currentLang][key];
    }
  });

  const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
  placeholders.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (i18n[currentLang][key]) {
      el.placeholder = i18n[currentLang][key];
    }
  });

  const tabAll = document.getElementById('tabFilterAll');
  const tabNew = document.getElementById('tabFilterNew');
  const tabOld = document.getElementById('tabFilterOld');

  if (tabAll) tabAll.innerText = i18n[currentLang].tabAll;
  if (tabNew) tabNew.innerText = i18n[currentLang].tabNew;
  if (tabOld) tabOld.innerText = i18n[currentLang].tabOld;
}

// Utility
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
