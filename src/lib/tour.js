import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const TOUR_COMPLETED_KEY = 'alm_tour_completed'

const tourSteps = [
  {
    popover: {
      title: '환영합니다! 👋',
      description:
        'AI Logic Mapper에 오신 것을 환영합니다! 비즈니스 로직을 입력하면 자동으로 플로우차트를 생성해드립니다. 주요 기능을 안내해 드릴게요.',
    },
  },
  {
    element: '#tour-input',
    popover: {
      title: '로직 입력',
      description:
        '비즈니스 로직을 텍스트로 입력하세요. 자연어로 작성하면 AI가 분석하여 플로우차트로 변환합니다.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '#tour-file-upload',
    popover: {
      title: '파일 업로드',
      description:
        '텍스트 입력 대신 파일을 업로드할 수도 있습니다. .txt, .pdf, .docx 파일을 지원합니다.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '#tour-generate',
    popover: {
      title: '플로우차트 생성',
      description:
        '이 버튼을 클릭하면 AI가 입력을 분석하여 플로우차트를 생성합니다. Ctrl+Enter로도 실행할 수 있어요.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '#tour-canvas',
    popover: {
      title: '캔버스',
      description:
        '생성된 플로우차트가 여기에 표시됩니다. 드래그로 이동, 스크롤로 확대/축소가 가능합니다.',
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '#tour-history',
    popover: {
      title: '생성 기록',
      description:
        '이전에 생성한 플로우차트 기록을 확인하고 다시 불러올 수 있습니다.',
      side: 'right',
      align: 'start',
    },
  },
]

export function isTourCompleted() {
  return localStorage.getItem(TOUR_COMPLETED_KEY) === 'true'
}

export function setTourCompleted() {
  localStorage.setItem(TOUR_COMPLETED_KEY, 'true')
}

export function startTour() {
  const driverObj = driver({
    showProgress: true,
    steps: tourSteps,
    nextBtnText: '다음',
    prevBtnText: '이전',
    doneBtnText: '완료',
    progressText: '{{current}} / {{total}}',
    onDestroyStarted: () => {
      setTourCompleted()
      driverObj.destroy()
    },
  })

  driverObj.drive()
}
