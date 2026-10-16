import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../styles/Popup.css";
import { PopupContext } from "./PopupContext";

const ICONS = {
    info: "ℹ️",
    success: "✅",
    error: "⚠️",
    primary: "❓",
    danger: "🗑️",
};

const getIconVariant = (popup) => {
    if (popup.kind === "confirm") {
        return popup.variant === "danger" ? "danger" : "primary";
    }

    return ICONS[popup.variant] ? popup.variant : "info";
};

export function PopupProvider({ children }) {
    const [popup, setPopup] = useState(null);
    const resolveRef = useRef(null);

    const showMessage = useCallback((message, options = {}) => {
        return new Promise((resolve) => {
            if (resolveRef.current) {
                resolveRef.current(null);
            }

            resolveRef.current = resolve;

            setPopup({
                kind: "message",
                title: options.title || "",
                message,
                variant: options.variant || "info",
            });
        });
    }, []);

    const showConfirm = useCallback((options = {}) => {
        return new Promise((resolve) => {
            if (resolveRef.current) {
                resolveRef.current(false);
            }

            resolveRef.current = resolve;

            setPopup({
                kind: "confirm",
                title: options.title || "Are you sure?",
                message: options.message || "",
                variant: options.variant === "danger" ? "danger" : "primary",
                confirmText: options.confirmText || "Confirm",
                cancelText: options.cancelText || "Cancel",
            });
        });
    }, []);

    const closePopup = useCallback((result) => {
        if (resolveRef.current) {
            resolveRef.current(result);
            resolveRef.current = null;
        }

        setPopup(null);
    }, []);

    useEffect(() => {
        if (!popup) {
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closePopup(popup.kind === "confirm" ? false : null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [popup, closePopup]);

    const value = useMemo(() => ({ showMessage, showConfirm }), [showMessage, showConfirm]);

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            closePopup(popup.kind === "confirm" ? false : null);
        }
    };

    const iconVariant = popup ? getIconVariant(popup) : "info";
    const isDanger = popup?.kind === "confirm" && popup.variant === "danger";

    return (
        <PopupContext.Provider value={value}>
            {children}

            {popup && (
                <div className="popup-overlay" onClick={handleOverlayClick}>
                    <div className="popup-card" role="dialog" aria-modal="true">
                        <div className={`popup-icon popup-icon-${iconVariant}`}>
                            {ICONS[iconVariant]}
                        </div>

                        {popup.title && <h3 className="popup-title">{popup.title}</h3>}

                        <p className="popup-message">{popup.message}</p>

                        <div className="popup-actions">
                            {popup.kind === "confirm" && (
                                <button
                                    type="button"
                                    className="popup-btn popup-btn-cancel"
                                    onClick={() => closePopup(false)}
                                    autoFocus={isDanger}
                                >
                                    {popup.cancelText}
                                </button>
                            )}

                            <button
                                type="button"
                                className={"popup-btn popup-btn-primary" + (isDanger ? " popup-btn-danger" : "")}
                                onClick={() => closePopup(popup.kind === "confirm")}
                                autoFocus={!isDanger}
                            >
                                {popup.kind === "confirm" ? popup.confirmText : "OK"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PopupContext.Provider>
    );
}
