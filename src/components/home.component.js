import React, { useEffect, useState } from 'react';
import './home.css';
import axios from "axios";
import AuthService from "../services/auth.service";
const Home = () => {
  
  const [userName, setUserName] = useState('');
  const token = AuthService.getCurrentJwt()

  useEffect(() => {
    axios
      .get('http://localhost:8080/users/me',
      {
        headers: { 'Authorization' : `Bearer ${token}`,  'Access-Control-Allow-Origin': "*"}
      })
      .then(response => {
        setUserName(response.data.firstname + " " + response.data.lastname);
      })
      .catch(error => {
        console.error('Ошибка получения данных пользователя:', error);
      });
  }, []);

  const images = [
    {
      src: 'https://assets-global.website-files.com/599873abab717100012c91ea/614da5855d53b4821412f331_3808949.jpg',
      description: 'Востребованность и перспективы карьеры: IT-отрасль является одной из наиболее динамичных и быстрорастущих отраслей современного мира. Прохождение IT-курсов открывает двери к широкому спектру карьерных возможностей, включая разработку программного обеспечения, анализ данных, кибербезопасность, веб-разработку и многое другое. Участие в IT-курсах может помочь вам освоить навыки, которые востребованы на рынке труда и могут привести к удовлетворительной и высокооплачиваемой работе.',
    },
    {
      src: 'https://antitreningi.ru/info/wp-content/uploads/2021/05/%D0%9E%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD-%D0%BA%D1%83%D1%80%D1%81-1200x900.png',
      description: 'Современные технологии и тренды: IT-отрасль постоянно развивается и внедряет новые технологии. Участие в IT-курсах позволит вам быть в курсе последних тенденций и технологических новинок. Вы сможете изучать современные языки программирования, инструменты разработки, платформы облачных вычислений и многое другое. Это поможет вам оставаться востребованным специалистом и быть готовым к вызовам, которые предcтоит решить.',
    },
    {
      src: 'https://happymonday.ua/wp-content/uploads/2019/12/webed-940x528.jpg',
      description: 'Практическое применение: IT-курсы обычно ориентированы на практическое применение знаний. Вы сможете решать реальные задачи и работать над проектами, что поможет вам развить навыки, необходимые для реальных рабочих ситуаций. Это позволяет вам получить ценный опыт и демонстрирует вашу способность решать проблемы и применять полученные знания на практике.',
    },
  ];

  return (
    <><div className="slider-container">
      {/* <h1 className="greeting">Привет, {userName}!</h1>  */}
      {images.map((image, index) => (
        <div className={'slider-item ' + (index % 2 === 0 ? 'left' : 'right')} key={index}>
          <div className={'image-description ' + (index % 2 === 0 ? 'right' : 'left')}>
            <p className={'p' + (index + 1)}>{image.description}</p>  
          </div>
          <div className={"image-wrapper-" + (index % 2 === 0 ? 'left' : 'right')}>
            <img src={image.src} alt={'Изображение ' + (index + 1)} />
          </div>
        </div>
      ))}
    </div><br /><br /><br /><br /></>
  );
};

export default Home;