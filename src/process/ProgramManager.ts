import { Program } from "./Program";
import { ProgramID, ProgramDefinition } from "./types";

export class ProgramManager {
    private readonly programs = new Map<ProgramID, ProgramDefinition>();

    registerProgram(def: ProgramDefinition): ProgramID {
        const id = this.generateId();
        this.programs.set(id, def);
        return id;
    }

    getProgramById(id: ProgramID): ProgramDefinition {
        const program = this.programs.get(id);
        if (!program) {
            throw new Error(`Program not found: ${id}`);
        }
        return program;
    }

    hasProgram(id: ProgramID): boolean {
        return this.programs.has(id);
    }

    unregisterProgram(id: ProgramID): boolean {
        return this.programs.delete(id);
    }

    getProgramsCopy(): ReadonlyMap<ProgramID, ProgramDefinition> {
        return new Map(this.programs);
    }

    private generateId(): ProgramID {
        const part = () => crypto.randomUUID().replace(/-/g, "").slice(0, 4);
        return `${part()}-${part()}` as ProgramID;
    }
}
