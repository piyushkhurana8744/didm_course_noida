"use client";

import * as React from "react";
import { ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";

// Explicit global typescript declaration for Cloudflare Turnstile
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: (error?: any) => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
          tabindex?: number;
          action?: string;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"; // Fallback to Cloudflare Turnstile dummy testing key (Always passes)

export interface TurnstileCaptchaRef {
  reset: () => void;
}

interface TurnstileCaptchaProps {
  onChange: (token: string | null) => void;
  id?: string;
  error?: string;
  size?: "default" | "sm";
  variant?: "default" | "clean";
  widgetSize?: "normal" | "compact" | "flexible";
}

export const resetTurnstileCaptcha = (ref: React.RefObject<TurnstileCaptchaRef | null>) => {
  ref.current?.reset();
};

export const TurnstileCaptcha = React.forwardRef<TurnstileCaptchaRef, TurnstileCaptchaProps>(
  ({ onChange, id, error, size = "sm", variant = "default", widgetSize = "flexible" }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const widgetId = React.useRef<string | null>(null);
    const [status, setStatus] = React.useState<"loading" | "ready" | "verified" | "expired" | "error">("loading");

    // Capture onChange in a ref to prevent re-running effect when the callback reference updates
    const onChangeRef = React.useRef(onChange);
    React.useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    const initTurnstile = React.useCallback(() => {
      if (!containerRef.current || !window.turnstile) return;

      try {
        // Clear previous widget if it exists
        if (widgetId.current) {
          window.turnstile.remove(widgetId.current);
          widgetId.current = null;
        }

        const id = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme: "light",
          size: widgetSize,
          callback: (token) => {
            setStatus("verified");
            onChangeRef.current(token);
          },
          "expired-callback": () => {
            setStatus("expired");
            onChangeRef.current(null);
          },
          "error-callback": (err) => {
            console.error("Turnstile widget error callback:", err);
            setStatus("error");
            onChangeRef.current(null);
          },
        });

        widgetId.current = id;
        setStatus("ready");
      } catch (err) {
        console.error("Failed to render Turnstile widget:", err);
        setStatus("error");
        onChangeRef.current(null);
      }
    }, [size, widgetSize]);

    // Handle resetting Turnstile externally via a Ref
    React.useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetId.current && window.turnstile) {
          try {
            window.turnstile.reset(widgetId.current);
            setStatus("ready");
            onChangeRef.current(null);
          } catch (e) {
            console.error("Failed to reset Turnstile widget:", e);
            initTurnstile(); // fallback to re-init
          }
        } else {
          initTurnstile();
        }
      },
    }));

    React.useEffect(() => {
      // Prevent running on server side
      if (typeof window === "undefined") return;

      const scriptId = "cloudflare-turnstile-script";

      const handleScriptLoad = () => {
        // Poll briefly if script is loaded but turnstile is not yet attached to window
        const checkInterval = setInterval(() => {
          if (window.turnstile) {
            clearInterval(checkInterval);
            initTurnstile();
          }
        }, 50);

        // Safety timeout
        setTimeout(() => clearInterval(checkInterval), 2000);
      };

      if (window.turnstile) {
        initTurnstile();
      } else {
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        if (!script) {
          script = document.createElement("script");
          script.id = scriptId;
          script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
          script.async = true;
          script.defer = true;
          document.body.appendChild(script);
        }

        script.addEventListener("load", handleScriptLoad);

        return () => {
          script.removeEventListener("load", handleScriptLoad);
        };
      }

      return () => {
        if (widgetId.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetId.current);
          } catch (e) {
            // Ignore during unmount
          }
        }
      };
    }, [initTurnstile]);

    const isSm = size === "sm";

    if (variant === "clean") {
      return (
        <div 
          id={id}
          className={`w-full block relative transition-all duration-300 ${error ? "mb-4" : "mb-0.5"}`}
        >
          <div 
            ref={containerRef} 
            className={`mx-auto block ${error ? "ring-2 ring-red-500/20 rounded-lg" : ""}`} 
            style={{ 
              minHeight: "65px",
              width: widgetSize === "normal" ? "300px" : "100%",
              minWidth: widgetSize === "normal" ? "300px" : "100%",
            }} 
          />

          {error && (
            <span className="text-red-500 font-semibold pl-1 text-[10px] absolute -bottom-4 left-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 inline" />
              {error}
            </span>
          )}
        </div>
      );
    }

    return (
      <div 
        id={id}
        className={`flex flex-col text-left w-full bg-zinc-50 border border-zinc-200 shadow-xs transition-all duration-300 ${
          isSm ? "p-2.5 my-1.5 rounded-lg" : "p-3 my-2 rounded-xl"
        } ${
          error ? "border-red-400 bg-red-50/10" : ""
        }`}
      >
        <div className={`flex items-center justify-between gap-3 ${isSm ? "mb-1.5" : "mb-2.5"}`}>
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center shrink-0 p-1.5 rounded-lg border transition-colors ${
              status === "verified" 
                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                : status === "error" 
                ? "bg-red-50 text-red-600 border-red-100" 
                : "bg-zinc-100 text-zinc-650 border-zinc-200"
            }`}>
              {status === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider leading-none">
                Spam Protection
              </span>
              <span className={`font-bold text-zinc-800 tracking-tight mt-1 leading-none ${isSm ? "text-xs" : "text-[13px]"}`}>
                {status === "loading" && "Loading verification..."}
                {status === "ready" && "Please verify you are human"}
                {status === "verified" && "Verification successful"}
                {status === "expired" && "Verification expired"}
                {status === "error" && "Verification failed"}
              </span>
            </div>
          </div>

          {(status === "expired" || status === "error") && (
            <button
              type="button"
              onClick={() => {
                if (widgetId.current && window.turnstile) {
                  window.turnstile.reset(widgetId.current);
                  setStatus("ready");
                } else {
                  initTurnstile();
                }
              }}
              title="Refresh CAPTCHA"
              className="text-zinc-400 hover:text-brand-red hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50 p-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Turnstile target container wrapper to handle layout */}
        <div className={`flex items-center justify-center w-full transition-opacity duration-300 ${
          isSm ? "min-h-[140px]" : "min-h-[65px]"
        } ${
          status === "loading" ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}>
          <div 
            ref={containerRef} 
            className="mx-auto" 
            style={{ 
              minWidth: isSm ? "150px" : "300px", 
              minHeight: isSm ? "140px" : "65px" 
            }} 
          />
        </div>

        {error && (
          <span className="text-red-500 font-semibold pl-1 text-xs mt-1.5 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 inline" />
            {error}
          </span>
        )}
      </div>
    );
  }
);

TurnstileCaptcha.displayName = "TurnstileCaptcha";
