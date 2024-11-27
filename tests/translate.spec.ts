import { test, expect } from '@playwright/test';

test.describe('번역 기능 테스트', () => {
  test('기본 번역 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 소스 텍스트 입력
    await page.fill('#sourceText', 'Hello');
    
    // 번역 결과 대기
    await page.waitForTimeout(1000);
    
    // 번역 결과 확인
    const targetText = await page.inputValue('#targetText');
    expect(targetText).toBe('안녕하세요');
  });

  test('언어 변경 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 소스 언어를 영어로 변경
    await page.selectOption('#sourceLanguage', 'en');
    // 타겟 언어를 일본어로 변경
    await page.selectOption('#targetLanguage', 'ja');
    
    await page.fill('#sourceText', 'Hello');
    await page.waitForTimeout(1000);
    
    const targetText = await page.inputValue('#targetText');
    expect(targetText).toBe('こんにちは');
  });

  test('초기화 버튼 테스트', async ({ page }) => {
    await page.goto('/');
    
    await page.fill('#sourceText', 'Test text');
    await page.click('button:has-text("초기화")');
    
    const sourceText = await page.inputValue('#sourceText');
    const targetText = await page.inputValue('#targetText');
    
    expect(sourceText).toBe('');
    expect(targetText).toBe('');
  });
}); 