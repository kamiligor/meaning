import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import matter from "gray-matter";
import { marked } from "marked";
import { personalize, type GenderForm } from "./personalize";

export interface PromptQuestion {
  text: string;
  estimatedTime: string;
  minChars: number;
}

export interface ValueGroup {
  category: string;
  values: string[];
}

export interface Exercise {
  id: string;
  module: string;
  title: string;
  difficulty: number;
  estimatedTime: string;
  psychologicalBasis: string;
  contentWarning: string | null;
  contraindications: string | null;
  introduction: string;
  promptQuestions: PromptQuestion[];
  valuesList: ValueGroup[] | null;
  promptInstruction: string | null;
  stuckHelpers: string[];
  reflectionPrompt: string;
  completionMessage: string | null;
  postExerciseNote: string | null;
  whyItWorks: string;
}

export interface ModuleIntroduction {
  module: string;
  title: string;
  order: number;
  scientificBasis: string[];
  content: string;
}

export interface Module {
  slug: string;
  title: string;
  subtitle: string;
  order: number;
  exercises: Exercise[];
  introduction: ModuleIntroduction | null;
}

const MODULE_CONFIG: Record<
  string,
  { slug: string; title: string; subtitle: string; order: number }
> = {
  "Przeszlosc": {
    slug: "przeszlosc",
    title: "Przeszłość",
    subtitle: "Zrozum swoją historię",
    order: 1,
  },
  "Terazniejszosc": {
    slug: "terazniejszosc",
    title: "Teraźniejszość",
    subtitle: "Zrozum, gdzie stoisz",
    order: 2,
  },
  "Przyszlosc": {
    slug: "przyszlosc",
    title: "Przyszłość",
    subtitle: "Zaprojektuj siebie",
    order: 3,
  },
};

// Map YAML module names (with Polish chars) to config keys
const MODULE_NAME_MAP: Record<string, string> = {
  "Przeszłość": "Przeszlosc",
  "Teraźniejszość": "Terazniejszosc",
  "Przyszłość": "Przyszlosc",
};

// Map introduction filenames to config keys
const INTRO_FILE_MAP: Record<string, string> = {
  "przeszlosc.md": "Przeszlosc",
  "terazniejszosc.md": "Terazniejszosc",
  "przyszlosc.md": "Przyszlosc",
};

let cachedExercises: Map<string, Exercise> | null = null;
const cachedModules: Map<string, Module[]> = new Map();
let cachedIntroductions: Map<string, ModuleIntroduction> | null = null;

function getExercisesDir(): string {
  // In production (standalone), files are copied to project root
  const possiblePaths = [
    path.join(process.cwd(), "docs", "exercises"),
    path.join(__dirname, "..", "..", "docs", "exercises"),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function getIntroductionsDir(): string {
  const possiblePaths = [
    path.join(process.cwd(), "content", "introductions"),
    path.join(__dirname, "..", "..", "content", "introductions"),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function parsePromptQuestion(
  raw: unknown
): PromptQuestion {
  // New format: { text: string, estimated_time?: string, min_chars?: number }
  if (typeof raw === "object" && raw !== null && "text" in raw) {
    const obj = raw as Record<string, unknown>;
    return {
      text: String(obj.text ?? ""),
      estimatedTime: String(obj.estimated_time ?? ""),
      minChars: typeof obj.min_chars === "number" ? obj.min_chars : 0,
    };
  }
  // Backward-compatible: plain string from old YAML
  return {
    text: String(raw ?? ""),
    estimatedTime: "",
    minChars: 0,
  };
}

function parseExerciseYaml(content: string): Exercise {
  const parsed = yaml.load(content) as {
    exercise: Record<string, unknown>;
  };
  const e = parsed.exercise;

  const rawQuestions = Array.isArray(e.prompt_questions)
    ? e.prompt_questions
    : [];

  return {
    id: e.id as string,
    module: e.module as string,
    title: e.title as string,
    difficulty: e.difficulty as number,
    estimatedTime: e.estimated_time as string,
    psychologicalBasis: e.psychological_basis as string,
    contentWarning: (e.content_warning as string) || null,
    contraindications: (e.contraindications as string) || null,
    introduction: e.introduction as string,
    promptQuestions: rawQuestions.map(parsePromptQuestion),
    valuesList: Array.isArray(e.values_list)
      ? (e.values_list as unknown[]).map((raw) => {
          const g = raw as Record<string, unknown>;
          return {
            category: String(g.category ?? ""),
            values: Array.isArray(g.values) ? g.values.map(String) : [],
          };
        })
      : null,
    promptInstruction: (e.prompt_instruction as string) || null,
    stuckHelpers: e.stuck_helpers as string[],
    reflectionPrompt: e.reflection_prompt as string,
    completionMessage: (e.completion_message as string) || null,
    postExerciseNote: (e.post_exercise_note as string) || null,
    whyItWorks: e.why_it_works as string,
  };
}

const PERSONALIZABLE_FIELDS: (keyof Exercise)[] = [
  "introduction",
  "promptQuestions",
  "promptInstruction",
  "stuckHelpers",
  "reflectionPrompt",
  "completionMessage",
  "postExerciseNote",
];

function personalizeExercise(exercise: Exercise, form: GenderForm): Exercise {
  const result = { ...exercise };
  for (const field of PERSONALIZABLE_FIELDS) {
    const value = result[field];
    if (typeof value === "string") {
      (result[field] as string) = personalize(value, form);
    } else if (Array.isArray(value)) {
      if (field === "promptQuestions") {
        // PromptQuestion[] — personalize only the text field
        result.promptQuestions = (value as PromptQuestion[]).map((q) => ({
          ...q,
          text: personalize(q.text, form),
        }));
      } else {
        // string[] fields (stuckHelpers, etc.)
        (result[field] as string[]) = (value as string[]).map((item) =>
          typeof item === "string" ? personalize(item, form) : item
        );
      }
    }
  }
  return result;
}

function loadIntroductions(): Map<string, ModuleIntroduction> {
  if (cachedIntroductions) return cachedIntroductions;

  const introMap = new Map<string, ModuleIntroduction>();
  const dir = getIntroductionsDir();

  if (!fs.existsSync(dir)) return introMap;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    const configKey = INTRO_FILE_MAP[file];
    if (!configKey) continue;

    introMap.set(configKey, {
      module: data.module as string,
      title: data.title as string,
      order: data.order as number,
      scientificBasis: data.scientific_basis as string[],
      content: marked.parse(content.trim()) as string,
    });
  }

  cachedIntroductions = introMap;
  return introMap;
}

function loadAllExercises(): Map<string, Exercise> {
  if (cachedExercises) return cachedExercises;

  const exerciseMap = new Map<string, Exercise>();
  const dir = getExercisesDir();

  if (!fs.existsSync(dir)) return exerciseMap;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".yaml"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), "utf-8");
    const exercise = parseExerciseYaml(content);
    exerciseMap.set(exercise.id, exercise);
  }

  cachedExercises = exerciseMap;
  return exerciseMap;
}

export function loadExercise(
  id: string,
  genderForm: GenderForm = "neutral"
): Exercise | null {
  const exercises = loadAllExercises();
  const exercise = exercises.get(id);
  if (!exercise) return null;
  return personalizeExercise(exercise, genderForm);
}

export function getGateExercise(
  genderForm: GenderForm = "neutral"
): Exercise | null {
  return loadExercise("gate_00", genderForm);
}

export function getModules(genderForm: GenderForm = "neutral"): Module[] {
  const cacheKey = genderForm;
  if (cachedModules.has(cacheKey)) return cachedModules.get(cacheKey)!;

  const exercises = loadAllExercises();
  const introductions = loadIntroductions();

  const moduleExercises: Record<string, Exercise[]> = {};

  for (const exercise of exercises.values()) {
    if (exercise.module === "Bramka") continue;

    const configKey =
      MODULE_NAME_MAP[exercise.module] || exercise.module;

    if (!moduleExercises[configKey]) {
      moduleExercises[configKey] = [];
    }
    moduleExercises[configKey].push(personalizeExercise(exercise, genderForm));
  }

  const modules: Module[] = Object.entries(MODULE_CONFIG).map(
    ([key, config]) => {
      const exs = moduleExercises[key] || [];
      // Sort by ID number (e.g., past_01 < past_02)
      exs.sort((a, b) => {
        const numA = parseInt(a.id.split("_")[1], 10);
        const numB = parseInt(b.id.split("_")[1], 10);
        return numA - numB;
      });

      const intro = introductions.get(key);
      const personalizedIntro = intro
        ? { ...intro, content: personalize(intro.content, genderForm) }
        : null;

      return {
        slug: config.slug,
        title: config.title,
        subtitle: config.subtitle,
        order: config.order,
        exercises: exs,
        introduction: personalizedIntro,
      };
    }
  );

  modules.sort((a, b) => a.order - b.order);
  cachedModules.set(cacheKey, modules);
  return modules;
}

export function getIntroExerciseId(moduleSlug: string): string {
  return `intro_${moduleSlug}`;
}

export function getAllExercises(
  genderForm: GenderForm = "neutral"
): Exercise[] {
  const exercises = loadAllExercises();
  return Array.from(exercises.values()).map((e) =>
    personalizeExercise(e, genderForm)
  );
}

export function getExerciseModuleInfo(
  exerciseId: string,
  genderForm: GenderForm = "neutral"
): { moduleLabel: string; moduleSlug: string; exerciseNumber: number } | null {
  if (exerciseId.startsWith("gate_")) return null;
  const modules = getModules(genderForm);
  for (const mod of modules) {
    const idx = mod.exercises.findIndex((e) => e.id === exerciseId);
    if (idx !== -1) {
      return {
        moduleLabel: `Moduł ${mod.order}`,
        moduleSlug: mod.slug,
        exerciseNumber: idx + 1,
      };
    }
  }
  return null;
}

export function getExercisesByModule(
  moduleSlug: string,
  genderForm: GenderForm = "neutral"
): Exercise[] {
  const modules = getModules(genderForm);
  const mod = modules.find((m) => m.slug === moduleSlug);
  return mod?.exercises || [];
}
