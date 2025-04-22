import { VertexAI } from "@google-cloud/vertexai";
import { Transcription } from "@/types";
import { AllSummaries } from "@/gemini/summary-types";
import { notesTemplatesPrompt } from "@/gemini/gemini-response-templates";
import ffmpeg from "fluent-ffmpeg";
// import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const project = process.env.VERTEX_AI_PROJECT_ID!;
const location = process.env.VERTEX_AI_LOCATION!;
const modelName = process.env.VERTEX_AI_GENERATIVE_MODEL!;

const vertexAI = new VertexAI({ project, location });
const genAI = vertexAI.getGenerativeModel({ model: modelName });

export const transcribe = async (audioBlob: Blob): Promise<Transcription[]> => {
  const buffer = Buffer.from(await audioBlob.arrayBuffer());

  const base64Audio = buffer.toString("base64");

  const result = await genAI.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "audio/mp3", // adjust based on actual format
              data: base64Audio,
            },
          },
          {
            text: `I need an exact transcription of the audio in json format. This audio contains a conversation between a doctor and a patient. I need transcription in the following format:

[
  {
    "role": "doctor",
    "text": "string",
    "startTime": "number",
    "endTime": "number"
  },
  {
    "role": "patient",
    "text": "string",
    "startTime": "number",
    "endTime": "number"
  }
]

NOTE: Do not include any other text than the transcription. Language should be English.`,
          },
        ],
      },
    ],
  });

  const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
  const cleaned = cleanJson(text) as Transcription[];

  console.log("transcription:", cleaned);
  return cleaned;
};

export const getSummary = async (
  transcription: string,
  summaryType: keyof AllSummaries,
  language: string
) => {
  const result = await genAI.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${transcription}

${notesTemplatesPrompt[summaryType]}

Use this JSON object as template hierarchy to generate HTML response. Don't add tags like html, body, head etc, just use the tags H1 - H6 for the headings and p tags for the text according to the hierarchy and span, b, i for styling.

NOTE: Do not include any other text than the note. Provide response in HTML format. Don't use divs, I will be using this text in a RichText editor. Also don't use null, add N/A strings instead. Don't even add quotation signs or backticks in start or end of the response.
Language should be ${language}.
`,
          },
        ],
      },
    ],
  });

  const html =
    result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return cleanHTMLString(html);
};

const cleanJson = (json = "") => {
  const cleaned = json.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse AI response:", err);
  }
};

function cleanHTMLString(input: string) {
  return input
    .replace(/^```html\s*/i, "") // remove starting ```html (case-insensitive)
    .replace(/```$/i, "") // remove ending ```
    .trim(); // clean up leading/trailing whitespace
}

// ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const convertToAac = async (audioBuffer: Buffer): Promise<File> => {
  const inputPath = path.join("/tmp", `${uuidv4()}.wav`);
  const outputPath = path.join("/tmp", `${uuidv4()}.aac`);

  await fs.writeFile(inputPath, audioBuffer);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec("aac")
      .on("end", async () => {
        const convertedBuffer = await fs.readFile(outputPath);
        await fs.unlink(inputPath);
        await fs.unlink(outputPath);

        const file = new File([convertedBuffer], "converted.aac", {
          type: "audio/aac",
        });
        resolve(file);
      })
      .on("error", (err) => {
        reject(err);
      })
      .save(outputPath);
  });
};
