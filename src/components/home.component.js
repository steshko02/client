import React from 'react';

function Home() {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  };

  const sectionStyle = {
    marginBottom: '20px',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
    borderRadius: '5px',
    padding: '10px',
  };

  const headingStyle = {
    fontSize: '24px',
    marginBottom: '10px',
    color: 'blue',
    textDecoration: 'underline',
  };

  const contactStyle = {
    fontSize: '16px',
    marginBottom: '5px',
  };

  const advantagesStyle = {
    fontSize: '18px',
    marginBottom: '10px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: 'blue' }}>Контакты</h1>
      <div style={sectionStyle}>
        <h2 style={headingStyle}>Номера телефонов:</h2>
        <p style={contactStyle}>+X-XXX-XXX-XXXX</p>
        <p style={contactStyle}>+X-XXX-XXX-XXXX</p>
      </div>
      <div style={sectionStyle}>
        <h2 style={headingStyle}>Почтовые ящики:</h2>
        <p style={contactStyle}>info@example.com</p>
        <p style={contactStyle}>support@example.com</p>
      </div>
      <div style={sectionStyle}>
        <h2 style={headingStyle}>Преимущества онлайн курсов:</h2>
        <ul style={advantagesStyle}>
          <li>Гибкое расписание обучения</li>
          <li>Доступность из любой точки мира</li>
          <li>Разнообразие курсов и тематик</li>
          <li>Интерактивные задания и тестирование</li>
          <li>Возможность общения с преподавателями и студентами</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;