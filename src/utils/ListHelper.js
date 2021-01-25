export function removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
 }


export function addLabelForSelectorClasse(originalArray){
	originalArray.map(obj =>{
              !obj.name ?
              obj['label']=obj.classeName : obj['label']=obj.name
              obj['value']=obj.id;
              !obj.name ? obj['type']="classes" : obj['type']="categories"
    });
    return originalArray;
}


export function buildListForCalendar(originalArray){
  originalArray.map(obj =>{
              obj['color']=obj.isActive ? "#f7b731" : "#f7b731" ;
              obj['desc']=obj.description;
              obj['end']=obj.endDateTime;
              // obj['id']=obj.id;
              obj['start']=obj.startDateTime;
              obj['title']=obj.roomName;
              // obj['classe']=obj.classe;
              obj['value']=obj.id;

    });
    return originalArray;
}



export function checkIfCurrentClasseExist(currentClasseId , originalArray){
    let elementExist = false ;
    originalArray.map(obj =>{
              if(obj._id === currentClasseId){
                elementExist = true ;
              }
    });
    return elementExist;
}

export function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}

export function validatePhoneNumber(phone) {

  if (!isNaN(parseFloat(phone)) && !isNaN(phone - 0)) {
    if (phone.length === 10 && phone.charAt(0) === '0') {
      return true;
    }
  }
  return false;
}

export function getNotificationMessage(notification, t) {
  const  { message } = notification
//   let message = '';

//   switch (notification.type) {
//     case 'subscribe_to_room':
//       message = `${notification.from.fullName} ${t(notification.message)}`;
//       break;

//     case 'accepted_subscription':
//       message = `${notification.from.fullName} ${t(notification.message)} ${notification.resourceName}`;
//       break;

//     case 'invited_to_class':
//       message = `${notification.from.fullName} ${t(notification.message)} ${notification.resourceName}`;
//       break;

//     case 'invited_to_room':
//       message = `${notification.from.fullName} ${t(notification.message)} ${notification.resourceName}`;
//       break;

//     case 'Room_Create_Invite_For_Class_Students':
//       message = `${notification.from.fullName} ${t(notification.message)} ${notification.resourceName}`;
//       break;
//   }

  return message;
}
