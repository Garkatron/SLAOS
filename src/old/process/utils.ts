import { ProgramDiagnostic } from "./types"

export function fail(message: string): ProgramDiagnostic {
    return { message: message, type: "failure" }
}

export function success(message: string): ProgramDiagnostic {
    return { message: message, type: "success" }
}
