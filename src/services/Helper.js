import Moment from 'moment';

class Helper {

  dateByFormat(date) {
    Moment.locale('en');
    return Moment(date).format('D MMMM YYYY hh:mm');
    ;
  }

  statusByFormat(status) {
   if(status==="NOT_STARTED"){
    return "Не начат"
   }
   if(status==="DURING"){
    return "Начат"
   }
   if(status==="FINISHED"){
    return "Закончен"
   }
   if(status==="CONSIDERED"){
    return "На рассмотрении"
   }
   if(status==="APPROWED"){
    return "Подтвержден"
   }
   if(status==="CANCELLED"){
    return "Отменен"
   }
    return "Неизвестный"
  }

  statusByFormatForTask(status) {
    if(status==="DURING"){
     return "В срок"
    }
    if(status==="FINISHED"){
     return "Просрочено"
    }
   
     return "Неизвестный"
   }
}

export default new Helper();