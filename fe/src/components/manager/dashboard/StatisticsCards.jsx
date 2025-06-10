import React from 'react';
import { FiDroplet, FiUsers, FiClipboard } from 'react-icons/fi';
import '../../../styles/components/manager/StatisticsCards.scss';

const StatisticsCards = ({ statistics }) => {
  const {
    totalBloodUnits = 0,
    totalDonors = 0,
    totalRequests = 0
  } = statistics;

  const cards = [
    {
      id: 'blood-units',
      title: 'Số đơn vị máu',
      value: totalBloodUnits,
      subtitle: 'Tổng trong kho',
      icon: FiDroplet,
      color: 'primary'
    },
    {
      id: 'donors',
      title: 'Số người hiến',
      value: totalDonors,
      subtitle: 'Đã đăng ký',
      icon: FiUsers,
      color: 'success'
    },
    {
      id: 'requests',
      title: 'Số yêu cầu máu',
      value: totalRequests,
      subtitle: 'Tổng yêu cầu',
      icon: FiClipboard,
      color: 'warning'
    }
  ];

  return (
    <div className="statistics-cards">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div key={card.id} className={`stat-card ${card.color}`}>
            <div className="stat-header">
              <div className="stat-icon">
                <IconComponent />
              </div>
              <div className="stat-title">{card.title}</div>
            </div>
            
            <div className="stat-content">
              <div className="stat-value">{card.value.toLocaleString('vi-VN')}</div>
              <div className="stat-subtitle">{card.subtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;
