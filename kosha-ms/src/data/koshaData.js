export const KOSHA_DATA = [
  {
    chapter: "0장 안전보건경영시스템 일반",
    standards: [
      {
        id: "SHMS-001",
        title: "안전보건경영시스템 운영 매뉴얼",
        related_docs: [
          { id: "M01-00-01", name: "안전보건경영시스템 인증 현황" }
        ]
      }
    ]
  },
  {
    chapter: "4장 사업장의 현황 파악 및 안전보건경영체제",
    standards: [
      {
        id: "SHMS-100",
        title: "안전보건경영시스템 일반 요구사항",
        related_docs: [
          { id: "M01-04-01", name: "내·외부 이슈 파악 및 관리" },
          { id: "M01-04-02", name: "근로자 및 이해관계자 요구 파악" }
        ]
      }
    ]
  },
  {
    chapter: "5장 리더십과 근로자의 참여",
    standards: [
      {
        id: "SHMS-101",
        title: "안전보건방침",
        related_docs: [
          { id: "M01-05-01", name: "안전보건 경영방침" },
          { id: "M01-05-02", name: "안전보건 경영목표 및 추진계획" }
        ]
      },
      {
        id: "SHMS-102",
        title: "조직의 역할, 책임 및 권한",
        related_docs: [
          { id: "M01-05-03", name: "안전보건 관리조직도" },
          { id: "M01-05-04", name: "안전보건 직무기술서" }
        ]
      },
      {
        id: "SHMS-103",
        title: "근로자 참여 빛 협의",
        related_docs: [
          { id: "M01-05-05", name: "산업안전보건위원회 회의록" },
          { id: "M01-05-06", name: "작업중지권 행사 메뉴얼" }
        ]
      }
    ]
  },
  {
    chapter: "6장 기획 (위험성평가 등)",
    standards: [
      {
        id: "SHMS-104",
        title: "위험성평가 기준",
        related_docs: [
          { id: "M01-06-01", name: "위험성평가 실시 계획서" },
          { id: "M01-06-02", name: "위험성평가표 (직무별/공정별)" },
          { id: "M01-06-03", name: "아차사고 발굴 및 관리 대장" }
        ]
      },
      {
        id: "SHMS-105",
        title: "법규 및 그 밖의 요구사항",
        related_docs: [
          { id: "M01-06-04", name: "안전보건 법규 등록부" },
          { id: "M01-06-05", name: "법규 준수 평가표" }
        ]
      }
    ]
  },
  {
    chapter: "7장 지원",
    standards: [
      {
        id: "SHMS-106",
        title: "안전보건 교육훈련",
        related_docs: [
          { id: "M01-07-01", name: "연간 안전보건 교육계획서" },
          { id: "M01-07-02", name: "교육 참석자 명부 및 결과보고서" }
        ]
      },
      {
        id: "SHMS-107",
        title: "문서 및 기록관리",
        related_docs: [
          { id: "M01-07-03", name: "문서관리 대장" },
          { id: "M01-07-04", name: "기록보존 대장" }
        ]
      }
    ]
  },
  {
    chapter: "8장 실행 및 운영",
    standards: [
      {
        id: "SHMS-108",
        title: "작업허가 및 안전작업절차",
        related_docs: [
          { id: "M01-08-01", name: "안전작업허가서 (PTW)" },
          { id: "M01-08-02", name: "밀폐공간 작업 프로그램" }
        ]
      },
      {
        id: "SHMS-109",
        title: "비상사태 대비 및 대응",
        related_docs: [
          { id: "M01-08-03", name: "비상조치계획서" },
          { id: "M01-08-04", name: "비상대비 훈련 시나리오 및 결과보고서" }
        ]
      },
      {
        id: "SHMS-110",
        title: "도급, 용역 및 외주업체 관리",
        related_docs: [
          { id: "M01-08-05", name: "협력업체 안전보건 수준평가표" },
          { id: "M01-08-06", name: "도급인-수급인 안전보건 협의체 회의록" }
        ]
      }
    ]
  },
  {
    chapter: "9장 성과평가",
    standards: [
      {
        id: "SHMS-111",
        title: "모니터링 및 측정",
        related_docs: [
          { id: "M01-09-01", name: "작업환경측정 결과보고서" },
          { id: "M01-09-02", name: "안전보건 순회점검 일지" }
        ]
      },
      {
        id: "SHMS-112",
        title: "내부심사",
        related_docs: [
          { id: "M01-09-03", name: "내부심사 계획 및 결과보고서" }
        ]
      },
      {
        id: "SHMS-113",
        title: "경영자 검토",
        related_docs: [
          { id: "M01-09-04", name: "경영자 검토 보고서" }
        ]
      }
    ]
  },
  {
    chapter: "10장 개선",
    standards: [
      {
        id: "SHMS-114",
        title: "사고조사 및 시정조치",
        related_docs: [
          { id: "M01-10-01", name: "사고 발생 보고서" },
          { id: "M01-10-02", name: "원인분석 및 시정조치 요구서" }
        ]
      }
    ]
  }
];

export const QUICK_LINKS = [
  { title: "위험성평가", docId: "SHMS-104", icon: "clipboard-list" },
  { title: "작업중지권", docId: "SHMS-103", icon: "hand" },
  { title: "비상대비훈련", docId: "SHMS-109", icon: "alert-triangle" },
  { title: "안전작업허가", docId: "SHMS-108", icon: "file-check" },
];
