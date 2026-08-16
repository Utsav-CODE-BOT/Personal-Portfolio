import GithubIcon from "./../public/assets/icons/github.svg";
import LinkedInIcon from "./../public/assets/icons/linkedin.svg";
import FrontendIcon from "./../public/assets/icons/frontend.svg";
import LeaderShipIcon from "./../public/assets/icons/leadership.svg";
import ProblemSolvingIcon from "./../public/assets/icons/problem-solving.svg";
import FreelancerIcon from "./../public/assets/icons/freelance.svg";
import BackendIcon from "./../public/assets/icons/backend.svg";
import FullStackIcon from "./../public/assets/icons/full-stack.svg";

const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "skills",
    title: "Skills",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Deep Learning Engineer",
    icon: <BackendIcon />,
  },
  {
    title: "AI Developer",
    icon: <FullStackIcon />,
  },
  {
    title: "Machine Learning Specialist",
    icon: <ProblemSolvingIcon />,
  },
  {
    title: "Data Scientist",
    icon: <FreelancerIcon />,
  },
];

const technologies = {
  languages: [
    {
      name: "Python",
      icon: "/assets/tech/python.svg",
      link: "https://www.python.org/",
    },
    {
      name: "JavaScript",
      icon: "/assets/tech/javascript.svg",
      link: "https://262.ecma-international.org/",
    },
    {
      name: "TypeScript",
      icon: "/assets/tech/typescript.svg",
      link: "https://www.typescriptlang.org/",
    },
    {
      name: "C",
      icon: "/assets/tech/c.svg",
      link: "https://en.cppreference.com/w/c",
    },
    {
      name: "Java",
      icon: "/assets/tech/java.svg",
      link: "https://www.java.com/en/",
    },
    {
      name: "HTML5",
      icon: "/assets/tech/html5.svg",
      link: "https://html.spec.whatwg.org/multipage/",
    },
    {
      name: "CSS3",
      icon: "/assets/tech/css3.svg",
      link: "https://www.w3.org/Style/CSS/Overview.en.html",
    },
  ],
  frameworks: [
    {
      name: "Next.js",
      icon: "/assets/tech/nextjs.svg",
      link: "https://nextjs.org/",
    },
    {
      name: "TailwindCSS",
      icon: "/assets/tech/tailwindcss.svg",
      link: "https://tailwindcss.com/",
    },
    {
      name: "Express.js",
      icon: "/assets/tech/expressjs.png",
      link: "https://expressjs.com/",
    },
  ],
  libraries: [
    {
      name: "React",
      icon: "/assets/tech/react.svg",
      link: "https://react.dev/",
    },
    {
      name: "Three.js",
      icon: "/assets/tech/threejs.svg",
      link: "https://threejs.org/",
    },
    {
      name: "Framer-motion",
      icon: "/assets/tech/framer.svg",
      link: "https://www.framer.com/motion/",
    },
  ],
  tools: [
    {
      name: "Git",
      icon: "/assets/tech/git.svg",
      link: "https://git-scm.com/",
    },
    {
      name: "Github",
      icon: "/assets/icons/github.svg",
      link: "https://github.com/",
    },
    {
      name: "Postman",
      icon: "/assets/tech/postman.svg",
      link: "https://www.postman.com/",
    },
    {
      name: "Figma",
      icon: "/assets/tech/figma.svg",
      link: "https://www.figma.com/",
    },
    {
      name: "Docker",
      icon: "/assets/tech/docker.svg",
      link: "https://www.docker.com/",
    },
  ],
  environments: [
    {
      name: "Node.js",
      icon: "/assets/tech/nodejs.svg",
      link: "https://nodejs.org/en",
    },
  ],
  databases: [
    {
      name: "MySQL",
      icon: "/assets/tech/my-sql.png",
      link: "https://www.mysql.com/",
    },
    {
      name: "PostgreSQL",
      icon: "/assets/tech/postgresql.png",
      link: "https://www.postgresql.org",
    },
    {
      name: "MongoDB",
      icon: "/assets/tech/mongodb.svg",
      link: "https://www.mongodb.com/",
    },
    {
      name: "Firebase",
      icon: "/assets/tech/firebase.svg",
      link: "https://firebase.google.com/",
    },
  ],
};

const experiences = [
  {
    title: "B.Tech in Artificial Intelligence & Data Science",
    company_name: "Amrita Vishwa Vidyapeetham, Bengaluru",
    icon: "/assets/company/gdsc-logo.svg",
    iconBg: "#E6DEDD",
    date: "2023 - Present",
    points: [
      "Deepening academic foundation in Deep Learning, NLP, Time Series Analysis, and Multi-Agent Orchestration.",
      "Developing and testing robust AI architectures, integrating advanced models like PyTorch, TensorFlow, and LangChain.",
      "Collaborating on high-performance projects, including web-scraping agents, investment simulations, and speech bots.",
      "Optimizing complex workflows, utilizing Docker containerization and AWS infrastructure for efficient local configurations.",
    ],
  },
  {
    title: "AI Developer & Open Source Contributor",
    company_name: "GitHub Developer Community",
    icon: "/assets/icons/freelance.svg",
    iconBg: "#E6DEDD",
    date: "2024 - Present",
    points: [
      "Engineered an autonomous framework for Agentic AI security, addressing goal-hijacking and sandboxed execution loops.",
      "Built production-ready GenAI mental health agents with built-in emergency response protocols and clinic referral workflows.",
      "Created collaborative multi-agent pipelines for tech aggregation, resolving concurrency and data integrity constraints.",
      "Contributed to several open-source utility scripts, maintaining a highly active software engineering and contribution footprint.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "Utsav has an exceptional capability in structuring Deep Learning workflows. His work in agentic security patterns shows true technical maturity.",
    name: "Dr. R. Kumar",
    designation: "Project Advisor",
    company: "Amrita Vishwa Vidyapeetham",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    testimonial:
      "Collaborating with Utsav on multi-agent planner architectures was seamless. He has a solid understanding of LLM orchestration and tools.",
    name: "Sneha Patel",
    designation: "Research Peer",
    company: "AI & DS Dept",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const projects = [
  {
    name: "Agentic AI Security",
    description:
      "A comprehensive security hardening framework for autonomous agent systems. Implements semantic firewalls to prevent goal-hijacking/prompt injections, runtime verification of tool executions, and micro-VM sandboxing for secure file system operations.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "security",
        color: "green-text-gradient",
      },
      {
        name: "llm-agents",
        color: "pink-text-gradient",
      },
      {
        name: "sandbox",
        color: "orange-text-gradient",
      },
    ],
    image: "/assets/projects/fig-pro.png",
    source_code_link: "https://github.com/Utsav-CODE-BOT/Agentic_AI_Security",
    deployed_link: "https://github.com/Utsav-CODE-BOT/Agentic_AI_Security",
  },
  {
    name: "Vapi Voice Agent",
    description:
      "A low-latency, real-time conversational AI voice assistant integrated with Vapi. Orchestrates advanced speech-to-text (STT) and text-to-speech (TTS) engines, utilizing async webhook handling and tool-calling endpoints to trigger actions during telephony calls.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "voice-ai",
        color: "green-text-gradient",
      },
      {
        name: "telephony",
        color: "pink-text-gradient",
      },
      {
        name: "api-integration",
        color: "orange-text-gradient",
      },
    ],
    image: "/assets/projects/vanlife.png",
    source_code_link: "https://github.com/Utsav-CODE-BOT/Vapi_voice_AGENT",
    deployed_link: "https://github.com/Utsav-CODE-BOT/Vapi_voice_AGENT",
  },
  {
    name: "AI Mental Health Chatbot",
    description:
      "A production-ready generative AI triage platform. Features highly aligned ethical guardrails for detecting high-risk triggers (e.g. self-harm statements) to initiate emergency therapist routing and graduations from standard prototypes to scalable microservice APIs.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "generative-ai",
        color: "green-text-gradient",
      },
      {
        name: "safety-triage",
        color: "pink-text-gradient",
      },
      {
        name: "streamlit",
        color: "orange-text-gradient",
      },
    ],
    image: "/assets/projects/facility-manager.png",
    source_code_link: "https://github.com/Utsav-CODE-BOT/AI-mentalhealth-chatbot",
    deployed_link: "https://github.com/Utsav-CODE-BOT/AI-mentalhealth-chatbot",
  },
  {
    name: "Agentic Assistant DORA",
    description:
      "An autonomous agent system designed to support EU Digital Operational Resilience Act (DORA) operational monitoring. Automatically aggregates ICT incident reports, creates cryptographically signed audit logs of agent actions, and tracks critical system threshold parameters.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "dora-compliance",
        color: "green-text-gradient",
      },
      {
        name: "cryptography",
        color: "pink-text-gradient",
      },
      {
        name: "audit-trails",
        color: "orange-text-gradient",
      },
    ],
    image: "/assets/projects/netflix-clone.png",
    source_code_link: "https://github.com/Utsav-CODE-BOT/Agentic_assistant_DORA",
    deployed_link: "https://github.com/Utsav-CODE-BOT/Agentic_assistant_DORA",
  },
  {
    name: "Multiagent Newsletter Generator",
    description:
      "A collaborative multi-agent architecture automating technical newsletter curation. Orchestrates specialized scraping, analysis, and writing agents utilizing LangChain, executing semantic article filtering, deduplication, and draft publication workflows.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "langchain",
        color: "green-text-gradient",
      },
      {
        name: "multi-agent",
        color: "pink-text-gradient",
      },
      {
        name: "web-scraping",
        color: "orange-text-gradient",
      },
    ],
    image: "/assets/projects/gdsc-website.png",
    source_code_link: "https://github.com/Utsav-CODE-BOT/Multiagent_newsletter_generator",
    deployed_link: "https://github.com/Utsav-CODE-BOT/Multiagent_newsletter_generator",
  },
];

const socials = [
  {
    id: "github",
    icon: <GithubIcon />,
    link: "https://github.com/Utsav-CODE-BOT",
  },
  {
    id: "linkedin",
    icon: <LinkedInIcon />,
    link: "https://www.linkedin.com/in/utsav26/",
  },
];

const heroTexts = [
  "Deep Learning Engineer",
  500,
  "AI Developer",
  500,
  "Data Scientist",
  500,
  "Problem Solver",
  500,
];

export {
  navLinks,
  services,
  technologies,
  experiences,
  testimonials,
  projects,
  socials,
  heroTexts,
};
