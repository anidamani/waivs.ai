import { VertexAI } from "@google-cloud/vertexai";
import "./waivs-452918-20457656a5ef.json";

const project = process.env.VERTEX_AI_PROJECT_ID;
const location = process.env.VERTEX_AI_LOCATION;

const vertexAI = new VertexAI({ project, location });

const genAI = vertexAI.getGenerativeModel({
  model: process.env.VERTEX_AI_GENERATIVE_MODEL!,
});

export default genAI;
