export const KOSHA_DATA = [
  {
    chapter: "0. 일반사항",
    standards: []
  },
  {
    chapter: "1. 리더십 및 안전보건방침",
    standards: [
      {
        id: "SHMS-101",
        title: "안전보건방침",
        revisions: [
          { version: "1.0", date: "2023-01-01", description: "최초 제정", author: "관리자" },
          { version: "1.1", date: "2024-01-15", description: "조직 개편에 따른 내용 수정", author: "홍길동" }
        ],
        related_docs: [
          { id: "SHMS-M02-01-01", name: "현장 안전보건경영방침 및 목표" }
        ]
      },
      { id: "SHMS-102", title: "안전보건목표 성과측정", related_docs: [] },
      { id: "SHMS-부록1", title: "안전보건관리규정", related_docs: [] }
    ]
  },
  {
    chapter: "2. 현장조직의 역할, 책임 및 권한",
    standards: [
      {
        id: "SHMS-105",
        title: "안전보건관리자 배치기준",
        related_docs: [
          { id: "SHMS-M02-02-01", name: "현장 안전보건조직도" },
          { id: "SHMS-M02-02-02", name: "(현장) 안전보건팀 업무분장" },
          { id: "SHMS-M02-02-03", name: "(현장) 안전보건 조직 업무분장_개별포함" },
          { id: "SHMS-M02-02-04", name: "안전보건관리규정" },
          { id: "SHMS-M02-02-05", name: "합동안전보건점검 보고서" },
          { id: "SHMS-M02-02-06", name: "안전보건총괄(관리)책임자 선임계" },
          { id: "SHMS-M02-02-07", name: "안전·보건관리자 선임계" },
          { id: "SHMS-M02-02-08", name: "안전보건 조정자 지정서" },
          { id: "SHMS-M02-02-09", name: "관리감독자 지정서" },
          { id: "SHMS-M02-02-10", name: "지정서(신호수)" },
          { id: "SHMS-M02-02-11", name: "지정서(화재감시자)" }
        ]
      },
      { id: "SHMS-106", title: "안전보건조직 업무기준", related_docs: [] },
      { id: "SHMS-110", title: "노사협의체 운영기준", related_docs: [] },
      { id: "SHMS-111", title: "경영책임자 주관회의", related_docs: [] },
      { id: "SHMS-118", title: "안전감시단 운영기준", related_docs: [] },
      { id: "SHMS-309", title: "비상대비 훈련", related_docs: [] },
      { id: "SHMS-401", title: "총괄담당 부재시 업무인수인계", related_docs: [] },
      { id: "SHMS-603", title: "중대재해 대응 매뉴얼", related_docs: [] }
    ]
  },
  {
    chapter: "3. 위험성평가",
    standards: [
      {
        id: "SHMS-119",
        title: "설계안전성 검토회의",
        related_docs: [
          { id: "SHMS-M02-03-01", name: "설계안전성 검토회의 보고서" },
          { id: "SHMS-M02-03-02", name: "최초 위험성평가" },
          { id: "SHMS-M02-03-03", name: "상시 위험성평가 등록부" },
          { id: "SHMS-M02-03-04", name: "위험성평가 회의록" },
          { id: "SHMS-M02-03-05", name: "일일안전회의록" }
        ]
      },
      { id: "SHMS-404", title: "위험성평가 운영기준", related_docs: [] },
      { id: "SHMS-405", title: "작업중지(모바일) 명령기준", related_docs: [] },
      { id: "SHMS-406", title: "안전작업허가(PTW) 운영기준", related_docs: [] }
    ]
  },
  {
    chapter: "4. 안전보건목표 및 추진계획",
    standards: [
      {
        id: "SHMS-102",
        title: "안전보건목표 성과측정",
        related_docs: [
          { id: "SHMS-M02-04-01", name: "(현장) 안전보건목표 성과측정표(1회/반기)" },
          { id: "SHMS-M02-04-02", name: "월간 업무계획서" }
        ]
      },
      { id: "SHMS-부록1", title: "안전보건관리규정", related_docs: [] }
    ]
  },
  {
    chapter: "5. 안전보건교육 및 적격성",
    standards: [
      {
        id: "SHMS-301",
        title: "안전보건교육 실시기준",
        related_docs: [
          { id: "SHMS-M02-05-01", name: "(현장) 연간 교육훈련계획, 실적보고서" },
          { id: "SHMS-M02-05-02", name: "안전보건교육일지(신규)" },
          { id: "SHMS-M02-05-03", name: "안전보건교육일지(작업변경 시)" },
          { id: "SHMS-M02-05-04", name: "안전보건교육일지(정기)" },
          { id: "SHMS-M02-05-05", name: "안전보건교육일지(특별)" },
          { id: "SHMS-M02-05-06", name: "안전보건교육일지(특수형태근로종사자)" },
          { id: "SHMS-M02-05-07", name: "안전보건교육일지(신규_관리감독자)" },
          { id: "SHMS-M02-05-08", name: "안전보건교육일지(작업변경 시_관리감독자)" },
          { id: "SHMS-M02-05-09", name: "안전보건교육일지(정기_관리감독자)" },
          { id: "SHMS-M02-05-10", name: "안전보건교육일지(특별_관리감독자)" },
          { id: "SHMS-M02-05-11", name: "안전보건교육일지(MSDS)" },
          { id: "SHMS-M02-05-12", name: "안전보건교육일지(수시/기타)" }
        ]
      },
      { id: "SHMS-302", title: "신호수 특별교육", related_docs: [] },
      { id: "SHMS-303", title: "외국인 근로자 교육", related_docs: [] },
      { id: "SHMS-304", title: "전문가 양성교육", related_docs: [] },
      { id: "SHMS-305", title: "VR 안전교육", related_docs: [] },
      { id: "SHMS-307", title: "심폐소생술 교육이수", related_docs: [] },
      { id: "SHMS-308", title: "응급처치 교육기준", related_docs: [] },
      { id: "SHMS-309", title: "비상대비 훈련", related_docs: [] },
      { id: "SHMS-310", title: "생애주기별 안전보건 프로그램", related_docs: [] },
      { id: "SHMS-409", title: "협력사 자격이수제 기준", related_docs: [] }
    ]
  },
  {
    chapter: "6. 의사소통",
    standards: [
      {
        id: "SHMS-108",
        title: "근로자 안전개선 신고제",
        related_docs: [
          { id: "SHMS-M02-06-01", name: "노사협의체 회의록" },
          { id: "SHMS-M02-06-02", name: "안전개선신고제" }
        ]
      },
      { id: "SHMS-109", title: "종사자 의견청취 기준", related_docs: [] },
      { id: "SHMS-110", title: "노사협의체 운영기준", related_docs: [] },
      { id: "SHMS-111", title: "경영책임자 주관회의", related_docs: [] },
      { id: "SHMS-404", title: "위험성평가 운영기준", related_docs: [] },
      { id: "SHMS-408", title: "안전조회 실시기준", related_docs: [] },
      { id: "SHMS-605", title: "위험정보 공유시스템(단체문자)", related_docs: [] }
    ]
  },
  {
    chapter: "7. 문서 및 기록관리",
    standards: [
      {
        id: "SHMS-701",
        title: "준공이관 서류목록",
        related_docs: [
          { id: "SHMS-M02-07-01", name: "현장 문서체계표" },
          { id: "SHMS-M02-07-02", name: "공문 발송접수대장(안전관련 대내·외)" },
          { id: "SHMS-M02-07-03", name: "대외 점검결과(감독점검표 등)" }
        ]
      },
      { id: "SHMS-부록2", title: "안전보건 문서기준", related_docs: [] }
    ]
  },
  {
    chapter: "8. 안전보건관리 활동",
    standards: [
      { id: "SHMS-107", title: "안전보건활동 업무기준", related_docs: [] },
      { id: "SHMS-113", title: "산업안전보건관리비 산정기준", related_docs: [] },
      { id: "SHMS-114", title: "보호구 착용기준", related_docs: [] },
      { id: "SHMS-115", title: "보안경 지급기준", related_docs: [] },
      { id: "SHMS-116", title: "안전벨트 착용기준", related_docs: [] },
      { id: "SHMS-117", title: "현장 비품운용기준", related_docs: [] },
      { id: "SHMS-118", title: "안전감시단 운영기준", related_docs: [] },
      { id: "SHMS-402", title: "안전기동제 집행기준", related_docs: [] },
      { id: "SHMS-403", title: "안전점검의 날 운영기준", related_docs: [] },
      { id: "SHMS-404", title: "위험성평가 운영기준", related_docs: [] },
      { id: "SHMS-406", title: "안전작업허가(PTW) 운영기준", related_docs: [] },
      { id: "SHMS-408", title: "안전조회 실시기준", related_docs: [] },
      { id: "SHMS-412", title: "안전시설물 설치기준", related_docs: [] },
      { id: "SHMS-413", title: "발굴공사 안전시설물 기준", related_docs: [] },
      { id: "SHMS-414", title: "가설전기 안전기준", related_docs: [] },
      { id: "SHMS-415", title: "비계작업 안전기준", related_docs: [] },
      { id: "SHMS-416", title: "시스템 동바리 작업기준", related_docs: [] },
      { id: "SHMS-417", title: "공동구 관리기준", related_docs: [] },
      { id: "SHMS-418", title: "철근가공기 안전기준", related_docs: [] },
      { id: "SHMS-419", title: "사다리 사용 안전기준", related_docs: [] },
      { id: "SHMS-420", title: "작업의자형 달비계 작업기준", related_docs: [] },
      { id: "SHMS-421", title: "갱폼 안전작업 기준", related_docs: [] },
      { id: "SHMS-422", title: "괴로작업 안전기준", related_docs: [] },
      { id: "SHMS-423", title: "건설장비 점검 및 관리기준", related_docs: [] },
      { id: "SHMS-424", title: "콘크리트 펌프카 안전기준", related_docs: [] },
      { id: "SHMS-426", title: "건설 리프트 안전기준", related_docs: [] },
      { id: "SHMS-427", title: "양중작업 관리기준", related_docs: [] },
      { id: "SHMS-428", title: "고소작업대 사용기준", related_docs: [] },
      { id: "SHMS-429", title: "멀티 스마트 전광판 설치기준", related_docs: [] },
      { id: "SHMS-501", title: "건강관리실 운영기준", related_docs: [] },
      { id: "SHMS-502", title: "휴게시설 설치기준", related_docs: [] },
      { id: "SHMS-504", title: "물질안전보건자료 관리기준", related_docs: [] },
      { id: "SHMS-505", title: "박지제 보관함 설치기준", related_docs: [] },
      { id: "SHMS-506", title: "위험물 관리기준", related_docs: [] },
      { id: "SHMS-507", title: "근골격계질환 조사기준", related_docs: [] },
      { id: "SHMS-508", title: "작업환경측정(건강진단) 기준", related_docs: [] },
      { id: "SHMS-509", title: "집진기 의무 사용기준", related_docs: [] },
      { id: "SHMS-510", title: "지하층 환기 시설기준", related_docs: [] },
      { id: "SHMS-511", title: "미세먼지 관리기준", related_docs: [] },
      { id: "SHMS-512", title: "밀폐공간(동·하절기) 작업 관리기준", related_docs: [] },
      { id: "SHMS-513", title: "건강(사후) 관리기준", related_docs: [] },
      { id: "SHMS-514", title: "혹서기 건강 관리기준", related_docs: [] },
      { id: "SHMS-515", title: "고령근로자 관리기준", related_docs: [] },
      { id: "SHMS-517", title: "위생환경 운영기준", related_docs: [] },
      { id: "SHMS-605", title: "위험정보 공유시스템(단체문자)", related_docs: [] },
      {
        id: "SHMS-부록5",
        title: "작업별 안전지도서",
        related_docs: [
          { id: "SHMS-M02-08-01", name: "안전점검일지" },
          { id: "SHMS-M02-08-02", name: "보건점검일지" },
          { id: "SHMS-M02-08-03", name: "작업장순회 점검일지" },
          { id: "SHMS-M02-08-04", name: "안전점검의 날 결과 보고서" },
          { id: "SHMS-M02-08-05", name: "타워크레인 관리(반입전/설·해체/관리점검)" },
          { id: "SHMS-M02-08-06", name: "항타기 관리(반입전) 점검 보고서" },
          { id: "SHMS-M02-08-07", name: "CCTV 예방조치 결과보고서" },
          { id: "SHMS-M02-08-08", name: "보호구 지급대장" },
          { id: "SHMS-M02-08-09", name: "산업안전보건관리비 사용총괄표" },
          { id: "SHMS-M02-08-10", name: "협력사 안전관리비 지출" },
          { id: "SHMS-M02-08-11", name: "작업허가서" },
          { id: "SHMS-M02-08-12", name: "작업중지 명령서" },
          { id: "SHMS-M02-08-13", name: "차량계 하역운반기계 작업계획서(제38조)" },
          { id: "SHMS-M02-08-14", name: "차량계 건설기계 작업계획서(제38조)" },
          { id: "SHMS-M02-08-15", name: "비계설치작업 계획서" },
          { id: "SHMS-M02-08-16", name: "전기 작업계획서(제38조)" },
          { id: "SHMS-M02-08-17", name: "굴착 작업계획서(제38조)" },
          { id: "SHMS-M02-08-18", name: "해체 작업계획서(제38조)" },
          { id: "SHMS-M02-08-19", name: "중량물 취급 작업계획서(제38조)" },
          { id: "SHMS-M02-08-20", name: "장비관리대장 및 실명제" },
          { id: "SHMS-M02-08-21", name: "화재예방점검 체크리스트" },
          { id: "SHMS-M02-08-22", name: "모델하우스 점검보고서" },
          { id: "SHMS-M02-08-23", name: "작업환경측정 결과표 및 보고서" },
          { id: "SHMS-M02-08-24", name: "작업환경 개선계획서(청력보존)" },
          { id: "SHMS-M02-08-25", name: "작업환경 개선계획서(호흡기보호)" },
          { id: "SHMS-M02-08-26", name: "밀폐공간작업 프로그램" },
          { id: "SHMS-M02-08-27", name: "물질안전보건자료" },
          { id: "SHMS-M02-08-28", name: "특별관리대상물질 취급일지" },
          { id: "SHMS-M02-08-29", name: "배치전 건강진단" },
          { id: "SHMS-M02-08-30", name: "특수 건강진단" },
          { id: "SHMS-M02-08-31", name: "일반 건강진단" },
          { id: "SHMS-M02-08-32", name: "사후관리 조치결과 보고서" },
          { id: "SHMS-M02-08-33", name: "근골격계작업 평가조사표" },
          { id: "SHMS-M02-08-34", name: "감염성질병 보고서" },
          { id: "SHMS-M02-08-35", name: "식당 위생 점검 보고서" },
          { id: "SHMS-M02-08-36", name: "안전보건 업무개선" },
          { id: "SHMS-M02-08-37", name: "비품전용신청서" }
        ]
      }
    ]
  },
  {
    chapter: "9. 비상시 조치계획 및 대응",
    standards: [
      { id: "SHMS-120", title: "건설공사(화재)보험 가입기준", related_docs: [] },
      { id: "SHMS-309", title: "비상대비 훈련", related_docs: [] },
      { id: "SHMS-405", title: "작업중지(모바일) 명령기준", related_docs: [] },
      { id: "SHMS-430", title: "지하층 비상대피시설", related_docs: [] },
      { id: "SHMS-503", title: "응급(용품,AED) 필수 구비기준", related_docs: [] },
      { id: "SHMS-516", title: "감염병질병 대응체계", related_docs: [] },
      { id: "SHMS-602", title: "안전사고보고 및 재해예방토론회 기준", related_docs: [] },
      { id: "SHMS-603", title: "중대재해 대응 매뉴얼", related_docs: [] },
      { id: "SHMS-604", title: "중앙행정기관 등 개선, 시정명령 보고기준", related_docs: [] },
      { id: "SHMS-605", title: "위험정보 공유시스템(단체문자)", related_docs: [] },
      {
        id: "SHMS-부록5",
        title: "작업별 안전지도서",
        related_docs: [
          { id: "SHMS-M02-09-01", name: "비상대비 훈련 매뉴얼" },
          { id: "SHMS-M02-09-02", name: "응급처치 결과보고서" },
          { id: "SHMS-M02-09-03", name: "사고보고서" },
          { id: "SHMS-M02-09-04", name: "재해예방토론회" }
        ]
      }
    ]
  },
  {
    chapter: "10. 모니터링 및 성과측정",
    standards: [
      {
        id: "SHMS-102",
        title: "안전보건목표 성과측정",
        related_docs: [
          { id: "SHMS-M02-10-01", name: "장비특별점검 결과보고서" },
          { id: "SHMS-M02-10-02", name: "가설안전점검 보고서(흙막이/지하층/갱폼)" },
          { id: "SHMS-M02-10-03", name: "(외부기관) 평가점검 결과보고서" },
          { id: "SHMS-M02-10-04", name: "(본사) 평가점검 결과보고서" },
          { id: "SHMS-M02-10-05", name: "안전보건대장 이행점검 결과보고서" },
          { id: "SHMS-M02-10-06", name: "안전보건점검 조치보고서" },
          { id: "SHMS-M02-10-07", name: "테마점검 결과보고서(체크리스트)" }
        ]
      },
      { id: "SHMS-201", title: "연간 안전점검 운영기준", related_docs: [] },
      { id: "SHMS-203", title: "테마점검 실시기준", related_docs: [] },
      { id: "SHMS-204", title: "CCTV 운영기준", related_docs: [] },
      { id: "SHMS-404", title: "위험성평가 운영기준", related_docs: [] },
      { id: "SHMS-407", title: "이동식 CCTV 운영기준", related_docs: [] }
    ]
  },
  {
    chapter: "11. 시정조치 및 개선",
    standards: [
      { id: "SHMS-107", title: "안전보건활동 업무기준", related_docs: [] },
      { id: "SHMS-108", title: "근로자 안전개선 신고제", related_docs: [] },
      {
        id: "SHMS-COMMON-11",
        title: "시정조치 및 개선 관련 양식",
        related_docs: [
          { id: "SHMS-M02-11-01", name: "시정조치 요청서" },
          { id: "SHMS-M02-11-02", name: "재해 다발현장 경고장" },
          { id: "SHMS-M02-11-03", name: "재해발생에 의한 안전경영 협조문" }
        ]
      }
    ]
  },
  {
    chapter: "12. 평가와 상벌",
    standards: [
      { id: "SHMS-103", title: "안전보건관리책임자 등 평가기준", related_docs: [] },
      { id: "SHMS-104", title: "협력사 안전보건 관리기준", related_docs: [] },
      { id: "SHMS-202", title: "현장 안전평가 기준", related_docs: [] },
      { id: "SHMS-601", title: "안전관리 상벌기준", related_docs: [] },
      {
        id: "SHMS-COMMON-12",
        title: "평가와 상벌 관련 양식",
        related_docs: [
          { id: "SHMS-M02-12-01", name: "안전관리 상벌규정" }
        ]
      }
    ]
  }
];

export const QUICK_LINKS = [
  { title: "안전보건산업기사", docId: "guide", icon: "file-check" },
  { title: "안전보건관리규정", docId: "regulation", icon: "clipboard-list" },
  { title: "작업별 안전기준서", docId: "manual", icon: "alert-triangle" },
  { title: "안전보건인증리스트", docId: "checklist", icon: "hand" },
];
