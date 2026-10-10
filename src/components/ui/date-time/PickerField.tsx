"use client";

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import Icon, { type IconName } from "@/components/Icon";
import styles from "./Pickers.module.css";

export interface PickerProps {
  id?: string;
  name?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  locale?: string;
  timeZone?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  placeholder?: string;
  className?: string;
}

function Popover({
  triggerRef,
  label,
  id,
  close,
  children,
}: {
  triggerRef: RefObject<HTMLButtonElement | null>;
  label: string;
  id: string;
  close: (restoreFocus?: boolean) => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Keep listeners stable while the calendar or clock changes its local state.
  const closeRef = useRef(close);
  useLayoutEffect(() => {
    closeRef.current = close;
  }, [close]);
  useLayoutEffect(() => {
    const panel = ref.current;
    const trigger = triggerRef.current;
    if (!panel || !trigger) return;
    const place = () => {
      const margin = 12;
      const anchor = trigger.getBoundingClientRect();
      panel.style.width = Math.min(328, window.innerWidth - margin * 2) + "px";
      panel.style.maxHeight =
        Math.max(120, window.innerHeight - margin * 2) + "px";
      const height = panel.getBoundingClientRect().height;
      const below = window.innerHeight - anchor.bottom - 8 - margin;
      const above = anchor.top - 8 - margin;
      const top =
        below >= height || below >= above
          ? anchor.bottom + 8
          : anchor.top - height - 8;
      panel.style.left =
        Math.max(
          margin,
          Math.min(anchor.left, window.innerWidth - panel.offsetWidth - margin),
        ) + "px";
      panel.style.top =
        Math.max(margin, Math.min(top, window.innerHeight - height - margin)) +
        "px";
      panel.style.visibility = "visible";
    };
    const outside = (event: Event) => {
      const target = event.target as Node;
      if (!panel.contains(target) && !trigger.contains(target))
        closeRef.current(false);
    };
    place();
    const initial = panel.querySelector<HTMLElement>("[data-picker-autofocus]");
    initial?.focus({ preventScroll: true });
    initial?.scrollIntoView({ block: "nearest" });
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [triggerRef]);
  return createPortal(
    <div
      ref={ref}
      id={id}
      role="dialog"
      aria-label={label}
      className={styles.popover}
      style={{ visibility: "hidden" }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          close(true);
        }
        if (event.key === "Tab") {
          const focusable = Array.from(
            ref.current?.querySelectorAll<HTMLElement>(
              'button:not(:disabled):not([tabindex="-1"]), [tabindex="0"]',
            ) || [],
          );
          const first = focusable[0],
            last = focusable[focusable.length - 1];
          if (
            (event.shiftKey && document.activeElement === first) ||
            (!event.shiftKey && document.activeElement === last)
          ) {
            // A non-modal popover: continue tabbing from its trigger in document order.
            triggerRef.current?.focus({ preventScroll: true });
            close(false);
          }
        }
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

export default function PickerField({
  id,
  name,
  label,
  value,
  displayValue,
  icon,
  required,
  disabled,
  error,
  description,
  placeholder,
  className,
  dialogLabel,
  children,
}: PickerProps & {
  displayValue: string;
  icon: IconName;
  dialogLabel: string;
  children: (close: () => void) => ReactNode;
}) {
  const generatedId = useId();
  const inputId = id || "picker-" + generatedId;
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus)
      document.getElementById(inputId)?.focus({ preventScroll: true });
  };
  const describedBy =
    [description && inputId + "-description", error && inputId + "-error"]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <label htmlFor={inputId}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {description && (
        <p id={inputId + "-description"} className={styles.description}>
          {description}
        </p>
      )}
      <button
        ref={trigger}
        id={inputId}
        type="button"
        role="combobox"
        className={styles.trigger}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? inputId + "-popover" : undefined}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className={!displayValue ? styles.placeholder : undefined}>
          {displayValue || placeholder}
        </span>
        <Icon name={icon} size={18} />
      </button>
      {name && (
        <input type="hidden" name={name} value={value} disabled={disabled} />
      )}
      {error && (
        <p className={styles.error} id={inputId + "-error"}>
          {error}
        </p>
      )}
      {open && !disabled && (
        <Popover
          id={inputId + "-popover"}
          label={dialogLabel}
          triggerRef={trigger}
          close={close}
        >
          {children(() => close(true))}
        </Popover>
      )}
    </div>
  );
}
