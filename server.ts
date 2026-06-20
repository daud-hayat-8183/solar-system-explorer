/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the official Gemini SDK
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // POST: Generate personalized quiz
  app.post("/api/quiz/generate", async (req, res) => {
    try {
      const { focus, customFocusText, comparedTelemetry, simCompletedCount } = req.body;

      let promptFocus = focus || "All Solar System Worlds (General Core)";
      if (focus === "Custom Focus" && customFocusText) {
        promptFocus = `Custom Astronomy Focus: "${customFocusText}"`;
      }

      let telemetryContext = "";
      if (comparedTelemetry && comparedTelemetry.length > 0) {
        telemetryContext += `The student recently completed interactive laboratory telemetry comparing: ${comparedTelemetry.join(" vs ")}. `;
      }
      if (typeof simCompletedCount === "number" && simCompletedCount > 0) {
        telemetryContext += `The student has successfully completed ${simCompletedCount} simulated orbital lander missions. `;
      }

      const systemInstruction = 
        "You are Cosmos Explorers Academy's Lead Neural Tutor. Your job is to curate highly personalized, scientifically accurate multiple-choice space science quizzes. " +
        "Make sure the questions evaluate the defined focus and subtly test their telemetry discoveries. Each quiz has exactly 5 questions. " +
        "Ensure the wrong answers (options) are plausible but incorrect. The explanation should be highly educational and detailed.";

      const prompt = 
        `Generate a personalized multiple choice quiz for a student with the following specifications:\n` +
        `- Focus Topic: ${promptFocus}\n` +
        `- Student laboratory context: ${telemetryContext}\n\n` +
        `Your response must comply exactly with the required JSON schema, creating exactly 5 multiple choice questions. Keep the badge title creative and related to the focus.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { 
                type: Type.STRING, 
                description: "The name of this curated quiz, e.g. 'Gas Giant Deep Space Calibrator'" 
              },
              subtitle: { 
                type: Type.STRING, 
                description: "Intelligent description tailored to their focus, e.g. 'Evaluating ring density, storm vectors, and simulation history.'" 
              },
              badge: { 
                type: Type.STRING, 
                description: "A cool science explorer badge unlocked on success, e.g. 'Ring Physics Specialist'" 
              },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    question: { 
                      type: Type.STRING, 
                      description: "Tailored educational multiple-choice question." 
                    },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Exactly 4 unique options."
                    },
                    answer: { 
                      type: Type.INTEGER, 
                      description: "0-indexed correct option index (0 to 3)." 
                    },
                    explanation: { 
                      type: Type.STRING, 
                      description: "Educational explanation detailing the physical principles or telemetry results." 
                    }
                  },
                  required: ["id", "question", "options", "answer", "explanation"]
                }
              }
            },
            required: ["title", "subtitle", "badge", "questions"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response content from Gemini.");
      }

      const quizData = JSON.parse(responseText.trim());
      res.json(quizData);
    } catch (error: any) {
      console.error("Quiz Generation Error:", error);
      res.status(500).json({ 
        error: "Failed to generate dynamic quiz metrics. Check telemetry link.", 
        details: error?.message || String(error) 
      });
    }
  });

  // POST: Retrieve personalized tutor feedback
  app.post("/api/quiz/feedback", async (req, res) => {
    try {
      const { title, questions, answersStatus, score, focus } = req.body;

      let promptContent = `The student completed the custom quiz titled: "${title}" focusing on "${focus || "General Cosmos"}"\n`;
      promptContent += `Score achieved: ${score} XP out of a maximum. State correct/incorrect details:\n`;

      if (questions && questions.length > 0) {
        questions.forEach((q: any, idx: number) => {
          const isCorrect = answersStatus && answersStatus[idx];
          promptContent += `Question ${idx + 1}: "${q.question}"\n`;
          promptContent += `- Correct Answer: "${q.options[q.answer]}"\n`;
          promptContent += `- Student Status: ${isCorrect ? "Correctly Answered" : "Incorrectly Answered"}\n\n`;
        });
      }

      const systemInstruction = 
        "You are Cosmos Explorers Academy's Lead AI Space Tutor. Write a personalized, highly encouraging 1-2 paragraph feedback report for the student. " +
        "Address them with stellar professional composure. Critique their mistakes constructively by explaining the deep physics involved, " +
        "praise their perfect solutions, and provide exactly 3 specific, highly customized study tips. Keep your response in polished Markdown format.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptContent,
        config: {
          systemInstruction,
          temperature: 0.8
        }
      });

      const feedback = response.text || "Sensors failed to record telemetry reflections. Keep up the high effort!";
      res.json({ feedback });
    } catch (error: any) {
      console.error("Tutor Feedback Error:", error);
      res.status(500).json({ 
        error: "Failed to retrieve personalized AI tutor diagnostics.", 
        details: error?.message || String(error) 
      });
    }
  });

  // Vite middleware setup for assets/routes
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cosmos server running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
