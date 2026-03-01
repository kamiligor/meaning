import { describe, it, expect } from "vitest";
import {
  loadExercise,
  getGateExercise,
  getModules,
  getAllExercises,
} from "../exercises";

describe("exercises loader", () => {
  it("loads all 19 exercises", () => {
    const exercises = getAllExercises();
    expect(exercises.length).toBe(19);
  });

  it("loads gate exercise", () => {
    const gate = getGateExercise();
    expect(gate).not.toBeNull();
    expect(gate!.id).toBe("gate_00");
    expect(gate!.module).toBe("Bramka");
    expect(gate!.difficulty).toBe(1);
  });

  it("loads exercise by id", () => {
    const exercise = loadExercise("past_01");
    expect(exercise).not.toBeNull();
    expect(exercise!.title).toBeTruthy();
    expect(exercise!.module).toBeTruthy();
  });

  it("returns null for non-existent exercise", () => {
    const exercise = loadExercise("nonexistent_99");
    expect(exercise).toBeNull();
  });

  it("every exercise has required fields", () => {
    const exercises = getAllExercises();
    for (const exercise of exercises) {
      expect(exercise.id).toBeTruthy();
      expect(exercise.module).toBeTruthy();
      expect(exercise.title).toBeTruthy();
      expect(exercise.difficulty).toBeGreaterThanOrEqual(1);
      expect(exercise.difficulty).toBeLessThanOrEqual(5);
      expect(exercise.estimatedTime).toBeTruthy();
      expect(exercise.psychologicalBasis).toBeTruthy();
      expect(exercise.disclaimer).toBeTruthy();
      expect(exercise.introduction).toBeTruthy();
      expect(exercise.promptQuestions.length).toBeGreaterThan(0);
      expect(exercise.stuckHelpers.length).toBeGreaterThan(0);
      expect(exercise.reflectionPrompt).toBeTruthy();
      expect(exercise.whyItWorks).toBeTruthy();
    }
  });

  it("organizes exercises into 3 modules", () => {
    const modules = getModules();
    expect(modules.length).toBe(3);
  });

  it("each module has 6 exercises", () => {
    const modules = getModules();
    for (const mod of modules) {
      expect(mod.exercises.length).toBe(6);
    }
  });

  it("modules are ordered correctly", () => {
    const modules = getModules();
    expect(modules[0].slug).toBe("przeszlosc");
    expect(modules[1].slug).toBe("terazniejszosc");
    expect(modules[2].slug).toBe("przyszlosc");
  });

  it("exercises within modules are ordered by number", () => {
    const modules = getModules();
    for (const mod of modules) {
      for (let i = 1; i < mod.exercises.length; i++) {
        const prevNum = parseInt(mod.exercises[i - 1].id.split("_")[1], 10);
        const currNum = parseInt(mod.exercises[i].id.split("_")[1], 10);
        expect(currNum).toBeGreaterThan(prevNum);
      }
    }
  });

  it("modules have introductions", () => {
    const modules = getModules();
    for (const mod of modules) {
      expect(mod.introduction).not.toBeNull();
      expect(mod.introduction!.content).toBeTruthy();
      expect(mod.introduction!.scientificBasis.length).toBeGreaterThan(0);
    }
  });

  it("some exercises have content warnings", () => {
    const exercises = getAllExercises();
    const withWarnings = exercises.filter((e) => e.contentWarning);
    expect(withWarnings.length).toBeGreaterThan(0);
  });
});
