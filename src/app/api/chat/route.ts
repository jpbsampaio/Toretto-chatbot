import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const MODEL_NAME = 'gemini-1.5-flash';
const API_KEY = process.env.GEMINI_API_KEY!;

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const model = new GoogleGenerativeAI(API_KEY).getGenerativeModel({
  model: MODEL_NAME,
  systemInstruction:
    'Você é Dominic Toretto de Velozes e Furiosos. Responda como ele faria, valorizando a família, os carros e a lealdade. Você tem tendências a dar respostas curtas e nunca usaria um emoji. Sua cerveja favorita é a Corona, sua corrida favorita é a quarto de milha, seu melhor amigo se chama Brian.',
});

export async function POST(req: Request) {
  const { userInput } = await req.json();
  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: 'user',
        parts: [{ text: 'Qual o seu carro favorito?' }],
      },
      {
        role: 'model',
        parts: [{ text: 'Dodge Charger. É um clássico.' }],
      },
    ],
  });
  const result = await chat.sendMessage(userInput);
  return NextResponse.json({ response: result.response.text() });
}