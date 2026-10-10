"use client";

import {
  useRef,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
} from "react";
import Link from "next/link";
import Icon from "./Icon";
import { t } from "@/lib/portal";
import {
  ATC_RATINGS,
  emptyReport,
  validateAtcReport,
  type AtcReport,
  type ReportErrors,
} from "@/lib/atc-report";
import styles from "./AtcReportForm.module.css";

const positions = [
  "SBSP_TWR",
  "SBGR_APP",
  "SBRJ_TWR",
  "SBGL_APP",
  "SBBS_CTR",
  "SBCW_CTR",
];

export default function AtcReportForm({ lang }: { lang: string }) {
  const [data, setData] = useState<AtcReport>({ ...emptyReport });
  const [errors, setErrors] = useState<ReportErrors>({});
  const [review, setReview] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [receivedAt, setReceivedAt] = useState<string | null>(null);
  const sendingRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const tr = (pt: string, en: string) => t(lang, pt, en);
  const ratingLabels = [
    tr("Excelente", "Excellent"),
    tr("Bom", "Good"),
    tr("Regular", "Fair"),
    tr("Ruim", "Poor"),
  ];
  const update = (key: keyof AtcReport, value: string) => {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };
  const focusPanel = () =>
    requestAnimationFrame(() => panelRef.current?.focus());
  const fillNow = () => {
    const now = new Date().toISOString();
    setData((current) => ({
      ...current,
      date: now.slice(0, 10),
      time: now.slice(11, 16),
    }));
    setErrors((current) => ({ ...current, date: undefined, time: undefined }));
  };
  const reviewReport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateAtcReport(data, lang);
    setErrors(result.errors);
    if (!result.valid) {
      const first = Object.keys(result.errors)[0];
      requestAnimationFrame(() =>
        document.getElementById("report-" + first)?.focus(),
      );
      return;
    }
    setData(result.data);
    setReview(true);
    focusPanel();
  };
  const sendReport = async () => {
    if (sendingRef.current || receivedAt) return;
    sendingRef.current = true;
    setSending(true);
    setSendError(false);
    try {
      const response = await fetch("/api/atc-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (
        !response.ok ||
        result.ok !== true ||
        typeof result.receivedAt !== "string" ||
        Number.isNaN(Date.parse(result.receivedAt))
      )
        throw new Error("unconfirmed");
      setReceivedAt(result.receivedAt);
      focusPanel();
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
      sendingRef.current = false;
    }
  };
  const field = (
    key: keyof AtcReport,
    label: string,
    options: InputHTMLAttributes<HTMLInputElement> = {},
    optional = false,
  ) => (
    <div className={styles.field}>
      <label htmlFor={"report-" + key}>
        {label}{" "}
        {optional ? (
          <span>{tr("(opcional)", "(optional)")}</span>
        ) : (
          <span aria-hidden="true">*</span>
        )}
      </label>
      <input
        {...options}
        id={"report-" + key}
        name={key}
        required={!optional}
        value={data[key]}
        onChange={(event) => update(key, event.target.value)}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? "error-" + key : undefined}
      />
      {errors[key] && (
        <p id={"error-" + key} className={styles.error}>
          {errors[key]}
        </p>
      )}
    </div>
  );
  const requiredFields: (keyof AtcReport)[] = [
    "cid",
    "name",
    "email",
    "position",
    "date",
    "time",
    "rating",
    "comments",
  ];
  const completed = requiredFields.filter((key) => data[key].trim()).length;
  const ratingIndex = ATC_RATINGS.findIndex((value) => value === data.rating);
  const observed =
    data.date && data.time
      ? `${data.date.split("-").reverse().join("/")} · ${data.time}Z`
      : "—";

  return (
    <>
      <Link
        href={"/" + lang + "/resources?category=atc"}
        className={styles.back}
      >
        ← {tr("Voltar aos recursos ATC", "Back to ATC resources")}
      </Link>
      <div className={styles.layout}>
        <div className={styles.panel} ref={panelRef} tabIndex={-1}>
          <div className={styles.panelHeader}>
            <div>
              <span className="eyebrow">
                {tr("FEEDBACK ATC", "ATC FEEDBACK")}
              </span>
              <h2>
                {receivedAt
                  ? tr("Reporte recebido", "Report received")
                  : review
                    ? tr("Confira seu reporte", "Review your report")
                    : tr("Conte como foi seu voo", "Tell us about your flight")}
              </h2>
            </div>
            <span className={styles.step}>
              {receivedAt ? (
                <Icon name="check" size={24} />
              ) : review ? (
                "02 / 02"
              ) : (
                "01 / 02"
              )}
              <small>
                {receivedAt
                  ? tr("Concluído", "Complete")
                  : review
                    ? tr("Revisão", "Review")
                    : tr("Preenchimento", "Details")}
              </small>
            </span>
          </div>
          {receivedAt ? (
            <section
              className={styles.review}
              aria-label={tr("Confirmação do envio", "Submission confirmation")}
            >
              <div className={styles.notice} role="status">
                <Icon name="check" size={24} />
                <p>
                  {tr(
                    "Seu feedback foi registrado e encaminhado à liderança responsável. Obrigado por contribuir com o treinamento ATC.",
                    "Your feedback has been recorded and forwarded to the responsible leadership. Thank you for helping improve ATC training.",
                  )}
                </p>
              </div>
              <dl className={styles.reviewGrid}>
                <div>
                  <dt>{tr("Posição avaliada", "Rated position")}</dt>
                  <dd>{data.position}</dd>
                </div>
                <div>
                  <dt>{tr("Avaliação", "Rating")}</dt>
                  <dd>{ratingLabels[ratingIndex]}</dd>
                </div>
                <div>
                  <dt>
                    {tr(
                      "Recebimento confirmado em UTC",
                      "Receipt confirmed at UTC",
                    )}
                  </dt>
                  <dd>
                    {new Date(receivedAt)
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " · ")}
                    Z
                  </dd>
                </div>
              </dl>
              <div className={styles.actions}>
                <Link
                  className="button"
                  href={"/" + lang + "/resources?category=atc"}
                >
                  {tr("Voltar aos recursos ATC", "Back to ATC resources")}
                  <Icon name="arrow" size={17} />
                </Link>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => {
                    setData({ ...emptyReport });
                    setErrors({});
                    setReview(false);
                    setReceivedAt(null);
                    setSendError(false);
                    focusPanel();
                  }}
                >
                  {tr("Criar outro reporte", "Create another report")}
                </button>
              </div>
            </section>
          ) : review ? (
            <section
              className={styles.review}
              aria-label={tr("Revisão do reporte", "Report review")}
            >
              <p className="muted">
                {tr(
                  "Verifique a posição, o horário e seus dados de contato antes do envio.",
                  "Check the position, time and your contact details before sending.",
                )}
              </p>
              <dl className={styles.reviewGrid}>
                {[
                  [tr("Seu nome", "Your name"), data.name],
                  ["CID VATSIM", data.cid],
                  [tr("E-mail", "Email"), data.email],
                  [tr("Posição ATC", "ATC position"), data.position],
                  [tr("Data e hora UTC", "UTC date and time"), observed],
                  [tr("Avaliação", "Rating"), ratingLabels[ratingIndex]],
                  [
                    tr("Controlador", "Controller"),
                    data.controllerName || tr("Não informado", "Not provided"),
                  ],
                  [
                    tr("CID do controlador", "Controller CID"),
                    data.controllerCid || tr("Não informada", "Not provided"),
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <h3>{tr("Seu relato", "Your comments")}</h3>
              <p className={styles.commentsPreview}>{data.comments}</p>
              <div className={styles.notice}>
                <Icon name="users" size={20} />
                <p>
                  {tr(
                    "Ao enviar, estas informações serão encaminhadas ao formulário oficial de feedback ATC da VATBRZ, hospedado no Google Forms.",
                    "Sending forwards these details to the official VATBRZ ATC feedback form, hosted on Google Forms.",
                  )}
                </p>
              </div>
              {sendError && (
                <div className={styles.notice} role="alert">
                  <Icon name="clock" size={20} />
                  <p>
                    {tr(
                      "Não foi possível confirmar o recebimento. Seus dados continuam aqui. Para evitar um reporte duplicado, confirme com a equipe antes de tentar novamente.",
                      "Receipt could not be confirmed. Your details are still here. To avoid a duplicate report, check with the team before trying again.",
                    )}{" "}
                    <Link
                      className={styles.supportLink}
                      href={"/" + lang + "/contact"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tr("Falar com a equipe", "Contact the team")}
                    </Link>
                  </p>
                </div>
              )}
              {sending && (
                <p className={styles.sendingStatus} role="status">
                  {tr(
                    "Enviando seu reporte. Aguarde a confirmação antes de sair desta página.",
                    "Sending your report. Please wait for confirmation before leaving this page.",
                  )}
                </p>
              )}
              <div className={styles.actions}>
                <button
                  type="button"
                  className="button button-secondary"
                  disabled={sending}
                  onClick={() => {
                    setReview(false);
                    focusPanel();
                  }}
                >
                  {tr("Editar informações", "Edit details")}
                </button>
                <button
                  type="button"
                  className="button"
                  disabled={sending}
                  onClick={sendReport}
                >
                  {sending
                    ? tr("Enviando…", "Sending…")
                    : tr("Enviar reporte ATC", "Send ATC report")}
                  <Icon name="arrow" size={17} />
                </button>
              </div>
            </section>
          ) : (
            <form onSubmit={reviewReport} noValidate>
              <p className={styles.requiredNote}>
                {tr(
                  "Campos com * são obrigatórios.",
                  "Fields marked * are required.",
                )}
              </p>
              {Object.values(errors).some(Boolean) && (
                <p className={styles.errorSummary} role="alert">
                  {tr(
                    "Confira os campos destacados para continuar.",
                    "Check the highlighted fields to continue.",
                  )}
                </p>
              )}
              <fieldset className={styles.section}>
                <legend>
                  <span className={styles.sectionNumber}>01</span>
                  {tr("Sua identificação", "Your details")}
                </legend>
                <p className={styles.sectionHint}>
                  {tr(
                    "Dados do membro que está enviando a avaliação.",
                    "Details of the member providing feedback.",
                  )}
                </p>
                <div className={styles.fields}>
                  {field("cid", tr("Sua CID VATSIM", "Your VATSIM CID"), {
                    inputMode: "numeric",
                    maxLength: 7,
                    placeholder: "1234567",
                    autoComplete: "off",
                  })}
                  {field("name", tr("Seu nome", "Your name"), {
                    autoComplete: "name",
                    maxLength: 120,
                    placeholder: tr("Nome e sobrenome", "First and last name"),
                  })}
                  <div className={styles.full}>
                    {field("email", tr("Seu e-mail", "Your email"), {
                      type: "email",
                      autoComplete: "email",
                      maxLength: 254,
                      placeholder: "voce@exemplo.com",
                    })}
                  </div>
                </div>
              </fieldset>
              <fieldset className={styles.section}>
                <legend>
                  <span className={styles.sectionNumber}>02</span>
                  {tr("O atendimento ATC", "The ATC service")}
                </legend>
                <p className={styles.sectionHint}>
                  {tr(
                    "Informe a posição que você deseja avaliar e quando ocorreu o atendimento.",
                    "Enter the position you want to rate and when the service took place.",
                  )}
                </p>
                {field(
                  "position",
                  tr("Posição de controle", "Control position"),
                  {
                    maxLength: 40,
                    autoComplete: "off",
                    placeholder: "SBSP_TWR",
                    className: styles.callsign,
                  },
                )}
                <div
                  className={styles.chips}
                  aria-label={tr("Posições frequentes", "Common positions")}
                >
                  {positions.map((position) => (
                    <button
                      type="button"
                      key={position}
                      aria-pressed={data.position.toUpperCase() === position}
                      onClick={() => update("position", position)}
                    >
                      {position}
                    </button>
                  ))}
                </div>
                <div className={styles.fields}>
                  {field(
                    "controllerName",
                    tr("Nome do controlador", "Controller name"),
                    { maxLength: 120, autoComplete: "off" },
                    true,
                  )}
                  {field(
                    "controllerCid",
                    tr("CID do controlador", "Controller CID"),
                    { maxLength: 7, inputMode: "numeric", autoComplete: "off" },
                    true,
                  )}
                </div>
                <div className={styles.timeBlock}>
                  <div className={styles.timeHeader}>
                    <span>
                      <Icon name="clock" size={16} />
                      {tr(
                        "Referência de horário: UTC / Zulu",
                        "Time reference: UTC / Zulu",
                      )}
                    </span>
                    <button type="button" onClick={fillNow}>
                      {tr(
                        "Usar data e hora atuais",
                        "Use current date and time",
                      )}
                    </button>
                  </div>
                  <div className={styles.fields}>
                    {field(
                      "date",
                      tr("Data da observação (UTC)", "Observation date (UTC)"),
                      { type: "date" },
                    )}
                    {field(
                      "time",
                      tr("Hora da observação (UTC)", "Observation time (UTC)"),
                      { type: "time", step: 60 },
                    )}
                  </div>
                  <p className={styles.sectionHint}>
                    {tr(
                      "Brasília + 3 horas = UTC. Ao passar de 23:59, avance também a data.",
                      "Brasília + 3 hours = UTC. After 23:59, advance the date as well.",
                    )}
                  </p>
                </div>
              </fieldset>
              <fieldset className={styles.section}>
                <legend>
                  <span className={styles.sectionNumber}>03</span>
                  {tr("Sua avaliação", "Your feedback")}
                </legend>
                <p className={styles.sectionHint}>
                  {tr(
                    "Como você avalia o serviço recebido?",
                    "How would you rate the service?",
                  )}{" "}
                  *
                </p>
                <div className={styles.ratings}>
                  {ATC_RATINGS.map((rating, index) => (
                    <label className={styles.rating} key={rating}>
                      <input
                        type="radio"
                        name="rating"
                        id={index === 0 ? "report-rating" : undefined}
                        value={rating}
                        required
                        checked={data.rating === rating}
                        onChange={() => update("rating", rating)}
                        aria-describedby={
                          errors.rating ? "error-rating" : undefined
                        }
                      />
                      <span>
                        <span className={styles.ratingStars} aria-hidden="true">
                          {Array.from({ length: 4 - index }, (_, i) => (
                            <Icon name="star" size={14} key={i} />
                          ))}
                        </span>
                        <strong>{ratingLabels[index]}</strong>
                      </span>
                    </label>
                  ))}
                </div>
                {errors.rating && (
                  <p id="error-rating" className={styles.error}>
                    {errors.rating}
                  </p>
                )}
                <div className={styles.field}>
                  <label htmlFor="report-comments">
                    {tr("Conte sua experiência", "Describe your experience")}{" "}
                    <span aria-hidden="true">*</span>
                  </label>
                  <p id="comments-hint" className={styles.sectionHint}>
                    {tr(
                      "Descreva o contexto, os pontos positivos e o que poderia melhorar. Inclua seu indicativo de voo se ajudar a identificar o atendimento.",
                      "Describe the context, what went well and what could improve. Include your flight callsign if it helps identify the service.",
                    )}
                  </p>
                  <textarea
                    id="report-comments"
                    name="comments"
                    rows={6}
                    required
                    maxLength={5000}
                    value={data.comments}
                    onChange={(event) => update("comments", event.target.value)}
                    aria-invalid={Boolean(errors.comments)}
                    aria-describedby={
                      "comments-hint" +
                      (errors.comments ? " error-comments" : "")
                    }
                    placeholder={tr(
                      "Durante a aproximação...",
                      "During the approach...",
                    )}
                  />
                  <span className={styles.counter}>
                    {data.comments.length} / 5.000
                  </span>
                  {errors.comments && (
                    <p id="error-comments" className={styles.error}>
                      {errors.comments}
                    </p>
                  )}
                </div>
              </fieldset>
              <div className={styles.formFooter}>
                <p>
                  {tr(
                    "Você poderá conferir todas as informações na próxima etapa.",
                    "You can review all the details in the next step.",
                  )}
                </p>
                <button type="submit" className="button">
                  {tr("Revisar reporte", "Review report")}
                  <Icon name="arrow" size={17} />
                </button>
              </div>
            </form>
          )}
        </div>
        <aside className={styles.sidebar}>
          <div className={styles.strip}>
            <div className={styles.stripHeader}>
              <Icon name="tower" size={20} />
              <span>VATBRZ / ATC</span>
              <span className={styles.draft}>
                {receivedAt
                  ? tr("RECEBIDO", "RECEIVED")
                  : tr("RASCUNHO", "DRAFT")}
              </span>
            </div>
            <span className={styles.stripLabel}>
              {tr("POSIÇÃO AVALIADA", "POSITION UNDER REVIEW")}
            </span>
            <strong className={styles.position}>
              {data.position.toUpperCase() || "––––_–––"}
            </strong>
            <div className={styles.stripDetail}>
              <span>{tr("OBSERVAÇÃO", "OBSERVATION")}</span>
              <strong>{observed}</strong>
            </div>
            <div className={styles.stripDetail}>
              <span>{tr("AVALIAÇÃO", "RATING")}</span>
              <strong>
                {ratingIndex >= 0
                  ? ratingLabels[ratingIndex]
                  : tr("A selecionar", "Not selected")}
              </strong>
            </div>
            <div className={styles.progressText}>
              <span>{tr("Preenchimento", "Completion")}</span>
              <span>{completed} / 8</span>
            </div>
            <progress
              className={styles.progress}
              max={8}
              value={completed}
              aria-label={tr(
                "Campos obrigatórios preenchidos",
                "Required fields completed",
              )}
            />
          </div>
          <div className={styles.guidance}>
            <span className="eyebrow">
              {tr("UM BOM REPORTE", "A USEFUL REPORT")}
            </span>
            <h3>
              {tr("Contexto ajuda a evoluir.", "Context helps us improve.")}
            </h3>
            <ul>
              <li>
                {tr(
                  "Identifique a posição e o horário com atenção.",
                  "Check the position and time carefully.",
                )}
              </li>
              <li>
                {tr(
                  "Relate os fatos com clareza e respeito.",
                  "Describe the facts clearly and respectfully.",
                )}
              </li>
              <li>
                {tr(
                  "Reconheça também as boas experiências.",
                  "Share positive experiences too.",
                )}
              </li>
            </ul>
            <div className={styles.privacy}>
              <Icon name="users" size={20} />
              <p>
                {tr(
                  "Seu relato será destinado à equipe responsável pelo treinamento ATC. Seus dados não ficam salvos neste navegador ao sair da página.",
                  "Your report is intended for the ATC training team. Your details are not saved in this browser when you leave the page.",
                )}
              </p>
            </div>
            <Link href={"/" + lang + "/contact"}>
              {tr("Precisa falar com a equipe?", "Need to contact the team?")}{" "}
              <Icon name="arrow" size={15} />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
