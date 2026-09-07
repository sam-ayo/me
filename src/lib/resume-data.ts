/* One source for the resume. The route serves it as a PDF and the page
   renders it as HTML, so both must read the same data. */

export interface Contact {
  label: string;
  href: string;
  // `print` replaces `label` on paper, where a link is not clickable.
  print: string;
  /* The page is the website, so a link to it belongs on the PDF only. */
  pdfOnly?: boolean;
}

export interface Education {
  school: string;
  location: string;
  degree: string;
  dates: string;
  notes: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Role {
  title: string;
  company: string;
  dates: string;
  points: string[];
}

export interface ResumeProject {
  title: string;
  href: string;
  date: string;
  stack: string[];
  points: string[];
}

export const name = 'Samuel Adeoye';

export const pdfFileName = 'Samuel-Adeoye-Resume.pdf';

export const summary =
  'Software builder with 4+ years shipping web, mobile, and desktop applications. I build secure backends in Python and TypeScript, and production UIs in React and Flutter. I ship products with happy and paying customers.';

export const contacts: Contact[] = [
  {
    label: 'website',
    href: 'https://samayo.me',
    print: 'samayo.me',
    pdfOnly: true,
  },
  {
    label: 'linkedin',
    href: 'https://www.linkedin.com/in/sam-ayo-adeoye/',
    print: 'linkedin.com/in/sam-ayo-adeoye',
  },
  {
    label: 'github',
    href: 'https://github.com/sam-ayo',
    print: 'github.com/sam-ayo',
  },
  {
    label: 'email',
    href: 'mailto:samuelayomideadeoye@gmail.com',
    print: 'samuelayomideadeoye@gmail.com',
  },
];

export const education: Education = {
  school: 'Memorial University of Newfoundland',
  location: "St. John's NL, Canada",
  degree: 'B.Sc. (Honors) in Computer Science',
  dates: 'September 2020 – December 2024',
  notes: [
    'GPA: 3.88/4.0',
    "Faculty of Science Dean's List (2022, 2023, 2024), MUNCSS member",
  ],
};

export const skills: SkillGroup[] = [
  { label: 'Languages', items: ['TypeScript', 'Python', 'Dart'] },
  {
    label: 'AI harnesses',
    items: ['Claude Code', 'Codex CLI', 'Zed parallel agents'],
  },
  {
    label: 'Backend',
    items: [
      'Express',
      'Hono',
      'FastAPI',
      'NestJS',
      'Django',
      'Spring',
      'Rocket',
    ],
  },
  {
    label: 'Frontend',
    items: ['React', 'Next.js', 'Flutter', 'HTML', 'CSS'],
  },
  { label: 'UI', items: ['Cloudscape', 'shadcn/ui'] },
  {
    label: 'Cloud',
    items: ['Microsoft Azure', 'AWS', 'Supabase', 'Appwrite', 'Vercel'],
  },
  {
    label: 'Data',
    items: ['PostgreSQL', 'MongoDB', 'Supabase', 'Azure Blob Storage'],
  },
  {
    label: 'Other',
    items: [
      'Git',
      'Nginx',
      'Bash',
      'Azure Functions',
      'Tesseract',
      'Vim motions',
    ],
  },
];

export const experience: Role[] = [
  {
    title: 'Software Engineer (Team lead)',
    company: 'Enaimco',
    dates: 'December 2025 – Present',
    points: [
      'Lead a team of 3 developers building infrastructure that processes 2TB+ of video, photo, and document assets monthly',
      'Mentor junior developers through regular 1:1s and author their performance reviews',
      'Design and optimize ingestion pipelines with 99%+ extraction accuracy across all video formats and 7+ photo file types',
      'Integrate third-party DVR services for real-time video ingestion during offshore inspection operations',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Enaimco',
    dates: 'January 2024 – December 2025',
    points: [
      'Developed AI solutions that extract metadata and properties of subsea assets from unstructured engineering documents using Python and LangChain',
      'Implemented a video processing pipeline on Azure Functions with queue triggers and Azure Blob Storage, supporting 500+ videos averaging 2.3GB each',
      'Used Tesseract OCR to extract text from video frames, processing each frame asynchronously through queue triggers for reliability',
      'Enabled GIS location extraction and transcript generation from subsea ROV inspection videos',
      'Integrated full-text search using MongoDB Full-Text Search and Lucene indexes, improving information retrieval across the application',
    ],
  },
  {
    title: 'Software Engineer Intern',
    company: 'Enaimco',
    dates: 'May 2023 – December 2023',
    points: [
      'Led the development of report generation with large language models in the application',
      'Improved server safety by adding request body validation to the company API',
      'Owned and managed the development of vector semantic search in the application',
      'Reviewed code, gave and received feedback, and suggested improvements to teammates',
      'Worked in an agile team with product managers and QA engineers',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Data and Image Analysis Group (DIAG)',
    dates: 'May 2022 – May 2023',
    points: [
      'Led the development of a Next.js visualization tool that lets AI researchers explore medical image metadata',
      'Built a Python data synchronization tool to sync data between virtual machines',
      'Configured NGINX to deploy in-house websites for performance and reliability',
      'Reviewed code on GitLab and gave feedback to improve code quality and team collaboration',
    ],
  },
];

export const projects: ResumeProject[] = [
  {
    title: 'Notable',
    href: 'https://www.notableai.ca',
    date: 'December 2024',
    stack: ['TypeScript', 'Dart', 'PostgreSQL', 'Vercel AI SDK'],
    points: [
      'Co-founded and built a recording tool with 10+ paying monthly customers',
      'Cross-platform Electron desktop app with React for the renderer layer (macOS and Windows)',
      'Cross-platform mobile app with Flutter (iOS and Android)',
      'Built a meeting-detection engine from mic-activation events and focused-window PID analysis to identify meeting platforms and prompt automated note-taking',
    ],
  },
  {
    title: 'Rechef',
    href: 'https://apps.apple.com/us/app/rechef-recipe-manager/id6758213347',
    date: 'February 2026',
    stack: ['TypeScript', 'Dart', 'PostgreSQL'],
    points: [
      'Recipe extraction engine that parses ingredients and step-by-step instructions from URLs, videos, and photos using AI',
      'Cross-platform on iOS and Android',
    ],
  },
  {
    title: 'Ragask',
    href: 'https://app.ragask.com',
    date: 'October 2023',
    stack: ['Python', 'LangChain', 'FastAPI', 'Next.js', 'MongoDB'],
    points: [
      'AI copilot that helps researchers with literature reviews and data analysis',
      'Summarizes academic papers with LangChain and the OpenAI GPT-4 API',
      'Retrieves information from papers through RAG, with a MongoDB vector database as the memory store',
      'Exposes the application logic as a REST API built with FastAPI and Beanie ODM',
    ],
  },
];
