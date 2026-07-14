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
      <h2 className={styles.title}>
        {dict.title1}<br />{dict.title2}
      </h2>
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={`${styles.category} ${styles.activeCategory}`}>{dict.categoryGeneral}</div>
          <div className={styles.category}>{dict.categoryPrivacy}</div>
          <div className={styles.category}>{dict.categoryAccounts}</div>
          <div className={styles.category}>{dict.categoryDonations}</div>
        </div>
        <div className={styles.mainArea}>
          <div className={styles.categoryTitle}>{dict.taggedAs}</div>
          <div className={styles.questionsList}>
            {faqs.map((faq, i) => (
              <div key={i} className={styles.questionItem}>
                <div 
                  className={styles.questionHeader}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className={`${styles.questionIcon} ${openIndex === i ? styles.questionIconOpen : ''}`}>+</span>
                </div>
                <div className={`${styles.answer} ${openIndex === i ? styles.answerOpen : ''}`}>
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
