

interface Decrement { kind: "decrement", value: number };
interface Increment { kind: "increment", value: number };
type MyMessage = Increment | Decrement;
