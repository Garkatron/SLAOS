import { ProgramManager, ProcessManager, WindowManager } from "slaos";
import { ExampleApp } from "./apps/ExampleApp";
import "./style.css";

// ── Frame factory ─────────────────────────────────────────────────────
const windowsContainer = document.getElementById("app")!;
windowsContainer.style.position = "relative";

function frameFactory<P extends { title?: string; width: number; height: number }>(
    props: P,
) {
    const frame = document.createElement("div");
    frame.className = "slaos-window";
    frame.style.cssText = `
        position: absolute;
        width: ${props.width}px;
        height: ${props.height}px;
        background: #1e1e2e;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        color: #cdd6f4;
        font-family: system-ui, sans-serif;
    `;

    const titleBar = document.createElement("div");
    titleBar.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0.75rem;
        background: #181825;
        user-select: none;
    `;

    const titleEl = document.createElement("span");
    titleEl.textContent = props.title ?? "Window";

    const controls = document.createElement("div");
    controls.style.cssText = "display: flex; gap: 0.5rem;";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = buttonStyle("#f38ba8");

    const hiddenBtn = document.createElement("button");
    hiddenBtn.textContent = "─";
    hiddenBtn.style.cssText = buttonStyle("#fab387");

    const maximizeBtn = document.createElement("button");
    maximizeBtn.textContent = "☐";
    maximizeBtn.style.cssText = buttonStyle("#a6e3a1");

    controls.append(hiddenBtn, maximizeBtn, closeBtn);
    titleBar.append(titleEl, controls);
    frame.append(titleBar);

    const content = document.createElement("div");
    content.style.cssText = "flex: 1; overflow: auto;";
    frame.append(content);

    return {
        frame,
        getContent: () => content,
        ready: Promise.resolve({
            close: closeBtn,
            hidden: hiddenBtn,
            maximize: maximizeBtn,
        }),
    };
}

function buttonStyle(color: string): string {
    return `
        width: 14px; height: 14px;
        border-radius: 50%;
        border: none;
        background: ${color};
        cursor: pointer;
        font-size: 0;
        line-height: 14px;
    `;
}

// ── Bootstrap ────────────────────────────────────────────────────────
async function main() {
    // 1. Set up managers
    const pgm = new ProgramManager();
    const pcm = new ProcessManager(pgm);
    const wm = new WindowManager(windowsContainer, frameFactory);

    // 2. Register the ExampleApp program
    const programId = pgm.registerProgram({
        name: "ExampleApp",
        version: "1.0.0",
        factory: () => new ExampleApp(),
    });

    // 3. Spawn a window with an empty placeholder view
    const win = await wm.spawn({ view: () => {} }, {
        type: "example",
        title: "Example App",
        width: 400,
        height: 320,
    });

    win.setPosition(
        (windowsContainer.clientWidth - 400) / 2,
        (windowsContainer.clientHeight - 320) / 2,
    );
    windowsContainer.appendChild(win.frameElement);

    // 4. Spawn the process inside the window's content area
    const handle = await pcm.spawn(programId, win.contentElement);
    await handle.start();
}

main().catch(console.error);
