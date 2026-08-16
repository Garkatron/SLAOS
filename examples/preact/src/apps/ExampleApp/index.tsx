import { render } from "preact";
import { Program, Task, DispatchFn } from "slaos";

interface ExampleMessage {
    kind: "increment" | "decrement";
}

export class ExampleApp extends Program<ExampleMessage> {
    private count = 0;

    async init(
        dispatch: DispatchFn<ExampleMessage>,
    ): Promise<Task<ExampleMessage> | undefined> {
        this.count = 0;
        return;
    }

    async update(
        message: ExampleMessage,
    ): Promise<Task<ExampleMessage> | undefined> {
        switch (message.kind) {
            case "increment":
                this.count++;
                break;
            case "decrement":
                this.count--;
                break;
        }
        return;
    }

    view(root: HTMLElement, dispatch: DispatchFn<ExampleMessage>): void {
        render(
            <div style="padding: 1.5rem; text-align: center; font-family: system-ui, sans-serif;">
                <h1 style="font-size: 2.5rem; margin: 0 0 0.5rem; color: #cdd6f4;">
                    SLAOS
                </h1>
                <p style="color: #a6adc8; margin: 0 0 1.5rem;">Example App</p>
                <div
                    style="font-size: 3rem; font-weight: bold; margin-bottom: 1rem; color: #cdd6f4;"
                >
                    {this.count}
                </div>
                <div style="display: flex; gap: 0.5rem; justify-content: center;">
                    <button
                        onClick={() => dispatch({ kind: "decrement" })}
                        style={btnStyle}
                    >
                        −
                    </button>
                    <button
                        onClick={() => dispatch({ kind: "increment" })}
                        style={btnStyle}
                    >
                        +
                    </button>
                </div>
            </div>,
            root,
        );
    }
}

const btnStyle = {
    padding: "0.5rem 1.25rem",
    fontSize: "1.25rem",
    cursor: "pointer",
    border: "none",
    borderRadius: "6px",
    background: "#45475a",
    color: "#cdd6f4",
    minWidth: "48px",
};
