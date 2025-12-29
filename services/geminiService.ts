
import { GoogleGenAI } from "@google/genai";
import { Workout, WeightRecord } from "../types";

export const analyzeProgress = async (workouts: Workout[], weightHistory: WeightRecord[], userName: string) => {
  // FIX: Initialize GoogleGenAI strictly according to guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const lastWorkoutsSummary = workouts.slice(-5).map(w => ({
    date: w.date,
    type: w.type,
    exercisesCount: w.exercises.length
  }));

  const weightTrend = weightHistory.slice(-5).map(w => ({
    date: w.date,
    weight: w.weight
  }));

  const prompt = `
    Analise o progresso de treino de ${userName}.
    Últimos 5 treinos: ${JSON.stringify(lastWorkoutsSummary)}
    Histórico de peso recente: ${JSON.stringify(weightTrend)}
    
    Por favor, forneça:
    1. Uma breve análise do ritmo atual.
    2. Duas dicas práticas para melhorar os resultados.
    3. Uma mensagem motivacional curta.
    Responda em Português do Brasil. Mantenha um tom profissional e encorajador.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // FIX: Access .text property directly as per guidelines.
    return response.text;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Não foi possível gerar a análise no momento. Continue treinando firme!";
  }
};
