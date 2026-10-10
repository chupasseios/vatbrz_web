"use client";
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Icon from "@/components/Icon";
import { isTime, zonedNow } from "@/lib/date-time";
import PickerField, { type PickerProps } from "./PickerField";
import styles from "./Pickers.module.css";

export interface TimePickerProps extends PickerProps {
  zoneLabel?: string;
}
function TimeOptions({
  value,
  onChange,
  locale = "pt-BR",
  timeZone = "UTC",
  zoneLabel,
  close,
}: TimePickerProps & { close: () => void }) {
  const pt = locale.toLowerCase().startsWith("pt");
  const id = useId();
  const [draft, setDraft] = useState(
    isTime(value) ? value : zonedNow(timeZone).time,
  );
  const hourList = useRef<HTMLDivElement>(null);
  const minuteList = useRef<HTMLDivElement>(null);
  const [hour, minute] = draft.split(":");
  useLayoutEffect(() => {
    for (const list of [hourList.current, minuteList.current]) {
      const selected = list?.querySelector<HTMLElement>(
        '[aria-selected="true"]',
      );
      if (list && selected)
        list.scrollTop =
          selected.offsetTop -
          list.clientHeight / 2 +
          selected.offsetHeight / 2;
    }
  }, [hour, minute]);
  const update = (part: "hour" | "minute", next: string) =>
    setDraft(part === "hour" ? next + ":" + minute : hour + ":" + next);
  const move = (
    event: KeyboardEvent<HTMLDivElement>,
    part: "hour" | "minute",
  ) => {
    const length = part === "hour" ? 24 : 60;
    const current = Number(part === "hour" ? hour : minute);
    let next: number;
    switch (event.key) {
      case "ArrowDown":
        next = (current + 1) % length;
        break;
      case "ArrowUp":
        next = (current + length - 1) % length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = length - 1;
        break;
      case "PageDown":
        next = Math.min(length - 1, current + 5);
        break;
      case "PageUp":
        next = Math.max(0, current - 5);
        break;
      case "Enter":
        event.preventDefault();
        onChange(draft);
        close();
        return;
      default:
        return;
    }
    event.preventDefault();
    update(part, String(next).padStart(2, "0"));
  };
  const list = (part: "hour" | "minute") => {
    const selected = part === "hour" ? hour : minute;
    const prefix = id + "-" + part + "-";
    return (
      <div className={styles.timeColumn}>
        <span className={styles.columnLabel}>
          {part === "hour"
            ? pt
              ? "HORAS"
              : "HOURS"
            : pt
              ? "MINUTOS"
              : "MINUTES"}
        </span>
        <div
          ref={part === "hour" ? hourList : minuteList}
          role="listbox"
          aria-label={
            part === "hour"
              ? pt
                ? "Horas"
                : "Hours"
              : pt
                ? "Minutos"
                : "Minutes"
          }
          aria-activedescendant={prefix + selected}
          tabIndex={0}
          data-picker-autofocus={part === "hour" || undefined}
          className={styles.timeList}
          onKeyDown={(event) => move(event, part)}
        >
          {Array.from({ length: part === "hour" ? 24 : 60 }, (_, index) => {
            const option = String(index).padStart(2, "0");
            return (
              <div
                key={option}
                id={prefix + option}
                role="option"
                aria-selected={selected === option}
                className={styles.timeOption}
                onClick={() => {
                  update(part, option);
                  (part === "hour" ? hourList : minuteList).current?.focus({
                    preventScroll: true,
                  });
                }}
              >
                {option}
                {selected === option && <Icon name="check" size={14} />}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>
            {pt ? "SELECIONE O HORÁRIO" : "SELECT A TIME"}
          </span>
          <div className={styles.timePreview}>
            {draft}
            <span>{zoneLabel || timeZone}</span>
          </div>
        </div>
        <span className={styles.formatBadge}>24 H</span>
      </div>
      <div className={styles.timeColumns}>
        {list("hour")}
        {list("minute")}
      </div>
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.quietButton}
          onClick={() => {
            onChange("");
            close();
          }}
        >
          {pt ? "Limpar" : "Clear"}
        </button>
        <button
          type="button"
          className={styles.todayButton}
          onClick={() => setDraft(zonedNow(timeZone).time)}
        >
          <Icon name="clock" size={15} />
          {pt ? "Agora" : "Now"}
        </button>
      </div>
      <button
        type="button"
        className={styles.applyButton}
        onClick={() => {
          onChange(draft);
          close();
        }}
      >
        {pt ? "Aplicar horário" : "Apply time"}
        <Icon name="check" size={16} />
      </button>
    </>
  );
}
export default function TimePicker(props: TimePickerProps) {
  const { value, locale = "pt-BR", zoneLabel, timeZone = "UTC" } = props;
  return (
    <PickerField
      {...props}
      icon="clock"
      displayValue={
        isTime(value) ? value + " · " + (zoneLabel || timeZone) : ""
      }
      placeholder={props.placeholder || "--:--"}
      dialogLabel={props.label}
    >
      {(close) => <TimeOptions {...props} close={close} locale={locale} />}
    </PickerField>
  );
}
