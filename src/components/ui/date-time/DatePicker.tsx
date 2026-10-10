"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import Icon from "@/components/Icon";
import {
  addDays,
  addMonths,
  calendarDays,
  clampDate,
  parseDate,
  zonedNow,
} from "@/lib/date-time";
import PickerField, { type PickerProps } from "./PickerField";
import styles from "./Pickers.module.css";

export interface DatePickerProps extends PickerProps {
  min?: string;
  max?: string;
  weekStartsOn?: 0 | 1;
}

function Calendar({
  value,
  onChange,
  locale = "pt-BR",
  timeZone = "UTC",
  min,
  max,
  weekStartsOn = 0,
  close,
}: DatePickerProps & { close: () => void }) {
  const pt = locale.toLowerCase().startsWith("pt");
  const today = zonedNow(timeZone).date;
  const initial = clampDate(parseDate(value) ? value : today, min, max);
  const [focused, setFocused] = useState(initial);
  const [month, setMonth] = useState(initial.slice(0, 7));
  const grid = useRef<HTMLDivElement>(null);
  const requestedFocus = useRef(false);
  const disabled = (date: string) =>
    !date || Boolean((min && date < min) || (max && date > max));
  const days = calendarDays(month, weekStartsOn);
  const monthTitle = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseDate(month + "-01")!);
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" })
      .format(parseDate(addDays("2024-01-07", i + weekStartsOn))!)
      .replace(".", ""),
  );
  useLayoutEffect(() => {
    if (requestedFocus.current) {
      grid.current
        ?.querySelector<HTMLButtonElement>(`[data-day="${focused}"]`)
        ?.focus({ preventScroll: true });
      requestedFocus.current = false;
    }
  }, [focused, month]);
  const navigate = (next: string, moveFocus: boolean) => {
    next = clampDate(next, min, max);
    requestedFocus.current = moveFocus;
    setFocused(next);
    setMonth(next.slice(0, 7));
  };
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>, date: string) => {
    let next: string;
    const day = parseDate(date)!.getUTCDay();
    switch (event.key) {
      case "ArrowLeft":
        next = addDays(date, -1);
        break;
      case "ArrowRight":
        next = addDays(date, 1);
        break;
      case "ArrowUp":
        next = addDays(date, -7);
        break;
      case "ArrowDown":
        next = addDays(date, 7);
        break;
      case "Home":
        next = addDays(date, -((day - weekStartsOn + 7) % 7));
        break;
      case "End":
        next = addDays(date, 6 - ((day - weekStartsOn + 7) % 7));
        break;
      case "PageUp":
        next = addMonths(date, event.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        next = addMonths(date, event.shiftKey ? 12 : 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    navigate(next, true);
  };
  const select = (date: string) => {
    onChange(date);
    close();
  };
  return (
    <>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>
            {pt ? "SELECIONE A DATA" : "SELECT A DATE"}
          </span>
          <h3 className={styles.month} aria-live="polite">
            {monthTitle}
          </h3>
        </div>
        <div className={styles.monthNav}>
          <button
            type="button"
            aria-label={pt ? "Mês anterior" : "Previous month"}
            disabled={
              month === "0001-01" || Boolean(min && month <= min.slice(0, 7))
            }
            onClick={() => navigate(addMonths(focused, -1), false)}
          >
            <Icon name="chevron" size={17} className={styles.previous} />
          </button>
          <button
            type="button"
            aria-label={pt ? "Próximo mês" : "Next month"}
            disabled={
              month === "9999-12" || Boolean(max && month >= max.slice(0, 7))
            }
            onClick={() => navigate(addMonths(focused, 1), false)}
          >
            <Icon name="chevron" size={17} />
          </button>
        </div>
      </div>
      <div
        className={styles.calendar}
        role="grid"
        aria-label={monthTitle}
        ref={grid}
      >
        <div className={styles.week} role="row">
          {weekdays.map((day, index) => (
            <span key={index} role="columnheader" className={styles.weekday}>
              {day}
            </span>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, row) => (
          <div role="row" className={styles.week} key={row}>
            {days.slice(row * 7, row * 7 + 7).map((date, column) => (
              <div
                role="gridcell"
                aria-selected={date === value}
                key={date || column}
              >
                {date && (
                  <button
                    type="button"
                    data-day={date}
                    data-picker-autofocus={date === initial || undefined}
                    tabIndex={date === focused ? 0 : -1}
                    disabled={disabled(date)}
                    aria-label={new Intl.DateTimeFormat(locale, {
                      dateStyle: "full",
                      timeZone: "UTC",
                    }).format(parseDate(date)!)}
                    aria-current={date === today ? "date" : undefined}
                    className={[
                      styles.day,
                      date.slice(0, 7) !== month ? styles.otherMonth : "",
                      date === value ? styles.selected : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onFocus={() => setFocused(date)}
                    onClick={() => select(date)}
                    onKeyDown={(event) => keyDown(event, date)}
                  >
                    {Number(date.slice(-2))}
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.quietButton}
          onClick={() => select("")}
        >
          {pt ? "Limpar" : "Clear"}
        </button>
        <button
          type="button"
          className={styles.todayButton}
          disabled={disabled(today)}
          onClick={() => select(today)}
        >
          <Icon name="calendar" size={15} />
          {pt ? "Hoje" : "Today"}
        </button>
      </div>
    </>
  );
}

export default function DatePicker(props: DatePickerProps) {
  const { value, locale = "pt-BR" } = props;
  const parsed = parseDate(value);
  const displayValue = parsed
    ? new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      }).format(parsed)
    : "";
  return (
    <PickerField
      {...props}
      icon="calendar"
      displayValue={displayValue}
      placeholder={
        props.placeholder ||
        (locale.toLowerCase().startsWith("pt")
          ? "Selecione a data"
          : "Select a date")
      }
      dialogLabel={props.label}
    >
      {(close) => <Calendar {...props} close={close} />}
    </PickerField>
  );
}
