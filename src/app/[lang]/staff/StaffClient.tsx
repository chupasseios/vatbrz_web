'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './Staff.module.css';
import { StaffDepartment, StaffMember } from '@/services/staff';

interface StaffClientProps {
  dict: any;
  staffData: StaffDepartment[];
}

export default function StaffClient({ dict, staffData }: StaffClientProps) {
  const [activeTab, setActiveTab] = useState(staffData[0]?.id || '');

  const activeDepartment = staffData.find((dept) => dept.id === activeTab);

  // Helper function to render a staff member card
  const renderMemberCard = (member: StaffMember, isLeader: boolean) => {
    const cardClass = isLeader ? `${styles.staffCard} ${styles.leaderCard}` : styles.staffCard;

    return (
      <div key={member.id} className={cardClass} style={{ opacity: member.vacant ? 0.6 : 1 }}>
        <div className={styles.avatarContainer}>
          {member.photoUrl && !member.vacant ? (
            <Image src={member.photoUrl} alt={member.name} fill style={{ objectFit: 'cover' }} />
          ) : (
            <svg className={styles.avatarFallback} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
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
      </div>
    );
  };

  // Helper function to render members grouped by hierarchy
  const renderMembers = (members: StaffMember[]) => {
    // Identify leaders (e.g., Diretor, Gerente, Líder)
    const leaders = members.filter((m) => 
      m.role.toLowerCase().includes('diretor') && !m.role.toLowerCase().includes('vice') || 
      m.role.toLowerCase().includes('gerente') && !m.role.toLowerCase().includes('vice') ||
      m.role.toLowerCase() === 'líder'
    );
    
    const others = members.filter((m) => !leaders.includes(m));

    return (
      <>
        {leaders.length > 0 && (
          <div className={styles.leadersGrid}>
            {leaders.map((m) => renderMemberCard(m, true))}
          </div>
        )}
        {others.length > 0 && (
          <div className={styles.staffGrid}>
            {others.map((m) => renderMemberCard(m, false))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={`${styles.title} glow-text`}>
          {dict.staffPage.title1} <span style={{ color: '#0DDB6E' }}>{dict.staffPage.title2}</span>
        </h1>
        <p className={styles.description}>
          {dict.staffPage.subtitle}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsContainer}>
        {staffData.map((dept) => (
          <button
            key={dept.id}
            className={`${styles.tabButton} ${activeTab === dept.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(dept.id)}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* Active Department Content */}
      {activeDepartment && (
        <div className={styles.departmentContent}>
          <h2 className={styles.departmentTitle}>{activeDepartment.name}</h2>
          
          {/* Main Department Members */}
          {activeDepartment.members && activeDepartment.members.length > 0 && (
            <div className={styles.mainMembersSection}>
              {renderMembers(activeDepartment.members)}
            </div>
          )}

          {/* Sub-departments Rendering */}
          {activeDepartment.subDepartments && activeDepartment.subDepartments.length > 0 && (
            <div className={styles.subDepartmentsContainer}>
              {activeDepartment.subDepartments.map((subDept) => (
                <div key={subDept.id} className={styles.subDepartmentSection}>
                  <h3 className={styles.subDepartmentTitle}>{subDept.name}</h3>
                  {renderMembers(subDept.members)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
