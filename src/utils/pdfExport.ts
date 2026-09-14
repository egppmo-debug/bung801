import { GeneratedScenario } from '../types';

export function generateScenarioPdfHtml(scenario: GeneratedScenario): string {
  const company = scenario.report.companyName || '고객사';
  const ceo = scenario.report.ceoName || '대표이사';
  const consultant = scenario.report.consultantName || '담당 컨설턴트';
  const categoryTitle = scenario.categoryTitle || '법인 종합 컨설팅';
  const turns = scenario.dialogueTurns || [];
  const analysis = scenario.analysis;

  const stageNames: Record<number, string> = {
    1: '1단계: 라포 형성 & 재무 브리핑',
    2: '2단계: 문제점 제기 & 리스크 분석',
    3: '3단계: 솔루션 제시 & 반론 해명',
    4: '4단계: 실행 절차 & 차기 미팅 확정'
  };

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>${company} - 법인컨설팅 실전 상담 시나리오 및 분석 리포트</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 18mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", "Apple SD Gothic Neo", sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.55;
      font-size: 13px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header-banner {
      border-bottom: 2.5px solid #ea580c;
      padding-bottom: 12px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 11px;
      color: #ea580c;
      font-weight: 700;
      margin-top: 2px;
    }
    .meta-box {
      text-align: right;
      font-size: 11px;
      color: #64748b;
    }
    .meta-box strong {
      color: #0f172a;
    }

    /* Summary Card */
    .summary-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 18px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 8px;
    }
    .summary-item {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      text-align: center;
    }
    .summary-label {
      font-size: 10.5px;
      color: #64748b;
      display: block;
      margin-bottom: 2px;
    }
    .summary-value {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
    }

    /* Section Headings */
    .section-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      border-left: 4px solid #ea580c;
      padding-left: 8px;
      margin-top: 20px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Risk Grid */
    .risk-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-bottom: 16px;
    }
    .risk-card {
      border: 1px solid #fecdd3;
      background: #fff1f2;
      border-radius: 6px;
      padding: 9px 11px;
    }
    .risk-title {
      font-size: 12px;
      font-weight: 700;
      color: #9f1239;
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }
    .risk-tax {
      background: #e11d48;
      color: #ffffff;
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 700;
    }
    .risk-desc {
      font-size: 11.5px;
      color: #475569;
    }

    /* Dialogue turns */
    .dialogue-container {
      margin-top: 10px;
    }
    .turn-item {
      page-break-inside: avoid;
      margin-bottom: 10px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
    }
    .turn-header {
      padding: 5px 10px;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .consultant-turn .turn-header {
      background: #ffedd5;
      color: #9a3412;
      border-bottom: 1px solid #fed7aa;
    }
    .ceo-turn .turn-header {
      background: #dbeafe;
      color: #1e40af;
      border-bottom: 1px solid #bfdbfe;
    }
    .turn-content {
      padding: 8px 11px;
      font-size: 12.5px;
      line-height: 1.6;
      color: #1e293b;
      white-space: pre-wrap;
    }
    .consultant-turn {
      border-left: 3.5px solid #ea580c;
    }
    .ceo-turn {
      border-left: 3.5px solid #2563eb;
    }
    .turn-meta {
      padding: 4px 11px 6px 11px;
      background: #f8fafc;
      border-top: 1px dashed #e2e8f0;
      font-size: 10.5px;
      color: #64748b;
    }
    .turn-meta strong {
      color: #334155;
    }

    /* Checklist & Procedures */
    .checklist-box {
      page-break-inside: avoid;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 6px;
      padding: 10px 12px;
      margin-top: 10px;
      margin-bottom: 14px;
    }
    .checklist-item {
      font-size: 11.5px;
      color: #166534;
      margin-bottom: 4px;
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    /* Notes */
    .notes-box {
      page-break-inside: avoid;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 11.5px;
      color: #92400e;
      margin-top: 10px;
      white-space: pre-wrap;
    }

    /* Footer */
    .report-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 8px;
      margin-top: 20px;
      font-size: 10px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }

    @media print {
      body {
        margin: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <!-- Top Branding -->
  <div class="header-banner">
    <div>
      <div class="brand-title">한화피플라이프 법인컨설팅 가상시나리오 AI 리포트</div>
      <div class="brand-sub">한화피플라이프 대전글로리사업단 실전 상담 지원 시스템</div>
    </div>
    <div class="meta-box">
      <div>출력일자: <strong>${new Date().toLocaleDateString('ko-KR')}</strong></div>
      <div>담당 컨설턴트: <strong>${consultant}</strong></div>
      <div>카테고리: <strong>${categoryTitle}</strong></div>
    </div>
  </div>

  <!-- Corporate Summary -->
  <div class="summary-card">
    <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 3px;">
      ${company} &nbsp;<span style="font-size: 12px; font-weight: 600; color: #64748b;">(대표이사: ${ceo} / 업종: ${scenario.report.industry || '제조 및 유통'})</span>
    </div>
    <div class="summary-grid">
      <div class="summary-item">
        <span class="summary-label">연간 매출액</span>
        <span class="summary-value">${scenario.report.annualRevenue || '-'}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">영업이익</span>
        <span class="summary-value">${scenario.report.operatingProfit || '-'}</span>
      </div>
      <div class="summary-item" style="border-color: #fcd34d; background: #fffbeb;">
        <span class="summary-label" style="color: #b45309;">미처분이익잉여금</span>
        <span class="summary-value" style="color: #92400e;">${scenario.report.retainedEarnings || '-'}</span>
      </div>
      <div class="summary-item" style="border-color: #fda4af; background: #fff1f2;">
        <span class="summary-label" style="color: #be123c;">가지급금 (인정이자)</span>
        <span class="summary-value" style="color: #9f1239;">${scenario.report.provisionalPayment || '-'}</span>
      </div>
    </div>
  </div>

  ${analysis && analysis.riskSummary && analysis.riskSummary.length > 0 ? `
  <!-- Risk Analysis -->
  <div class="section-title">
    <span>1. 핵심 잠재 리스크 진단 (방치 시 누적 손실)</span>
  </div>
  <div class="risk-grid">
    ${analysis.riskSummary.map(r => `
      <div class="risk-card">
        <div class="risk-title">
          <span>${r.title}</span>
          <span class="risk-tax">${r.estimatedTaxOrLoss}</span>
        </div>
        <div class="risk-desc">${r.description}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Dialogue Turns -->
  <div class="section-title">
    <span>2. 4단계 실전 상담 대화 스크립트 (총 ${turns.length}턴)</span>
  </div>
  <div class="dialogue-container">
    ${turns.map(t => {
      const isConsultant = t.speaker === 'consultant';
      const speakerClass = isConsultant ? 'consultant-turn' : 'ceo-turn';
      const stageLabel = stageNames[t.stage] || `${t.stage}단계`;
      return `
        <div class="turn-item ${speakerClass}">
          <div class="turn-header">
            <span>[턴 ${t.turnNumber}] ${t.speakerTitle} ${t.emotion ? `(${t.emotion})` : ''}</span>
            <span style="font-size: 10px; font-weight: 600; opacity: 0.85;">${stageLabel}</span>
          </div>
          <div class="turn-content">${t.content}</div>
          ${(t.legalKeywords && t.legalKeywords.length > 0) || t.keyPointSummary ? `
            <div class="turn-meta">
              ${t.legalKeywords && t.legalKeywords.length > 0 ? `<span>⚖️ <strong>관련 법조/근거:</strong> ${t.legalKeywords.join(', ')}</span>` : ''}
              ${t.keyPointSummary ? `<span style="margin-left: 12px;">💡 <strong>상담 포인트:</strong> ${t.keyPointSummary}</span>` : ''}
            </div>
          ` : ''}
        </div>
      `;
    }).join('')}
  </div>

  ${analysis && analysis.nextMeetingChecklist && analysis.nextMeetingChecklist.length > 0 ? `
  <!-- Next Meeting Checklist -->
  <div class="section-title">
    <span>3. 차기 미팅 확정 사항 & 전문 자문단 준비 체크리스트</span>
  </div>
  <div class="checklist-box">
    ${analysis.nextMeetingChecklist.map((item, idx) => `
      <div class="checklist-item">
        <strong>${idx + 1}.</strong> <span>${item}</span>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${scenario?.consultantLiveNotes?.trim() ? `
  <!-- Consultant Notes -->
  <div class="section-title">
    <span>4. 컨설턴트 실전 시뮬레이션 라이브 메모 & 반론 기록</span>
  </div>
  <div class="notes-box">
    ${scenario.consultantLiveNotes.trim()}
  </div>
  ` : ''}

  <!-- Footer -->
  <div class="report-footer">
    <span>본 시나리오는 한화피플라이프 법인컨설팅 전용 교육 및 시뮬레이션 목적으로 자동 생성되었습니다.</span>
    <span>한화피플라이프 대전글로리사업단</span>
  </div>

  <script>
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        window.print();
      }, 350);
    });
  </script>
</body>
</html>`;
}

export function openScenarioPdfPrintWindow(scenario: GeneratedScenario): void {
  const html = generateScenarioPdfHtml(scenario);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    // If popup blocked, render in an invisible iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
    }
  }
}
