import { chunkMarkdown } from './chunker.js';

// Pre-embedded knowledge documents for zero-disk-dependency portability (Edge & Node compatible)
export const RAW_KNOWLEDGE = [
  {
    source: 'resume.md',
    content: `# Utsav D - Resume & Professional Background

## Overview
- **Name**: Utsav D
- **Role**: AI & Machine Learning Enthusiast | B.Tech AI & Data Science Candidate
- **Location**: Bengaluru, Karnataka, India
- **Email**: ud12714@gmail.com
- **Phone**: +91 9611240638
- **GitHub**: https://github.com/Utsav-CODE-BOT
- **LinkedIn**: https://www.linkedin.com/in/utsav26/
- **Portfolio**: https://personal-portfolio-yzzz.vercel.app/

## Professional Summary
AI & Data Science undergraduate with hands-on experience in Machine Learning, Deep Learning, Robotics, and Computer Vision. Developed end-to-end AI solutions including a 6-DOF robotic manipulator simulation, a reinforcement learning-based process scheduler, and an AI-powered food recognition system. Proficient in Python, PyTorch, and Flask, with strong skills in model development, agentic AI systems, and multi-modal applications. Seeking a Machine Learning or AI internship to contribute to real-world, scalable intelligent systems.

## Education
- **Amrita Vishwa Vidyapeetham, Bengaluru** (Aug 2024 – May 2028)
  - Degree: B.Tech in Artificial Intelligence & Data Science
  - Current SGPA: 6.8 / 10
  - Coursework: Deep Learning, Natural Language Processing, Computer Vision, Robotics Kinematics, Data Structures & Algorithms, Reinforcement Learning, Time Series Analysis.
- **Christ Junior College, Bengaluru** (Jun 2022 – May 2024)
  - Pre-University Education (PCMB: Physics, Chemistry, Mathematics, Biology)
  - Score: 84%

## Core Technical Skills
- **Programming Languages**: Python, C, JavaScript, Flutter, SQL, HTML5, CSS3
- **AI & Machine Learning Frameworks**: PyTorch, TensorFlow, Keras, scikit-learn, Stable-Baselines3, OpenAI Gym, Gymnasium, LangChain
- **Tools & Platforms**: Flask, Gradio, Git, GitHub, Linux, MATLAB, Simulink, Arduino, Robotics Toolbox, Google Colab, Docker
- **Databases**: MySQL, PostgreSQL, MongoDB, Firebase
- **Soft Skills**: Communication, Teamwork, Fast Learner, Adaptability, First-Principles Problem Solving
- **Spoken Languages**: English (Professional), Kannada (Native), Hindi (Conversational)

## Certifications & Extracurriculars
- **Certifications**: Complete Machine Learning & Deep Learning Specialization (Udemy)
- **Interests**: Open-Source Software Contribution, Powerlifting & Strength Training, Teaching, Bug Bounty Hunting, Embedded Robotics`
  },
  {
    source: 'projects_and_experience.md',
    content: `# Utsav D - Projects and Engineering Work

## Flagship Engineering Projects

### 1. 6-DOF Robotic Manipulator Simulation System
- **Role**: Robotics & Simulation Engineer (2025 – Present)
- **Tech Stack**: MATLAB, Robotics Toolbox, Simulink, Kinematics
- **Key Contributions**:
  - Designed and implemented a comprehensive 6-Degree-of-Freedom (6-DOF) robotic arm manipulator simulation in MATLAB incorporating forward and inverse kinematic transformations (Denavit-Hartenberg parameters).
  - Programmed volumetric 3D path planning algorithms to compute collision-free trajectories avoiding obstacle geometries in simulated 3D physical workspace environments.
  - Built interactive 3D visualizations validating manipulator arm reachability, joint angle limits, and spatial precision.

### 2. Predictive Process Scheduling System
- **Role**: Machine Learning & Systems Engineer (2025 – Present)
- **Tech Stack**: Python, Flask, OpenAI Gym, Gymnasium, Stable-Baselines3, PPO / DQN
- **Key Contributions**:
  - Developed an intelligent operating system process scheduling backend utilizing Reinforcement Learning (RL) to dynamically predict task burst times and minimize CPU turnaround time and waiting latency.
  - Implemented custom Markov Decision Process (MDP) states for CPU queue environments and trained agent policies with Stable-Baselines3.
  - Deployed model inference through a low-latency Flask API microservice handling concurrent simulation tasks.

### 3. AI-Powered Calorie & Nutrition Estimator
- **Role**: Backend Developer & ML Engineer (2024 – 2025)
- **Tech Stack**: Python, Google Gemini Multimodal Vision API, Gradio, HTML5
- **Key Contributions**:
  - Engineered an end-to-end food recognition web app utilizing Google Gemini multimodal vision capabilities to detect food items from user-uploaded photos.
  - Calculated real-time breakdown of macro-nutrients (calories, protein, carbs, fats) and offered structured dietary recommendations.
  - Crafted an intuitive, responsive UI with interactive nutrition cards and real-time inference feedback.

### 4. ROBOVOX: Multi-Microphone Speaker Verification
- **Role**: Machine Learning Researcher (2024 – 2025)
- **Tech Stack**: PyTorch, torchaudio, Gymnasium, Stable-Baselines3, YAML
- **Key Contributions**:
  - Designed a research-oriented acoustic speaker verification system incorporating PyTorch log-Mel spectrogram feature extraction and deep speaker embeddings.
  - Developed an RL-guided agent that dynamically selects optimal microphone channels in noisy multi-mic arrays to optimize signal-to-noise ratio.
  - Evaluated verification benchmarks with Equal Error Rate (EER) metrics across challenging simulated acoustic conditions.

### 5. Agentic AI Security Framework
- **Role**: Autonomous Systems Security Developer (2024 – Present)
- **Tech Stack**: Python, Semantic Guardrails, Sandboxing, LLM Security
- **Key Contributions**:
  - Engineered a security hardening framework for autonomous multi-agent environments to prevent prompt injections and goal-hijacking attacks.
  - Implemented semantic firewalls inspecting tool call parameters before execution, alongside micro-VM sandbox boundaries for file system commands.

### 6. Vapi Real-Time Voice Agent
- **Role**: Voice AI Engineer (2024 – Present)
- **Tech Stack**: Python, Vapi Telephony SDK, STT / TTS, Webhooks, FastAPI
- **Key Contributions**:
  - Created a low-latency, real-time conversational voice assistant integrated with Vapi telephony infrastructure.
  - Coordinated speech-to-text and text-to-speech pipelines with asynchronous webhook endpoints triggering automated support workflows.

### 7. AI Mental Health & Cognitive Support Chatbot
- **Role**: Full-Stack AI Developer (2024 – Present)
- **Tech Stack**: Python, LangChain, Streamlit, Safety Triage Guardrails
- **Key Contributions**:
  - Built a supportive generative AI chatbot equipped with strict ethical boundaries, sentiment tracking, and high-risk intent detection.
  - Integrated emergency referral guidance and crisis hotline routing when distress triggers are identified.

### 8. Agentic Assistant DORA
- **Role**: Compliance & Audit Architect (2024 – Present)
- **Tech Stack**: Python, Cryptography, DORA Compliance, Auditing
- **Key Contributions**:
  - Developed an autonomous auditing agent tracking operational resilience metrics in compliance with the EU Digital Operational Resilience Act (DORA).
  - Generated cryptographically verifiable audit logs of agent actions, monitoring ICT incident anomalies in real time.

### 9. Multiagent Newsletter Generator
- **Role**: Multi-Agent Systems Engineer (2024 – Present)
- **Tech Stack**: Python, LangChain, Multi-Agent Collaboration, BeautifulSoup
- **Key Contributions**:
  - Constructed an autonomous multi-agent pipeline automating tech newsletter curation.
  - Coordinated specialized web-scraping, filtering, synthesis, and editorial review agents to publish cohesive weekly digests.`
  }
];

// Return full merged knowledge document context
export function getFullKnowledgeContext() {
  return RAW_KNOWLEDGE.map(doc => doc.content).join('\n\n---\n\n');
}

// Build cached chunks
let indexedChunks = null;

export function getIndexedChunks() {
  if (indexedChunks) return indexedChunks;

  const chunks = [];
  for (const doc of RAW_KNOWLEDGE) {
    const rawChunks = chunkMarkdown(doc.content, 1000, 200);
    for (const chunk of rawChunks) {
      chunks.push({
        source: doc.source,
        content: chunk,
        tokens: tokenize(chunk)
      });
    }
  }

  indexedChunks = chunks;
  return indexedChunks;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

/**
 * Lightweight BM25 / TF-IDF lexical search
 * Returns top N chunks matching the query
 */
export function retrieveRelevantChunks(query, limit = 4) {
  const chunks = getIndexedChunks();
  if (!query || typeof query !== 'string') {
    return chunks.slice(0, limit);
  }

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return chunks.slice(0, limit);
  }

  // Calculate scores for each chunk
  const scored = chunks.map(chunk => {
    let score = 0;
    const chunkTokenSet = new Set(chunk.tokens);

    for (const token of queryTokens) {
      // Direct token match
      if (chunkTokenSet.has(token)) {
        score += 3;
      } else {
        // Partial/substring match
        for (const cToken of chunk.tokens) {
          if (cToken.includes(token) || token.includes(cToken)) {
            score += 1;
            break;
          }
        }
      }
    }

    return { ...chunk, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}
