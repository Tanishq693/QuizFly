import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Quiz } from '@/lib/types';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { saveQuizToStore } from '@/app/api/quizzes/route';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { url, topic, text } = body;

    if (!url && !text) {
      return NextResponse.json(
        { success: false, error: 'URL or text content is required for quiz generation.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Extract domain from URL
    let domain = 'web-article.com';
    try {
      if (url) {
        const parsedUrl = new URL(url);
        domain = parsedUrl.hostname.replace(/^www\./, '');
      }
    } catch {
      domain = 'web-article.com';
    }

    // FULL ARTICLE SCRAPING (for Web Landing Page generator when URL is passed without full text)
    let articleText = text || '';
    let scrapedTitle = topic || '';

    if (url && (!articleText || articleText.trim().length < 100)) {
      try {
        console.log(`[QuizFly Generator] Scraping article text from URL: ${url}`);
        const fetchRes = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });

        if (fetchRes.ok) {
          const html = await fetchRes.text();
          const dom = new JSDOM(html, { url });
          const reader = new Readability(dom.window.document);
          const parsedArticle = reader.parse();

          if (parsedArticle && parsedArticle.textContent) {
            articleText = parsedArticle.textContent.trim();
            if (parsedArticle.title && !scrapedTitle) {
              scrapedTitle = parsedArticle.title;
            }
          }
        }
      } catch (scrapeErr) {
        console.warn('[QuizFly Generator] Web scraping fallback notice:', scrapeErr);
      }
    }

    // IF LLM API KEY IS MISSING: Return explicit error response (Do not pretend to generate)
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'GEMINI_API_KEY is not configured in web/.env.local. Please add GEMINI_API_KEY=your_key to enable real AI quiz generation!',
          isConfigError: true
        },
        { status: 503 }
      );
    }

    // CALL GOOGLE GENAI SDK FOR REAL ACTIVE RECALL GENERATION
    const ai = new GoogleGenAI({ apiKey });

    // Optimize text input size to 3,500 chars to avoid high-demand 503 timeouts
    const safeContent = (articleText || scrapedTitle || topic || '').slice(0, 3500);

    const prompt = `
You are QuizFly's active-recall AI engine. Analyze the following webpage text and generate 3 high-yield multiple-choice questions for active recall learning.

ARTICLE TITLE/TOPIC: ${scrapedTitle || topic || domain}
SOURCE URL: ${url || domain}
TEXT CONTENT:
${safeContent}

STRICT REQUIREMENTS:
1. Return ONLY a raw valid JSON object with NO markdown formatting, NO backticks, NO markdown block wrappers.
2. The JSON schema must strictly match:
{
  "title": "Short descriptive title for the quiz",
  "category": "Technology" | "Science" | "AI & ML" | "Web Dev" | "System Design" | "General",
  "questions": [
    {
      "id": "q1",
      "prompt": "Clear, challenging active-recall question testing a key concept",
      "options": [
        { "id": "opt1", "text": "Option A text" },
        { "id": "opt2", "text": "Option B text" },
        { "id": "opt3", "text": "Option C text" },
        { "id": "opt4", "text": "Option D text" }
      ],
      "correctOptionId": "opt1",
      "sourceQuote": "Exact sentence or excerpt from the article supporting this answer",
      "quoteLocation": "Paragraph / Section location"
    }
  ]
}
`;

    // Try primary model gemini-3.6-flash, with fallback to gemini-2.5-flash / gemini-1.5-flash for 503 high-demand spikes
    const modelCandidates = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
    let response: any = null;
    let lastError: any = null;

    for (const modelName of modelCandidates) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });
        if (response && response.text) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`[QuizFly API] Model ${modelName} returned status ${err.status || 500}, trying candidate fallback...`);
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('Gemini API is currently experiencing high demand. Please try again in a few seconds.');
    }

    const responseText = response.text.trim();

    // Clean JSON response
    const cleanJsonText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJsonText);

    const quizSlug = domain.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-' + Date.now().toString().slice(-4);

    const generatedQuiz: Quiz = {
      id: quizSlug,
      title: parsedData.title || scrapedTitle || topic || `Active Recall Quiz: ${domain}`,
      sourceUrl: url || 'https://' + domain,
      sourceDomain: domain,
      category: parsedData.category || 'General',
      timeAgo: 'Just now',
      avgScore: 85,
      estMinutes: Math.max(2, Math.ceil((parsedData.questions?.length || 3) * 1.5)),
      questions: parsedData.questions || [],
      createdAt: new Date().toISOString()
    };

    await saveQuizToStore(generatedQuiz);

    return NextResponse.json({
      success: true,
      quiz: generatedQuiz
    });

  } catch (err: any) {
    console.error('[QuizFly API] LLM Generation error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed generating AI quiz with Gemini API.' },
      { status: 500 }
    );
  }
}
