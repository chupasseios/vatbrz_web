'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Staff.module.css';
import { StaffDepartment, StaffMember } from '@/services/staff';

interface StaffClientProps {
  dict: any;
  staffData: StaffDepartment[];
}

export default function StaffClient({ dict, staffData }: StaffClientProps) {
  const [activeTab, setActiveTab] = useState(staffData[0]?.id || '');
  const activeDepartment = staffData.find((department) => department.id === activeTab);

  const countDepartmentMembers = (department: StaffDepartment) =>
    department.members.length +
    (department.subDepartments?.reduce((total, subDepartment) => total + subDepartment.members.length, 0) || 0);

  const totalMembers = staffData.reduce(
    (total, department) => total + countDepartmentMembers(department),
    0,
  );

  const isLeader = (member: StaffMember) => {
    const role = member.role.toLocaleLowerCase('pt-BR');
    return !role.includes('vice') && ['diretor', 'gerente', 'líder'].some((title) => role.includes(title));
  };

  const renderMemberCard = (member: StaffMember) => (
    <article
      key={member.id}
      className={`${styles.staffCard} ${isLeader(member) ? styles.leaderCard : ''}`}
      style={{ opacity: member.vacant ? 0.62 : 1 }}
    >
      <div className={styles.avatarContainer}>
        {member.photoUrl && !member.vacant ? (
          <Image src={member.photoUrl} alt={member.name} fill sizes="76px" style={{ objectFit: 'cover' }} />
        ) : (
          <svg className={styles.avatarFallback} width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </div>
      <div className={styles.cardInfo}>
        <div className={styles.staffRole}>{member.role}</div>
        {member.vacant ? (
          <div className={styles.staffVacant}>{dict.staffPage.vacant}</div>
        ) : (
          <div className={styles.staffName}>{member.name}</div>
        )}
      </div>
    </article>
  );

  const renderMembers = (members: StaffMember[]) => (
    <div className={styles.staffGrid}>{members.map(renderMemberCard)}</div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>{dict.staffPage.eyebrow}</span>
        <h1 className={styles.title}>
          <span>{dict.staffPage.title1}</span>
          <span className={styles.titleAccent}>{dict.staffPage.title2}</span>
        </h1>
        <div className={styles.headerFooter}>
          <p className={styles.description}>{dict.staffPage.subtitle}</p>
          <div className={styles.stats} aria-label={dict.staffPage.teamNumbers}>
            <div className={styles.stat}><strong>{staffData.length}</strong><span>{dict.staffPage.departments}</span></div>
            <div className={styles.stat}><strong>{totalMembers}</strong><span>{dict.staffPage.volunteers}</span></div>
          </div>
        </div>
      </header>

      <div className={styles.tabsContainer} role="tablist" aria-label={dict.staffPage.departmentsNavigation}>
        {staffData.map((department) => (
          <button
            key={department.id}
            id={`staff-tab-${department.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === department.id}
            aria-controls={`staff-panel-${department.id}`}
            className={`${styles.tabButton} ${activeTab === department.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(department.id)}
          >
            {department.name}
          </button>
        ))}
      </div>

      {activeDepartment && (
        <section
          id={`staff-panel-${activeDepartment.id}`}
          className={styles.departmentContent}
          role="tabpanel"
          aria-labelledby={`staff-tab-${activeDepartment.id}`}
        >
          <div className={styles.departmentHeader}>
            <div>
              <span className={styles.departmentEyebrow}>{dict.staffPage.department}</span>
              <h2 className={styles.departmentTitle}>{activeDepartment.name}</h2>
            </div>
            <span className={styles.memberCount}>
              {countDepartmentMembers(activeDepartment)} {dict.staffPage.members}
            </span>
          </div>

          {activeDepartment.members.length > 0 && renderMembers(activeDepartment.members)}

          {activeDepartment.subDepartments && activeDepartment.subDepartments.length > 0 && (
            <div className={styles.subDepartmentsContainer}>
              {activeDepartment.subDepartments.map((subDepartment) => (
                <section key={subDepartment.id} className={styles.subDepartmentSection}>
                  <div className={styles.subDepartmentHeader}>
                    <h3 className={styles.subDepartmentTitle}>{subDepartment.name}</h3>
                    <span className={styles.memberCount}>{subDepartment.members.length} {dict.staffPage.members}</span>
                  </div>
                  {renderMembers(subDepartment.members)}
                </section>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
