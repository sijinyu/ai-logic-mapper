import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

const SYSTEM_INSTRUCTION = `당신은 비즈니스 로직과 프로세스를 플로우차트 데이터로 변환하는 전문가입니다.

사용자의 입력을 분석하여 논리적 순서도(Flowchart)를 JSON으로 생성하세요.

## 노드 타입
- start: 시작점 (정확히 1개)
- process: 프로세스/작업/단계
- decision: 조건 분기 (Yes/No 또는 참/거짓)
- end: 종료점 (1개 이상)

## 규칙
1. 모든 노드는 고유한 id를 가져야 합니다 (node_1, node_2, ...)
2. label은 간결하고 명확하게 작성 (한국어 또는 영어)
3. decision 노드의 edge에는 반드시 label을 붙여주세요 (예: "Yes", "No", "성공", "실패")
4. 모든 노드는 최소 1개의 연결이 있어야 합니다
5. 순환 구조가 필요하면 포함해도 됩니다
6. description은 해당 단계의 상세 설명입니다 (선택사항)

## 응답 형식
반드시 아래 JSON 형식만 반환하세요. 다른 텍스트는 포함하지 마세요.`

const responseSchema = {
  type: 'object',
  properties: {
    nodes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: '고유 ID (예: node_1)' },
          label: { type: 'string', description: '노드 표시 이름' },
          type: {
            type: 'string',
            enum: ['start', 'process', 'decision', 'end'],
            description: '노드 타입',
          },
          description: {
            type: 'string',
            description: '상세 설명 (선택)',
          },
        },
        required: ['id', 'label', 'type'],
      },
    },
    edges: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string', description: '시작 노드 ID' },
          target: { type: 'string', description: '도착 노드 ID' },
          label: {
            type: 'string',
            description: '엣지 라벨 (decision 분기 시 필수)',
          },
        },
        required: ['source', 'target'],
      },
    },
  },
  required: ['nodes', 'edges'],
}

function getModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.2,
    },
  })
}

function validateFlowchartData(data) {
  if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
    throw new Error('유효하지 않은 플로우차트 데이터입니다.')
  }

  if (data.nodes.length === 0) {
    throw new Error('노드가 하나도 없습니다.')
  }

  const nodeIds = new Set(data.nodes.map((n) => n.id))

  for (const edge of data.edges) {
    if (!nodeIds.has(edge.source)) {
      throw new Error(`존재하지 않는 source 노드: ${edge.source}`)
    }
    if (!nodeIds.has(edge.target)) {
      throw new Error(`존재하지 않는 target 노드: ${edge.target}`)
    }
  }

  return data
}

export async function generateFlowchart(input) {
  if (!input || input.trim().length < 5) {
    throw new Error('최소 5자 이상 입력해주세요.')
  }

  const model = getModel()
  const result = await model.generateContent(input.trim())
  const text = result.response.text()

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('AI 응답을 파싱할 수 없습니다. 다시 시도해주세요.')
  }

  return validateFlowchartData(parsed)
}

export async function generateFlowchartFromFile(file) {
  if (!file) {
    throw new Error('파일을 선택해주세요.')
  }

  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new Error('파일 크기는 5MB 이하만 가능합니다.')
  }

  const model = getModel()

  // Handle text files
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    const text = await file.text()
    const result = await model.generateContent(
      `다음 문서의 내용을 분석하여 플로우차트로 변환해주세요:\n\n${text}`
    )
    const responseText = result.response.text()
    return validateFlowchartData(JSON.parse(responseText))
  }

  // Handle PDF and other files via inline data
  const buffer = await file.arrayBuffer()
  const base64 = btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  )

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: file.type || 'application/pdf',
        data: base64,
      },
    },
    '이 문서의 내용을 분석하여 비즈니스 로직 플로우차트로 변환해주세요.',
  ])

  const responseText = result.response.text()
  return validateFlowchartData(JSON.parse(responseText))
}
