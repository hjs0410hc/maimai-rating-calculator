# maimai DX CIRCLE PLUS DX Rating 계산기 (maimai DX Rating Calculator)

maimai DX 유저를 위한 **DX Rating (디럭스 레이팅)** 웹 계산기 및 스코어링 상승 시뮬레이터입니다.  
보면 상수(Internal Level), 달성률(Achievement %), 클리어/콤보 마크를 입력하여 단곡 DX 레이팅을 산출하고, 상위 50곡(Best 50: 신곡 15곡 + 구곡 35곡) 관리를 통해 최종 DX 레이팅과 플레이트 티어를 확인할 수 있습니다.

---

## 주요 기능 (Features)

### 1. 정확한 단곡 DX 레이팅 산출
- maimai DX 공식 산출식 및 커뮤니티 데이터 기반의 단곡 레이팅 계산
- 보면 상수 (1.0 ~ 15.4) 및 달성률 (0.0000% ~ 101.0000%) 지원
- 달성률 Cap 100.5% (SSS+) 자동 보정 및 AP / AP+ 달성 시 **+1 단곡 레이팅 보너스** 적용

### 2. 달성률 상승 시 DX 레이팅 획득 시뮬레이터 (디스크리트 스냅 슬라이더)
- **디스크리트 스냅 슬라이더**: 실제로 DX 레이팅이 상승하는 최소 달성률 지점으로만 슬라이더가 정확히 스냅됩니다.
- 입력 달성률, 보면 상수, 또는 달성 마크 변경 시 레이팅 상승 스냅 구간이 실시간으로 동기화 업데이트됩니다.
- 슬라이더를 드래그하여 목표 달성률을 조정할 때 예상 RATING 및 레이팅 상승량(+RATING)을 실시간으로 확인
- 주요 랭크 성과 달성 카드(SSS+, SSS, SS+, SS, S+, S) 클릭 시 슬라이더 및 달성률 즉시 이동

### 3. 달성 마크 & 랭크 자동 연동
- 콤보/퍼펙트 마크 지원: AP+ (All Perfect+), AP (All Perfect), FC+ (Full Combo+), FC (Full Combo), CLEAR
- AP / AP+ 선택 시 단곡 레이팅에 **+1 보너스** 적용
- 달성률에 따른 랭크 자동 바인딩 (SSS+, SSS, SS+, SS, S+, S, AAA, AA, A, BBB, BB, B, C, D)

### 4. 곡 구분 (신곡 15곡 / 구곡 35곡) & Best 50 요약
- 신곡 枠 (CiRCLE / CIRCLE PLUS 상위 15곡) + 구곡 枠 (Best 상위 35곡) 합산을 통한 최종 DX RATING 산출
- maimai DX 공식 플레이트 등급 (White, Blue, Green, Yellow, Red, Purple, Bronze, Silver, Gold, Rainbow) 엠블럼 표기
- 다음 플레이트 등급 달성까지 필요한 남은 레이팅(+RATING) 프로그래스 바 제공
- LocalStorage 자동 저장 및 JSON 파일 내보내기 / 가져오기 지원

### 5. 노트별 스코어 감점 매트릭스 & 달성률 역산 계산기 (Note Breakdown & Loss Matrix)
- **토글형 아코디언**: 달성률 입력창 하단에서 '노트별 감점 매트릭스 열기/접기' 토글 가능
- **총 노트수 입력**: TAP, HOLD, SLIDE, TOUCH, BREAK 노트수를 각각 입력하여 채보의 총 가중치($W_{\text{total}}$) 자동 계산
- **1개당 감점치 매트릭스 실시간 표시**: 각 노트별 Perfect(Break), Great, Good, Miss 1개 발생 시 깎이는 달성률(%)을 소수점 4자리로 정확히 확인
- **플레이 결과(미스 수) 입력 & 달성률 즉시 반영**: 발생한 판정 이탈 개수를 입력하면 $101.0000\% - \text{총 감점}$으로 계산된 최종 달성률이 메인 달성률 입력창 및 단곡 레이팅, Best 50에 즉시 실시간 동기화
- **BREAK 2500(Late/Early P) 세부 계산 옵션**: 체크박스 선택 시 BREAK 2500 판정 전용 입력 열이 활성화되어 더 정밀한 달성률 계산 가능

### 6. 한국어 / 영어 다국어 지원 (i18n)
- 우측 상단 언어 전환 버튼으로 한국어 / 영어 100% 실시간 전환

---

## 노트별 가중치 및 감점 공식 (Note Matrix Formula)

- **채보 총 가중치 ($W_{\text{total}}$)**:
  $$W_{\text{total}} = 1 \cdot N_{\text{tap}} + 2 \cdot N_{\text{hold}} + 3 \cdot N_{\text{slide}} + 1 \cdot N_{\text{touch}} + 5 \cdot N_{\text{break}}$$

- **판정 이탈 1개당 감점치 (Unit Loss %)**:
  - **TAP, TOUCH (가중치 1)**: Great $-0.2 / W \times 100\%$, Good $-0.5 / W \times 100\%$, Miss $-1.0 / W \times 100\%$
  - **HOLD (가중치 2)**: Great $-0.4 / W \times 100\%$, Good $-1.0 / W \times 100\%$, Miss $-2.0 / W \times 100\%$
  - **SLIDE (가중치 3)**: Great $-0.6 / W \times 100\%$, Good $-1.5 / W \times 100\%$, Miss $-3.0 / W \times 100\%$
  - **BREAK (기본 가중치 5 + 1% 보너스)**:
    - 2550 (Critical Perfect 대비 Perfect 감점): $-0.5\% / N_{\text{break}}$
    - 2500 (Late/Early Perfect 감점, 옵션 활성화 시): $-1.0\% / N_{\text{break}}$
    - Great (2000): $-(1.0 / W \times 100 + 1.0 / N_{\text{break}})\%$
    - Good (1000): $-(3.0 / W \times 100 + 1.0 / N_{\text{break}})\%$
    - Miss (0): $-(5.0 / W \times 100 + 1.0 / N_{\text{break}})\%$

## DX 레이팅 계산 공식 (Formula)

$$\text{Single Chart Rating} = \left\lfloor \text{Chart Constant} \times \min(\text{Achievement \%}, 100.5) \times \frac{\text{Rank Factor}}{100} \right\rfloor + (\text{AP / AP+} ? 1 : 0)$$

### 랭크 계수 (Rank Factor) Table

| 랭크 (Rank) | 달성률 (Achievement %) | 랭크 계수 (Rank Factor) |
| :--- | :--- | :--- |
| **SSS+** | 100.5000% 이상 | **22.4** *(달성률 100.5% 고정)* |
| **SSS** | 100.0000% ~ 100.4999% | **21.6** |
| **SS+** | 99.5000% ~ 99.9999% | **21.1** |
| **SS** | 99.0000% ~ 99.4999% | **20.8** |
| **S+** | 98.0000% ~ 98.9999% | **20.3** |
| **S** | 97.0000% ~ 97.9999% | **20.0** |
| **AAA** | 94.0000% ~ 96.9999% | **16.8** |
| **AA** | 90.0000% ~ 93.9999% | **15.2** |
| **A** | 80.0000% ~ 89.9999% | **13.6** |
| **BBB** | 75.0000% ~ 79.9999% | **12.0** |
| **BB** | 70.0000% ~ 74.9999% | **10.0** |
| **B** | 60.0000% ~ 69.9999% | **8.0** |
| **C** | 50.0000% ~ 59.9999% | **5.0** |
| **D** | 0.0000% ~ 49.9999% | **0.0** |

---

## 실행 방법 (Getting Started)

별도의 백엔드 서버나 패키지 설치 없이 최신 웹 브라우저에서 `index.html` 파일을 열어 즉시 실행할 수 있습니다.

```bash
# index.html 파일을 웹 브라우저로 실행
```

---

## 파일 구조 (Directory Structure)

```
maimaidx-rating-calculator/
├── index.html        # 앱 HTML 레이아웃 및 i18n 바인딩
├── style.css         # 모던 사이버펑크 네온 CSS 스타일시트
├── app.js            # DX 레이팅 계산 엔진, 시뮬레이터 및 Best 50 관리 로직
└── README.md         # 프로젝트 안내 문서 (한국어)
```

---

## 저작권 안내 (Notice)

maimai DX 및 DX RATING은 SEGA Interactive의 상표 및 게임 서비스입니다. 본 프로젝트는 리듬게임 커뮤니티 플레이어들을 위해 제작된 비공식 웹 계산기 툴입니다.
