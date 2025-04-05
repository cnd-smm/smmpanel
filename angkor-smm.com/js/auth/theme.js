/*
*
* Theme : Pech Chhean V1
*
*/

function passwordShowHide(target, items){
    console.log('clicked')
    const targetEl = document.getElementById(target);
    const itemsEl = document.getElementById(items);
    
    targetEl.classList.toggle('active');
    const currentAttribute = itemsEl.getAttribute('type');
    if(currentAttribute == 'password'){
        itemsEl.setAttribute('type', 'text');
    }else{
        itemsEl.setAttribute('type', 'password');
    }
}

function sidebarToggler(){
    const fullDashboard = document.getElementById('fullDashboard');
    fullDashboard.classList.toggle('sidebar__toggler');
}

function showmoreButton(){
    const showmoreWrap = document.getElementById('showmore_menu');
    showmoreWrap.classList.toggle('d-none');
}


function searching(name) {
    let categoryGeted = [];
    for (const element of categories_list) {
    var elementitem = element.name.toLowerCase();
    var elementId = element.id;
    var resultBool = elementitem.includes(name);
    if (resultBool == true) {
        categoryGeted.push(elementId);
    }
    }
    let result = [];
    for (var i = 0; i < categories_list.length; i++) {
    for (const elements of categoryGeted) {
        if (elements == categories_list[i].id) {
        result.push(categories_list[i]);
        }
    }
    }
    if (result.length == 0) {
    result = categories_list;
    }
    let optionsResult = "";
    for (const item of result) {
    optionsResult =
        optionsResult + `<option value="${item.id}"  data-icon="${item.icon}">${item.name}</option>`;

    }
    return optionsResult;
}

function filterOthers(){
  let result = [];
  
  for(const item of categories_list){
      const itemName = item.name.toLowerCase();
      if(!itemName.includes('facebook') && !itemName.includes('instagram') && !itemName.includes('youtube') && !itemName.includes('twitter') && !itemName.includes('spotify') && !itemName.includes('tiktok') && !itemName.includes('linkedin') && !itemName.includes('google') && !itemName.includes('telegram') && !itemName.includes('traffic') && !itemName.includes('twitch') && !itemName.includes('discord') && !itemName.includes('snapchat') && !itemName.includes('reviews')){
          result.push(item);
      }
  }
  
  if (result.length == 0) {
      result = categories;
      }

      let optionsResult = "";
      for (const item of result) {
      optionsResult =
          optionsResult + `<option value="${item.id}">${item.name}</option>`;
      }
      return optionsResult;
}

function otherStart(){
  let result = filterOthers();
  let placeOfSelect = document.getElementById("orderform-category");
  placeOfSelect.innerHTML = result;
$('#orderform-category').trigger('change');
}

function start(names) {
    var result = searching(names);
    let placeOfSelect = document.getElementById("orderform-category");
    placeOfSelect.innerHTML = result;
  $('#orderform-category').trigger('change');
}


$("#orderform-service").change(function(){
  let mainTime = $('#field-orderform-fields-average_time').val();
  let placeOfitem = $('#avarageTime');
  placeOfitem.text(mainTime);
});
