import { useEffect } from "react";

export default function useUnloadWarning(conditional: boolean = true) {

    useEffect(() => {
        if (!conditional) return;

        const listener = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        }

        window.addEventListener("beforeunload", listener);

        return () => {
            window.removeEventListener("beforeunload", listener);
        }
    }, [conditional]);

}