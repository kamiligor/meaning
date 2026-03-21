import { getModules } from "./exercises";
import type { GenderForm } from "./personalize";

export function getNextExerciseUrl(
  exerciseId: string,
  genderForm: GenderForm
): string | null {
  const modules = getModules(genderForm);

  // After gate → go to first module's intro (or first exercise if no intro)
  if (exerciseId === "gate_00") {
    const firstModule = modules[0];
    if (firstModule) {
      if (firstModule.introduction) {
        return `/program/modul/${firstModule.slug}`;
      }
      if (firstModule.exercises[0]) {
        return `/program/cwiczenie/${firstModule.exercises[0].id}`;
      }
    }
    return "/program/dashboard";
  }

  // Find current exercise in modules
  for (const mod of modules) {
    const idx = mod.exercises.findIndex((e) => e.id === exerciseId);
    if (idx === -1) continue;

    // Next exercise in same module
    if (idx < mod.exercises.length - 1) {
      return `/program/cwiczenie/${mod.exercises[idx + 1].id}`;
    }

    // Last exercise in module → go to next module's intro (or first exercise)
    const nextModIdx = modules.indexOf(mod) + 1;
    if (nextModIdx < modules.length) {
      const nextMod = modules[nextModIdx];
      if (nextMod.introduction) {
        return `/program/modul/${nextMod.slug}`;
      }
      if (nextMod.exercises[0]) {
        return `/program/cwiczenie/${nextMod.exercises[0].id}`;
      }
    }

    // End of program
    return "/program/dashboard";
  }

  return "/program/dashboard";
}
