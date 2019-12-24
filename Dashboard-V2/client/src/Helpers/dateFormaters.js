const dateFormater = {
  formateWeekday: function(day){
    let weekday = '';
    switch (day) {
      case 0:
        weekday = 'Dom'
        break;
      case 1:
        weekday = 'Seg'
        break;
      case 2:
        weekday = 'Ter'
        break;
      case 3:
        weekday = 'Qua'
        break;
      case 4:
        weekday = 'Qui'
        break;
      case 5:
        weekday = 'Sex'
        break;
      case 6:
        weekday = 'Sab'
        break;
      default:
        break;
    }
    return weekday;
  },

  formateMonth: function(value){
    let month = '';
    switch (value) {
      case 0:
        month = 'Jan'
        break;
      case 1:
        month = 'Fev'
        break;
      case 2:
        month = 'Mar'
        break;
      case 3:
        month = 'Abr'
        break;
      case 4:
        month = 'Mai'
        break;
      case 5:
        month = 'Jun'
        break;
      case 6:
        month = 'Jul'
        break;
      case 7:
        month = 'Ago'
        break;
      case 8:
        month = 'Set'
        break;
      case 9:
        month = 'Out'
       break;
      case 10:
        month = 'Nov'
        break;
      case 11:
        month = 'Dez'
        break;
      default:
        break;
    }
    return month;
  }
}

export default dateFormater;
