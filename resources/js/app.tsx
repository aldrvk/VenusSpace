import "./Bootstrap";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import type React from "react";
import { Toaster } from "react-hot-toast";

createInertiaApp({
    resolve: (name: string) => {
        const pages = import.meta.glob<{ default: React.ComponentType }>(
            "./Pages/**/*.tsx",
            { eager: true },
        );
        return pages[`./Pages/${name}.tsx`]!;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <>
                <Toaster 
                    position="top-center" 
                    toastOptions={{
                        duration: 4000,
                        style: { borderRadius: '10px', background: '#333', color: '#fff' },
                        success: {
                            iconTheme: { primary: '#3cdbc0', secondary: '#fff' },
                        }
                    }}
                />
                <App {...props} />
            </>
        );
    },
});
