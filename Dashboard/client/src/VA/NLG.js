export function NLG_agenda(events, date) {
  let start = [
    'Você tem marcado na sua agenda',
    'Você tem marcado ',
    'Você tem '
  ]
  let day = getWeekday(date);
  let todos = ' ';
  for(let i = 0; i < events.length; i++){
    let summary = events[i].summary;
    let time = ' o dia todo ';
    if(events[i].start.dateTime!==undefined) time = ' às '+new Date(events[i].start.dateTime).getHours()+' horas ';
    if(i===events.length-1&&i!==0)todos+=' e '+summary+time;
    else todos+=summary+time+',';
  }
  if(events.length!==0)return randomPhrase(start)+day+':'+todos;
  else return 'Você não tem nada marcado '+day;
}

export function NLG_weather(data, city='Avaré') {
  let day = new Date(data[0].dt_txt).getDay();
  day = getWeekday(day);
  let start = [
    'A previsão do tempo para '
  ];
  let declares = [
    ' é de '
  ];
  let periods = [
    [' pela manhã', ' de manhã'],
    [' de tarde', ' a tarde'],
    [' de noite', ' a noite'],
  ];
  let connector = ', ';
  let ends = ' e ';
  let result = randomPhrase(start)+city+day+' é de ';
  for(let i = 0; i<data.length; i++){
    result+=data[i].weather[0].description;
    if(data[i].dt_txt.includes("09")) result+=randomPhrase(periods[0])
    else if(data[i].dt_txt.includes("15")) result+=randomPhrase(periods[1])
    else if(data[i].dt_txt.includes("21")) result+=randomPhrase(periods[2])
    if(i === data.length-1) result+='.';
    else if(i === data.length-2) result+=' e ';
    else if(i === data.length-3) result+=', ';
  }
  return result;
}

export function NLG_alarm(datetime) {
  const date = new Date(datetime);
  let start = [
    'O alarme foi definido para',
    'O despertador foi configurado para'
  ]
  let hours = ' as '+date.getHours().toString()+' horas';
  if(datetime.includes('T01'))hours = hours.replace('as', 'a').replace('horas', 'hora');
  return randomPhrase(start)+hours+getWeekday(date.getDay());
}

export function phatic() {
  let lib = [
    'Pois não, em que posso ajudar?',
    'Estou aqui',
    'Pode falar',
    'Estou ouvindo',
    'Pois não'
  ]
  return randomPhrase(lib);
}

export function confirm() {
  let lib = [
    'Ok',
    'Sem problemas',
    'Entendido',
    'Entendi'
  ]
  return randomPhrase(lib);
}

function randomPhrase(lib) {
  return lib[Math.floor(Math.random() * lib.length)]
}

function getWeekday(day){
  let weekday = '';
  switch (day) {
    case 0:
      weekday=' no Domingo';
      break;
    case 1:
      weekday=' na Segunda feira';
      break;
    case 2:
      weekday=' na Terça feira';
      break;
    case 3:
      weekday=' na Quarta feira';
      break;
    case 4:
      weekday=' na Quinta feira';
      break;
    case 5:
      weekday=' na Sexta feira';
      break;
    default:
      weekday=' no Sábado';
      break;
  }
  return weekday;
}
