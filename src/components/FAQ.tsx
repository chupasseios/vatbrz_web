"use client";

import { useState } from 'react';
import styles from './FAQ.module.css';

export default function FAQ({ dict }: { dict: any }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: dict.q1, a: dict.a1 },
    { q: dict.q2, a: dict.a2 },
    { q: dict.q3, a: dict.a3 },
  ];

  return (
    <section className={styles.faqSection} id="faq">
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>{dict.eyebrow}</span>
        <h2 className={styles.title}>
          <span>{dict.title1}</span>
          <span>{dict.title2}</span>
        </h2>
        <p className={styles.subtitle}>{dict.subtitle}</p>
      </div>

      <div className={styles.content}>
        <aside className={styles.intro}>
          <span className={styles.introTag}>{dict.categoryGeneral}</span>
          <h3>{dict.introTitle}</h3>
          <p>{dict.introText}</p>
          <div className={styles.questionCount}>
            <strong>{faqs.length}</strong>
            <span>{dict.answerCount}</span>
          </div>
        </aside>
        <div className={styles.mainArea}>
          <div className={styles.categoryTitle}>{dict.taggedAs}</div>
          <div className={styles.questionsList}>
            {faqs.map((faq, i) => (
              <div key={i} className={`${styles.questionItem} ${openIndex === i ? styles.questionItemOpen : ''}`}>
                <button
                  type="button"
                  className={styles.questionHeader}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span>{faq.q}</span>
                  <span aria-hidden="true" className={`${styles.questionIcon} ${openIndex === i ? styles.questionIconOpen : ''}`}>+</span>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  className={`${styles.answer} ${openIndex === i ? styles.answerOpen : ''}`}
                  aria-hidden={openIndex !== i}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
