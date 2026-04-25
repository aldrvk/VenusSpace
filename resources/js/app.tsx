import "./Bootstrap";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import type React from "react";

createInertiaApp({
    resolve: (name: string) => {
        const pages = import.meta.glob<{ default: React.ComponentType }>(
            "./Pages/**/*.tsx",
            { eager: true },
        );
        return pages[`./Pages/${name}.tsx`]!;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
