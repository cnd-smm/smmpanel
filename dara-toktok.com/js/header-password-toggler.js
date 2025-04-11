// Header Toggler

$(window).scroll(function () {
  var scroll = $(window).scrollTop();
  if (scroll >= 100) {
    $("header").addClass("nav-scrolled");
  } else {
    $("header").removeClass("nav-scrolled");
  }
});

// Password Text toggler

function passwordShowHide(target, items) {
  const targetEl = document.getElementById(target);
  const itemsEl = document.getElementById(items);

  targetEl.classList.toggle("active");
  const currentAttribute = itemsEl.getAttribute("type");
  if (currentAttribute == "password") {
    itemsEl.setAttribute("type", "text");
  } else {
    itemsEl.setAttribute("type", "password");
  }
}

// Toggle Theme Mode

function toggleThemeMode() {
  const pakmainsmmCurrentMode = localStorage.getItem("pakmainsmmCurrentMode");
  const bodyFire = document.getElementById("body");
  const currentTheme = document.documentElement.getAttribute('data-bs-theme');

  if (pakmainsmmCurrentMode) {
    localStorage.removeItem("pakmainsmmCurrentMode");
    bodyFire.classList.remove("daymode");
    document.documentElement.setAttribute('data-bs-theme', 'dark');

  } else {
    localStorage.setItem("pakmainsmmCurrentMode", "daymode");
    document.documentElement.setAttribute('data-bs-theme', 'light');
    bodyFire.classList.add("daymode");
  }
}

// Sidebar toggler
document.getElementById('SidebarButton').addEventListener('click',function(){
  document.getElementById('dashboard').classList.toggle('activeSidebar');
});
document.getElementById('sidebar_active_blur').addEventListener('click',function(){
  document.getElementById('dashboard').classList.toggle('activeSidebar');
});


//Rating
let selectedRating = 0;

document.querySelectorAll('#star-rating .star').forEach(star => {
    star.addEventListener('click', function() {
        selectedRating = this.getAttribute('data-value');
        updateStars(selectedRating);
    });
});

function updateStars(rating) {
    document.querySelectorAll('#star-rating .star').forEach(star => {
        if (star.getAttribute('data-value') <= rating) {
            star.textContent = 'â˜…'; // Filled star
            star.classList.add('selected');
        } else {
            star.textContent = 'â˜†'; // Outlined star
            star.classList.remove('selected');
        }
    });
}

function submitRating() {
    const username = document.querySelector('#username').value.trim();
    const feedback = document.querySelector('#feedback').value.trim();

    if (!username) {
        alert('Please enter your name before submitting your rating.');
        return;
    }

    if (selectedRating === 0) {
        alert('Please select a star rating before submitting your review.');
        return;
    }

    const lastReviewTime = localStorage.getItem('lastReviewTime');
    const currentTime = Date.now();
    
    if (lastReviewTime && currentTime - lastReviewTime < 5 * 60 * 1000) {
        alert('You can submit another review after 5 minutes.');
        return;
    }

    localStorage.setItem('lastReviewTime', currentTime);

    fetch('https://rating.headsmmpanel.com/submit_rating.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, rating: selectedRating, feedback }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Rating submitted successfully. Your review will be displayed here soon!');
            loadRatings();
        } else {
            alert('Error submitting rating: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('There was an error submitting your rating. Please try again.');
    });
}

function loadRatings() {
    fetch('https://rating.headsmmpanel.com/get_ratings.php')
        .then(response => response.json())
        .then(data => {
            const ratingsContainer = document.querySelector('#ratings');
            const averageStarsElement = document.querySelector('#average-stars');
            
            const averageRating = data.average_rating;
            const filledStars = 'â˜…'.repeat(Math.floor(averageRating));
            const outlinedStars = 'â˜†'.repeat(5 - Math.floor(averageRating));
            averageStarsElement.innerHTML = `<span class="gold-stars">${filledStars}</span><span>${outlinedStars}</span> (${averageRating.toFixed(1)})`;

            ratingsContainer.innerHTML = '';
            data.ratings.forEach(rating => {
                ratingsContainer.innerHTML += 
                    `<div class="rating-card">
                        <strong class="username">${rating.username}</strong>
                        <div class="stars">${'â˜…'.repeat(rating.rating)}${'â˜†'.repeat(5 - rating.rating)}</div>
                        <div class="feedback">${rating.feedback || ''}</div>
                        ${rating.reply ? `<div class="admin-reply"><em>Reply by Mian Sajid Maqsood</em><p>${rating.reply}</p></div>` : ''}
                    </div>`;
            });
        })
        .catch(error => console.error('Error fetching ratings:', error));
}

document.addEventListener('DOMContentLoaded', loadRatings);



$(".ser-update").click(function () {
    // Remove 'active' class from specific elements
    $(".btn-new, .btn-fav").removeClass("active");
    
    // Add 'active' class to the clicked element
    $(this).addClass("active");
    
    // Trigger a click event on the element with an empty data-change-cat attribute
    $(".nwo-cat-btn[data-change-cat='']").trigger("click");
});


$("a.btn-fav").click(function () {
    $(".nPlatform").addClass("d-none");
    $(".main-content").removeClass("hidden");
    $("ul.nav li a.active").removeClass("active");
    $(this).addClass("active");
    $(".nwo-cat-btn[data-change-cat='']").click();

    $("select#orderform-service option").remove();
    $("select#orderform-category-copy option").remove();
    $(".form-group.fields").addClass("hidden");
    $("span#s_desc").html("Select services...");
    $("span#s_name").html("Select services...");
    $("input#charge").val("");

    let services = window.modules.siteOrder;
    // loop services
    let count = 0;
    $.each(services, function (index, value) {
        if (index == "services") {
            $("select#orderform-category-copy").html("");
            // loop services
            $.each(value, function (index, value) {
                // get this val
                let this_val = value.id;
                if (getCookie("favorite_service_" + this_val)) {
                    let cat_id = value.cid;

                    $("select#orderform-category option:not([remove='false'])").each(function () {
                        if ($(this).val() != cat_id) {
                            $(this).attr("remove", "true");
                        } else {
                            $(this).attr("remove", "false");
                        }
                    });
                    count++;
                }
            });
        }
    });

    $("select#orderform-category option[remove='true']").remove();

    if (count == 0) {
         $(".alert-fav.hidden").removeClass("hidden");
    	 $(".main-content").addClass("hidden");
    }

    $("select#orderform-category").trigger("change");

    // set 500ms
    setTimeout(function () {
        $("select#orderform-service option:not([remove='false'])").each(function () {
            let service_id = $(this).val();
            if (getCookie("favorite_service_" + service_id)) {
                $(this).attr("remove", "false");
            } else {
                $(this).attr("remove", "true");
            }
        });
        $("select#orderform-service option[remove='true']").remove();
        $("select#orderform-service").trigger("change");
    }, 500);
});

$("select#orderform-category").change(function () {
    if ($("a.btn-fav.active").length > 0) {
        setTimeout(function () {
            $("select#orderform-service option:not([remove='false'])").each(function () {
                let service_id = $(this).val();
                if (getCookie("favorite_service_" + service_id)) {
                    $(this).attr("remove", "false");
                } else {
                    $(this).attr("remove", "true");
                }
            });
            $("select#orderform-service option[remove='true']").remove();
            $("select#orderform-service").trigger("change");
        }, 100);
    }
    let icon = $(this).find("option:selected").attr("data-icon");
    setTimeout(function () {
        $("select#orderform-service option").attr("data-icon", icon);
        $("select#orderform-service").trigger("change");
    }, 10);
});

setTimeout(function () {
    let icon = $("select#orderform-service").find("option:selected").attr("data-icon");
    $("select#orderform-service option").attr("data-icon", icon);
    $("select#orderform-service").trigger("change");
}, 100);


$("button.favorite").click(function () {
    let service_id = $(this).attr("data-service-id");
    $(this).toggleClass("active");

    // add to favorite
    if ($(this).hasClass("active")) {
        // setcookie
        setCookie("favorite_service_" + service_id, service_id, 365);
    } else {
        // remove cookie
        setCookie("favorite_service_" + service_id, service_id, -1);
    }
});

$("ul.platforms li button").click(function () {
    $("ul.platforms li button").removeClass("active");
    $(this).toggleClass("active");

    let platform = $(this).attr("data-platform");

    if (platform == "all") {
        $(".service-category").show();
    } else if (platform == "fav") {
        $(".service-category").show();
        $(".si-header").hide();
        $(".service-item:not(.mb-4)").hide();
        $(".service-item[data-fav='true']").show();
    } else {
        $(".service-category").hide();
        $(".service-category[data-platform='" + platform + "']").show();
    }
});

$("select#orderform-platform").change(function () {
    let val = $(this).val().replaceAll(' ', '').replaceAll('\n', '').replaceAll('\r', '');
    $(".nwo-cat-btn[data-change-cat='" + val + "']").click();

    setTimeout(function () {
        let icon = $("select#orderform-service").find("option:selected").attr("data-icon");
        $("select#orderform-service option").attr("data-icon", icon);
        $("select#orderform-service").trigger("change");
    }, 10);
});

if ($(".service-item").length > 0) {
    $(".service-item").each(function () {
        let service_id = $(this).attr("data-service-id");
        if (getCookie("favorite_service_" + service_id)) {
            $(this).find(".favorite").addClass("active");
            $(this).attr("data-fav", "true");
        } else {
            $(this).attr("data-fav", "false");
        }
    });
}

const filterServicesInput = document.getElementById('searchService');
if (filterServicesInput) {
    const serviceTitle = document.querySelectorAll('.service-cat-side');
    const serviceHeads = document.querySelectorAll('.category-card > .card-header');
    const nothingFound = document.querySelector('.nothing-found');
    const searchTextWrite = document.getElementById('search-text-write');

    filterServicesInput.addEventListener('keyup', e => {
        const keyword = e.target.value;
        $('.service-item').each(function () {
            var text = $(this).text().toLowerCase();
            if (text.indexOf(e.target.value.toLowerCase()) == -1) {
                $(this).addClass('hidden');
            } else {
                $(this).removeClass('hidden');
            }
        });

        const catCards = document.querySelectorAll('.service-category');
        [...catCards].forEach(card => {
            const itemsHidden = card.querySelectorAll('.service-item.hidden');
            const items = card.querySelectorAll('.service-item');
            if (itemsHidden.length == items.length) {
                card.style.display = 'none';
                card.classList.add('empty');
            } else {
                card.style.display = '';
                card.classList.remove('empty');
            }
        })

        const catCardsCount = catCards.length;
        // empty cards
        const emptyCards = document.querySelectorAll('.service-category.empty');
        console.log(emptyCards.length, catCardsCount);
        if (emptyCards.length == catCardsCount) {
            nothingFound.style.display = '';
            searchTextWrite.innerHTML = keyword;
        } else {
            nothingFound.style.display = 'none';
            searchTextWrite.innerHTML = '';
        }
    });
}

function filterService(category) {
    if (category == 'all')
        $('.category-card.hidden').removeClass('hidden');
    else {
        $('.category-card').addClass('hidden');
        $('.category-card[data-category="' + category + '"]').removeClass('hidden');
    }
    removeEmptyCategory();
}

const filterServces = document.getElementById('filterServices');
if (filterServces) {
    filterServces.addEventListener('change', e => {
        filterService(e.target.value);
    });
}

// setcookie, getcookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
   function searchID(){
     var service = $('#input_service').val();
     let errorSender = document.getElementById('error_search');
     var errorMsg = ` <div class="alert alert-dismissible alert-danger">
       <button type="button" class="close" data-dismiss="alert">&times;</button>
       The service you are looking for was not found, try another Service ID.
    </div>`;

     try{
       var selectSerCatID = window.modules.siteOrder.services[service].cid;
       } 
       catch(err){     
         errorSender.innerHTML = errorMsg;
       }
       
       let orderCat = document.getElementById('orderform-category');
       let orderSer = document.getElementById('orderform-service');
      
 
         if(selectSerCatID){
           errorSender.innerHTML = '';
           $(function () {
             orderCat.querySelector('[selected]').removeAttribute('selected');
             console.log(selectSerCatID);
             orderCat.querySelector('[value="'+ selectSerCatID +'"]').setAttribute('selected', 'selected');
             orderCat.value = selectSerCatID;
  
             var event = document.createEvent('HTMLEvents');
             event.initEvent('change', true, false);
             orderCat.dispatchEvent(event);
             setTimeout(() => {
                   let controlSel = orderSer.querySelector('[selected]')
                   if (controlSel) {
                      controlSel.removeAttribute('selected');
                   }
                   orderSer.querySelector('[value="'+ service +'"]').setAttribute('selected', 'selected');
                   orderSer.value = service;
                   $('#serv_id').html(service);
                   orderSer.dispatchEvent(event);
  
             }, 500);
          });
         }
   }

var modalOpen = (modalId, data = null) => {
  const modal = document.getElementById(modalId);
  const modalBox = modal.querySelector('.modal-box');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  modal.addEventListener('click', e => {
    if (e.target !== modalBox && !modalBox.contains(e.target)) {
      closeModal();
    }
  });

  const modalCloseBtn = modal.querySelector('.m-close');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', e => {
      closeModal();
    })
  }

  if (data != null) {
    Object.keys(data).forEach(key => {
      const el = document.getElementById(key);
      if (el) {
        el.innerHTML = data[key];
      }
    });
  }

}

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  makeToast('Copy to clipboard')
};

var toastTime;

function makeToast(text = null, timeOut=4000) {
  $('.toast-text').html(text)
  $('.bs-toast').fadeIn(300);

  toastTime = setTimeout(() => {
    $('.bs-toast').fadeOut(300);
  }, timeOut);
}

function removeToast() {
  $('.bs-toast').fadeOut(300);
  clearTimeout(toastTime);
}

function setAmount(val) {
    var setamount = document.getElementById("amount");
    setamount.value = val
}


$("#orderform-service").change(function () {
    service_id = $(this).val();
    $("#s_id").text(service_id);

    description = window.modules.siteOrder.services[service_id].description
    $("#s_desc").html(description);

    name = window.modules.siteOrder.services[service_id].name
    $("#s_name").html(name);
  
    console.log($("#s_time").text());
    service_time_text = window.modules.siteOrder.services[service_id].average_time
    $("#s_time").text(service_time_text);
    $('#s_time').val($('#s_time').text());  
})

const newsDrawer = document.querySelector('.basket-drawer');

if (newsDrawer) {
  const newsDrawerToggle = document.querySelector('.basket-drawer-toggle');
  const newsDrawerClose = document.querySelector('.basket-header-close');
  const newsDrawerOverlay = document.querySelector('.basket-overlay');


  newsDrawerToggle.addEventListener('click', e => {
    newsDrawer.style.display = 'block';
    setTimeout(() => { 
      newsDrawer.style.transform = 'translateX(0)';
    }, 10)
    newsDrawerOverlay.style.display = 'block';
  });

  newsDrawerClose.addEventListener('click', e => {
    newsDrawer.style.transform = 'translateX(100%)';
    setTimeout(() => {
      newsDrawer.style.display = 'none';
    }, 300);
    newsDrawerOverlay.style.display = 'none';
  });
}

const useState = (defaultValue) => {
  let value = defaultValue;
  const getValue = () => value
  const setValue = newValue => value = newValue
  return [getValue, setValue];
}

var sChatBody = document.getElementsByClassName('schat-chat-body')[0];
if (sChatBody) {
  sChatBody.scrollTo(0, sChatBody.offsetHeight);
}
function norServices() {
    var app = document.getElementsByTagName("BODY")[0];
    localStorage.platMode = "slistTwo";
    app.classList.add('slistTwo');
    app.classList.remove('slistOne');
    console.log("platMode = " + localStorage.platMode);
}
function devServices() {
    var app = document.getElementsByTagName("BODY")[0];
    localStorage.platMode = "slistOne";
    app.classList.add('slistOne');
    app.classList.remove('slistTwo');
    console.log("platMode = " + localStorage.platMode);
}

setTimeout(function () {
    let icon = $("html select#orderform-service").find("option:selected").attr("data-icon");
    $("select#orderform-service option").attr("data-icon", icon);
    $("select#orderform-service").trigger("change");
}, 100);

$("select#orderform-platform").change(function () {
    let val = $(this).val().replaceAll(' ', '').replaceAll('\n', '').replaceAll('\r', '');
    $(".nwo-cat-btn[data-change-cat='" + val + "']").click();
	$('.nCategory').attr("style", "display:block!important");
    setTimeout(function () {
        let icon = $("select#orderform-service").find("option:selected").attr("data-icon");
        $("select#orderform-service option").attr("data-icon", icon);
        $("select#orderform-service").trigger("change");
    }, 10);
 
});

$("#subs-btn").click(function () {
    $(".nwo-cat-btn[data-change-cat='Subscription']").click();
});

$("#news-btn").click(function () {
    $(".nwo-cat-btn[data-change-cat='']").click();
});

$("select#orderform-category").change(function () {
    $('.nServices').attr("style", "display:block!important");
});
  
$("#read-btns").click(function () {
    $(".read-texts").toggleClass("hidden");
});
  

const newOrderCats = document.getElementById('new-order-cats');

if (newOrderCats) {
    const orderFormCats = document.getElementById('orderform-category');
    var realData = orderFormCats.innerHTML;

    const dCatBtns = document.querySelectorAll('.nwo-cat-btn');
    if (dCatBtns[0]) {
        [...dCatBtns].forEach(btn => {
            btn.addEventListener('click', e => {
                const val = btn.getAttribute('data-change-cat');
                const orderFormCats = document.getElementById('orderform-category');
                const options = document.querySelectorAll('#orderform-category-copy option');

                const dCatbtns = document.querySelectorAll('.nwo-cat-btn');
                [...dCatbtns].forEach(bt => {
                    bt.classList.remove('active');
                });
                btn.classList.add('active');

                const newOptions = [];
                [...options].forEach(el => {
                    if (el.innerText.toLowerCase().includes(val.toLowerCase())) {
                        newOptions.push(el);
                    }
                });
                const newOptionsHtml = [];
                [...newOptions].forEach(el => {
                    newOptionsHtml.push(el.outerHTML);
                });
                orderFormCats.innerHTML = newOptionsHtml.join('');

                $('#orderform-category').trigger('change');
            });
        })
    }
    setTimeout(() => {
        const orderFormCopy = document.createElement('select');
        orderFormCopy.setAttribute('id', 'orderform-category-copy');
        orderFormCopy.style.display = 'none';
        orderFormCopy.innerHTML = realData;
        orderFormCats.parentNode.insertBefore(orderFormCopy, orderFormCats);
    }, 100)
}

const htmlcontents = document.querySelector("BODY");
function colorApp() {
    let mode = localStorage.getItem('platMode');
    if (mode) {
        htmlcontents.classList.toggle(localStorage.getItem('platMode'));
    }
}
colorApp();

var langcontrol = document.getElementsByTagName('html')[0].getAttribute('lang');


if (langcontrol == "tr") {
    var avgdakika = "dk"
    var avgsaat = "saat"
    var veriyok = "Yetersiz veri"
    var sec = "SeÃ§"
    var langmin = "Min"
    var langmax = "Max"
    var langavg = "Ort"
    var langrecommend = "Ã–nerilen"
    var langbestseller = "Ã‡ok satan"
    var langupdated = "GÃ¼ncel"
    var langinstant = "AnlÄ±k"
    var langfast = "HÄ±zlÄ±"
    var langfav = "En Favori"
    var langdrop = "DÃ¼ÅŸÃ¼ÅŸ Yok"
} else if (langcontrol == "en") {
    var avgdakika = "minutes"
    var avgsaat = "hours"
    var veriyok = "Not enough data"
    var sec = "Select"
    var langmin = "Min"
    var langmax = "Max"
    var langavg = "Avg."
    var langrecommend = "Recommended"
    var langbestseller = "Best seller"
    var langupdated = "Updated"
    var langinstant = "Instant"
    var langfast = "Fast"
    var langfav = "Most Favorite" 
	var langdrop = "0% Drop"	
} else if (langcontrol == "ru") {
    var avgdakika = "Ð¼Ð¸Ð½ÑƒÑ‚Ñ‹"
    var avgsaat = "Ñ‡Ð°ÑÑ‹"
    var veriyok = "ÐÐµÐ´Ð¾ÑÑ‚Ð°Ñ‚Ð¾Ñ‡Ð½Ð¾ Ð´Ð°Ð½Ð½Ñ‹Ñ…"
    var sec = "Ð’Ñ‹Ð±Ð¸Ñ€Ð°Ñ‚ÑŒ"
    var langmin = "ÐœÐ¸Ð½"
    var langmax = "ÐœÐ°ÐºÑ"
    var langavg = "Ð¡Ñ€ÐµÐ´Ð½ÐµÐµ."
    var langrecommend = "Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´ÑƒÐµÐ¼Ñ‹Ðµ"
    var langbestseller = "Ð‘ÐµÑÑ‚ÑÐµÐ»Ð»ÐµÑ€"
    var langupdated = "ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¾"
    var langinstant = "ÐœÐ³Ð½Ð¾Ð²ÐµÐ½Ð½Ñ‹Ð¹"
    var langfast = "Ð‘Ñ‹ÑÑ‚Ñ€Ñ‹Ð¹"
    var langfav = "Ð¡Ð°Ð¼Ñ‹Ð¹ Ð»ÑŽÐ±Ð¸Ð¼Ñ‹Ð¹" 
	var langdrop = "0% Ð¿Ð°Ð´ÐµÐ½Ð¸Ðµ"	
} else if (langcontrol == "ko") {
    var avgdakika = "ë¶„"
    var avgsaat = "ì‹œê°„"
    var veriyok = "ë°ì´í„°ê°€ ì¶©ë¶„í•˜ì§€ ì•ŠìŠµë‹ˆë‹¤."
    var sec = "ì„ íƒí•˜ë‹¤"
    var langmin = "ìµœì†Œ"
    var langmax = "ë§¥ìŠ¤"
    var langavg = "í‰ê· ."
    var langrecommend = "ì¶”ì²œ"
    var langbestseller = "ë² ìŠ¤íŠ¸ì…€ëŸ¬"
    var langupdated = "ì—…ë°ì´íŠ¸ë¨"
    var langinstant = "ì¦‰ê°ì ì¸"
    var langfast = "í˜•íƒœ"
    var langfav = "ê°€ìž¥ ì¢‹ì•„í•˜ëŠ”" 
	var langdrop = "0% ë“œë¡­"	
} else if (langcontrol == "fa") {
    var avgdakika = "Ø¯Ù‚Ø§ÛŒÙ‚"
    var avgsaat = "Ø³Ø§Ø¹Øª Ù‡Ø§"
    var veriyok = "Ø¯Ø§Ø¯Ù‡ Ú©Ø§ÙÛŒ Ù†ÛŒØ³Øª"
    var sec = "Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯"
    var langmin = "Ø­Ø¯Ø§Ù‚Ù„"
    var langmax = "Ø­Ø¯Ø§Ú©Ø«Ø±"
    var langavg = "Ù…ÛŒØ§Ù†Ú¯ÛŒÙ†"
    var langrecommend = "ØªÙˆØµÛŒÙ‡ Ø´Ø¯Ù‡"
    var langbestseller = "Ú©ØªØ§Ø¨ Ù¾Ø±ÙØ±ÙˆØ´"
    var langupdated = "Ø¨Ù‡ Ø±ÙˆØ² Ø´Ø¯"
    var langinstant = "ÙÙˆØ±ÛŒ"
    var langfast = "Ø³Ø±ÛŒØ¹"
    var langfav = "Ù…ÙˆØ±Ø¯ Ø¹Ù„Ø§Ù‚Ù‡ ØªØ±ÛŒÙ†" 
	var langdrop = "0 Ø¯Ø±ØµØ¯ Ú©Ø§Ù‡Ø´"	
} else if (langcontrol == "ar") {
    var avgdakika = "Ø¯Ù‚Ø§ÛŒÙ‚"
    var avgsaat = "Ø³Ø§Ø¹Øª Ù‡Ø§"
    var veriyok = "Ø¯Ø§Ø¯Ù‡ Ú©Ø§ÙÛŒ Ù†ÛŒØ³Øª"
    var sec = "Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯"
    var langmin = "Ø­Ø¯Ø§Ù‚Ù„"
    var langmax = "Ø­Ø¯Ø§Ú©Ø«Ø±"
    var langavg = "Ù…ÛŒØ§Ù†Ú¯ÛŒÙ†"
    var langrecommend = "ØªÙˆØµÛŒÙ‡ Ø´Ø¯Ù‡"
    var langbestseller = "Ú©ØªØ§Ø¨ Ù¾Ø±ÙØ±ÙˆØ´"
    var langupdated = "Ø¨Ù‡ Ø±ÙˆØ² Ø´Ø¯"
    var langinstant = "ÙÙˆØ±ÛŒ"
    var langfast = "Ø³Ø±ÛŒØ¹"
    var langfav = "Ù…ÙˆØ±Ø¯ Ø¹Ù„Ø§Ù‚Ù‡ ØªØ±ÛŒÙ†" 
	var langdrop = "0 Ø¯Ø±ØµØ¯ Ú©Ø§Ù‡Ø´"	
} else if (langcontrol == "bp") {
    var avgdakika = "minutos"
    var avgsaat = "horas"
    var veriyok = "NÃ£o hÃ¡ dados suficientes"
    var sec = "Selecione"
    var langmin = "MÃ­n"
    var langmax = "MÃ¡x"
    var langavg = "Avg."
    var langrecommend = "Recomendado"
    var langbestseller = "Best seller"
    var langupdated = "Atualizado"
    var langinstant = "Instante"
    var langfast = "RÃ¡pido"
    var langfav = "Mais favorito" 
	var langdrop = "0% Derrubar"	
}  else if (langcontrol == "de") {
    var avgdakika = "protokoll"
    var avgsaat = "std."
    var veriyok = "nicht genug Daten"
    var sec = "WÃ¤hlen"
    var langmin = "Min"
    var langmax = "Max"
    var langavg = "Dur."
    var langrecommend = "Empfohlen"
    var langbestseller = "Bestseller"
    var langupdated = "Aktualisiert"
    var langinstant = "Sofortig"
    var langfast = "Schnell"
    var langfav = "Am liebsten" 
	var langdrop = "0 % RÃ¼ckgang"	
}  


const selected = document.querySelector(".selected");
const categorymenu = document.querySelector(".categorymenu");
const categorycontent = document.querySelector(".categorycontent");
const servicesmenu = document.querySelector(".servicesmenu");
const searchinput = document.querySelector(".search-input");
const servicescontent = document.querySelector(".servicescontent");
const themesettingsboxcontent = document.querySelector(".themesettingsbox");
const cateboxcontent = document.querySelector(".catebox");
const searboxcontent = document.querySelector(".searbox");
const modalac = document.querySelector(".modalac");
const buybtn = document.querySelector(".buybtn");
const sbuy = document.querySelector(".sbuy");


$(document).ready(function() {
    $('.themebox').click(function() {
        themesettingsboxcontent.classList.toggle("active");
    })
});

$(document).ready(function() {
    $('.closethemebox').click(function() {
        themesettingsboxcontent.classList.toggle("active");
    })
});
$(document).ready(function() {
    $('.catename').click(function() {
        categorycontent.classList.toggle("active");
        categorymenu.classList.toggle("active");
        cateboxcontent.classList.toggle("active");
        searboxcontent.classList.toggle("hidden");
    })
});
$(document).ready(function() {
    $('.categoryname').click(function() {
        categorycontent.classList.toggle("active");
        categorymenu.classList.toggle("active");
        servicesmenu.classList.remove("active");
        servicescontent.classList.remove("active");
        searboxcontent.classList.toggle("hidden");
    })
});

$(document).ready(function() {
    $('.catselect').click(function() {
        categorycontent.classList.remove("active");
        categorymenu.classList.remove("active");
        cateboxcontent.classList.remove("active");
        searboxcontent.classList.remove("hidden");
    })
});

$(document).ready(function() {
    $('.servicesname').click(function() {
        servicescontent.classList.toggle("active");
        servicesmenu.classList.toggle("active");
    })
});

$(document).ready(function() {
    $("#searchcategory").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".select-category").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});


const deletefavcontent = document.querySelector(".deletefav");
const servicefavcontent = document.querySelector(".servicefav");

let favorilist = JSON.parse(localStorage.getItem("favorilist")) || [];
localStorage.setItem("favorilist", JSON.stringify(favorilist));

let favoridurum = JSON.parse(localStorage.getItem("favoridurum")) || [];
localStorage.setItem("favoridurum", JSON.stringify(favoridurum));

function serviceFav(val) {
    favveri = localStorage.getItem('favorilist')
    if (favveri.includes(val || 'veriyok')) {
    } else {
        var favoriID = `${val}`
        var catID =  window.modules.siteOrder.services[val].cid
        var cid = `c${catID}c`
        let favorilist = JSON.parse(localStorage.getItem("favorilist")) || [];
        var newItem = {
            favori: favoriID, favoricategory: cid,
        }
        var unique = [];
        for (i = 0; i < val.length; i++) {
            if (unique.indexOf(val[i]) === -1) {
                unique.push(val[i])
            }
        }
        favorilist.push(newItem)
        localStorage.setItem("favorilist", JSON.stringify(favorilist));
    }
}

function servicesFav(val) {
    favveri = localStorage.getItem('favorilist')
    if (favveri.includes(val || 'veriyok')) {
    } else {
        var favoriID = `${val}`
        var catid = "catid";
        var cdata = [catid] + [val]
        var sercats = window[cdata]
        var cid = `c${sercats}`
        let favorilist = JSON.parse(localStorage.getItem("favorilist")) || [];
        var newItem = {
            favori: favoriID, favoricategory: cid,
        }
        var unique = [];
        for (i = 0; i < val.length; i++) {
            if (unique.indexOf(val[i]) === -1) {
                unique.push(val[i])
            }
        }
        favorilist.push(newItem)
        localStorage.setItem("favorilist", JSON.stringify(favorilist));
    }
    
    servicesFavori()
}

function servicesFavori() {
    data = JSON.parse(localStorage.getItem("favorilist")) || [];
    $('.deletefav').css("display", "none");
    if (data.includes(sid)) {
        $('.deletefav').css("display", "flex");
        $('.servicefav').css("display", "none");
    } else {
        $('.deletefav').css("display", "none");
        $('.servicefav').css("display", "flex");
    }
    for (var i in data) {
        var row = data[i];
        var sid = row.favori;
        var verifav = JSON.stringify(sid)
        if (verifav.includes(sid)) {
            $('.sfav' + [sid]).css("display", "none");
            $('.sdel' + [sid]).css("display", "flex");
        } else {
            $('.sfav' + [sid]).css("display", "flex");
            $('.sdel' + [sid]).css("display", "none");
        }
    }
}

servicesFavori()


function deleteFav(val) {
    var delval = val
    var result = JSON.parse(localStorage.getItem('favorilist'));
    result = result.filter(val => val.favori !== `${delval}`)
    localStorage.setItem("favorilist", JSON.stringify(result));
    servicesFavori()
    favcontrol()
    setList(0);
    setList(1);

}

function favListele() {
   localStorage.setItem("favoridurum", JSON.stringify('active'));
   favcontrol()
   setList(0);
   setList(1);
   favveri = localStorage.getItem('favorilist')
   if (favveri == "[]") {
    }else {
       count = favveri.split('"')
       var serdata = count[3];
       var s_cid = window.modules.siteOrder.services[serdata].cid
       selectCategory(s_cid)
    }
}
function tamListele() {
   localStorage.setItem("favoridurum", JSON.stringify('close'));
   setList(0);
   setList(1);
   favcontrol()
}
function favcontrol() {
    favveri = localStorage.getItem('favorilist')
    favdurumlist = localStorage.getItem('favoridurum')
    if (favdurumlist.includes('active')) {
        if (favveri == "[]") {
            $('.favcontrol').css("display", "flex");
        }else {
            $('.favcontrol').css("display", "none");
        }
    }else{
        $('.favcontrol').css("display", "none");
    }  
}
favcontrol()

var control = window.location.href;
var dizin = window.location.pathname;


if (dizin == "/" || dizin.includes('order/')) {
    $(document).ready(function() {
        setList(0);
        setList(1);
    
    });
    
    function ikon(opt) {
        var ikon = "";
        if (opt.indexOf("Instagram") >= 0) {
            ikon = "<i class=\"fab fa-instagram\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("YouTube") >= 0) {
            ikon = "<i class=\"fab fa-youtube\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Facebook") >= 0) {
            ikon = "<i class=\"fab fa-facebook-square\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Youtube") >= 0) {
            ikon = "<i class=\"fab fa-youtube\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Twitter") >= 0) {
            ikon = "<i class=\"fab fa-twitter\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Google") >= 0) {
            ikon = "<i class=\"fab fa-google-plus\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Swarm") >= 0) {
            ikon = "<i class=\"fab fa-forumbee\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Dailymotion") >= 0) {
            ikon = "<i class=\"fab fa-hospital-o\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Periscope") >= 0) {
            ikon = "><i class=\"fab fa-map-marker\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Soundcloud") >= 0) {
            ikon = "<i class=\"fab fa-soundcloud\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Vine") >= 0) {
            ikon = "<i class=\"fab fa-vine\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Spotify") >= 0) {
            ikon = "<i class=\"fab fa-spotify\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Snapchat") >= 0) {
            ikon = "<i class=\"fab fa-snapchat-square\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Pinterest") >= 0) {
            ikon = "<i class=\"fab fa-pinterest-p\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("iTunes") >= 0) {
            ikon = "<i class=\"fab fa-apple\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("MÃ¼zik") >= 0) {
            ikon = "<i class=\"fab fa-music\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Vimeo") >= 0) {
            ikon = "<i class=\"fab fa-vimeo\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("EkÅŸi") >= 0) {
            ikon = "<i class=\"fab fa-tint\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Telegram") >= 0) {
            ikon = "<i class=\"fab fa-telegram\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Twitch") >= 0) {
            ikon = "<i class=\"fab fa-twitch\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Zomato") >= 0) {
            ikon = "<i class=\"fab fa-cutlery\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Amazon") >= 0) {
            ikon = "<i class=\"fab fa-amazon\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Tumblr") >= 0) {
            ikon = "<i class=\"fab fa-tumblr-square\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Yandex") >= 0) {
            ikon = "<i class=\"fab fa-yoast\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("LinkedIn") >= 0) {
            ikon = "<i class=\"fab fa-linkedin\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Yahoo") >= 0) {
            ikon = "<i class=\"fab fa-yahoo\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("TikTok") >= 0) {
            ikon = "<i class=\"fab fa-tiktok\" aria-hidden=\"true\"></i>";
        } else if (opt.indexOf("Clubhouse") >= 0) {
            ikon = "<i class=\"fa fa-gem\" aria-hidden=\"true\"></i>";
        } else {
            ikon = "<span class=\"\"><i class=\"far fa-star\" aria-hidden=\"true\"></i>  ";
        }
        return ikon;
    }
    
    function setList(val) {
    
        if (val == 0) {
            $("#orders-drop").empty();
            $("#orderform-service option").each(function() {
    
                service_id = $(this).val();
var s_id = service_id;
var s_cid = window.modules.siteOrder.services[service_id].cid;
var s_name = window.modules.siteOrder.services[service_id].name;
var s_min = window.modules.siteOrder.services[service_id].min;
var s_max = window.modules.siteOrder.services[service_id].max;
var s_price = window.modules.siteOrder.services[service_id].price;
var s_average = window.modules.siteOrder.services[service_id].average_time;
var s_description = window.modules.siteOrder.services[service_id].description;
var selectcurrency = window.modules.siteOrder.currency.template;

var cevir = s_price;
var sprice = parseFloat(cevir).toFixed(2);

// Ensure `{{value}}` exists before replacing
if (typeof selectcurrency === "string" && selectcurrency.includes("{{value}}")) {
    selectcurrency = selectcurrency.replace("{{value}}", sprice);
} else {
    console.error("Error: {{value}} not found in selectcurrency", selectcurrency);
}

// Debugging
console.log("Updated Currency Format:", selectcurrency);



                var str = s_description
                if (str === null) {
                    str = " ";
                }
              
                var sname = s_name
                
                hottednames = sname
                var hotted = ""
                if (hottednames.includes('ðŸ”¥')) {
                    hotted += '<span class="hit"></span>';
                }    

                if (s_max < 5000) {
                    s_maxrenk = '<span style="color:var(--tp-color-red)">' + s_max + '</span>'
                } else if (s_max < 10000) {
                    s_maxrenk = '<span style="color:var(--tp-color-orange)">' + s_max + '</span>'
                } else if (s_max < 100000) {
                    s_maxrenk = '<span style="color:var(--tp-color-yellow)">' + s_max + '</span>'
                } else if (s_max < 1000000) {
                    s_maxrenk = '<span style="color:var(--tp-color-blue)">' + s_max + '</span>'
                } else if (s_max < 10000000) {
                    s_maxrenk = '<span style="color:var(--tp-color-cyan)">' + s_max + '</span>'
                } else if (s_max < 100000000) {
                    s_maxrenk = '<span style="color:var(--tp-color-green)">' + s_max + '</span>'
                } else if (s_max < 1000000000000) {
                    s_maxrenk = '<span style="color:var(--tp-color-green)">' + s_max + '</span>'
                }
    
    
                saverage = s_average.split(avgsaat)
    
                var sersure = s_average
                if (saverage[0] < 10) {
                    sersure = '<span style="color:var(--tp-color-green);">' + s_average + '</span>';
                } else if (saverage[0] < 15) {
                    sersure = '<span style="color:var(--tp-color-blue);">' + s_average + '</span>';
                } else if (saverage[0] < 20) {
                    sersure = '<span style="color:var(--tp-color-yellow);">' + s_average + '</span>';
                } else if (saverage[0] > 20) {
                    sersure = '<span style="color:var(--tp-color-red);">' + s_average + '</span>';
                } else if (saverage[0] == veriyok) {
                    sersure = '<span style="color:var(--tp-color-red);">' + s_average + '</span>';
                } else if (sersure.includes(avgdakika)) {
                    sersure = '<span style="color:var(--tp-color-green);">' + s_average + '</span>';
                }
    
    
    
                matches = str.split('~')
    
                var servicefeature = ""
                if (matches.includes('recommended')) {
                    servicefeature += '<span style="background:var(--tp-color-green2);"><i class="fa fa-thumbs-up"></i>' + langrecommend + '</span>';
                }
                if (matches.includes('bestseller')) {
                    servicefeature += '<span style="background:var(--tp-color-blue);"><i class="fas fa-stars"></i>' + langbestseller + '</span>';
                }
                if (matches.includes('updated')) {
                    servicefeature += '<span style="background:var(--tp-color-yellow);"><i class="fas fa-waveform-path"></i>' + langupdated + '</span>';
                }
                if (matches.includes('instant')) {
                    servicefeature += '<span style="background:var(--tp-color-red);"><i class="fas fa-shipping-fast"></i>' + langinstant + '</span>';
                }
                if (matches.includes('fast')) {
                    servicefeature += '<span style="background:var(--tp-color-blue);"><i class="fa fa-clock"></i>' + langfast + '</span>';
                }
                if (matches.includes('favorite')) {
                    servicefeature += '<span style="background:var(--tp-color-gold);color:#171f2e"><i class="fa fa-star"></i>' + langfav + '</span>';
                }
                if (matches.includes('drop')) {
                    servicefeature += '<span style="background:var(--tp-color-green2)"><i class="fa fa-arrow-down"></i>' + langdrop + '</span>';
                }                
                if (matches.includes('off')) {
                    servicefeature += '<img src="https://storage.perfectcdn.com/a3vltc/iswpawojtko2cjyd.png" width="36">';
                }				
                if (matches.includes('undefined')) {
                    servicefeature = ' ';
                }
    
                favveri = localStorage.getItem('favorilist')
                if (favveri.includes(service_id || 'veriyok' || '')) {
                    var delcontent = "active"
                    var favcontent = "hidden"
                } else {
                    var delcontent = "hidden"
                    var favcontent = "active"
                }
                favdurumlist = localStorage.getItem('favoridurum')
                if (favdurumlist.includes('active')) {
                    $('.serfav').css({"background-color": "var(--tp-color-cyan)", "color": "white"});
                    $('.allfav').css({"background-color": "var(--tp-color-200)", "color": "var(--tp-color-500)"});
                    if (favveri.includes(service_id || 'veriyok' || '')) {
                        var servicecontent = ""
                    }else {
                        var servicecontent = "hidden"
                    }
                }else{
                    $('.serfav').css({"background-color": "var(--tp-color-200)", "color": "var(--tp-color-500)"});
                    $('.allfav').css({"background-color": "var(--tp-color-cyan)", "color": "white"});
                }
                
    
    
                if ($(this).attr('data-show') != 'hidden') {
                    var ico = ikon($(this).text());
                    $("#orders-drop").append(`<button type="button" class="servicebox sclr${s_id} ${servicecontent}" onclick="selectOrder(${s_id})" ><div class="servicetop"><div class="sertops"><div class="servicename">${ico} ${s_name} ${hotted} </div></div><div><div class="servicedetail"><div class="min-maxs"><div class="serviceid srcsp"> Rate : <span class="color"> ${selectcurrency} </span></div></div><div class="serviceaverage srcsp">${langavg} : <span class="color">${sersure} </span></div></div></div></div><div class="servicebottom"><div class="servicespeed">${servicefeature}</div></div></button>`);
                }
            });
            $("#services-drop").empty();
            $("#orderform-service option").each(function() {
    
                service_id = $(this).val();
var s_id = service_id;
var s_cid = window.modules.siteOrder.services[service_id].cid;
var s_name = window.modules.siteOrder.services[service_id].name;
var s_min = window.modules.siteOrder.services[service_id].min;
var s_max = window.modules.siteOrder.services[service_id].max;
var s_price = window.modules.siteOrder.services[service_id].price;
var s_average = window.modules.siteOrder.services[service_id].average_time;
var s_description = window.modules.siteOrder.services[service_id].description;
var selectcurrency = window.modules.siteOrder.currency.template;

var cevir = s_price;
var sprice = parseFloat(cevir).toFixed(2);

// Ensure `{{value}}` exists before replacing
if (typeof selectcurrency === "string" && selectcurrency.includes("{{value}}")) {
    selectcurrency = selectcurrency.replace("{{value}}", sprice);
} else {
    console.error("Error: {{value}} not found in selectcurrency", selectcurrency);
}

// Debugging
console.log("Updated Currency Format:", selectcurrency);



               var str = s_description
                if (str === null) {
                    str = " ";
                }

                var sname = s_name
                
                hottednames = sname
                var hotted = ""
                if (hottednames.includes('ðŸ”¥')) {
                    hotted += '<span class="hit"></span>';
                }
            
                if (s_max < 5000) {
                    s_maxrenk = '<span style="color:var(--tp-color-red)">' + s_max + '</span>'
                } else if (s_max < 10000) {
                    s_maxrenk = '<span style="color:var(--tp-color-orange)">' + s_max + '</span>'
                } else if (s_max < 100000) {
                    s_maxrenk = '<span style="color:var(--tp-color-yellow)">' + s_max + '</span>'
                } else if (s_max < 1000000) {
                    s_maxrenk = '<span style="color:var(--tp-color-blue)">' + s_max + '</span>'
                } else if (s_max < 10000000) {
                    s_maxrenk = '<span style="color:var(--tp-color-cyan)">' + s_max + '</span>'
                } else if (s_max < 100000000) {
                    s_maxrenk = '<span style="color:var(--tp-color-green)">' + s_max + '</span>'
                } else if (s_max < 1000000000000) {
                    s_maxrenk = '<span style="color:var(--tp-color-green)">' + s_max + '</span>'
                }
    
    
                saverage = s_average.split(avgsaat)
    
                var sersure = s_average
                if (saverage[0] < 10) {
                    sersure = '<span style="color:var(--tp-color-green);">' + s_average + '</span>';
                } else if (saverage[0] < 15) {
                    sersure = '<span style="color:var(--tp-color-blue);">' + s_average + '</span>';
                } else if (saverage[0] < 20) {
                    sersure = '<span style="color:var(--tp-color-yellow);">' + s_average + '</span>';
                } else if (saverage[0] > 20) {
                    sersure = '<span style="color:var(--tp-color-red);">' + s_average + '</span>';
                } else if (saverage[0] == veriyok) {
                    sersure = '<span style="color:var(--tp-color-red);">' + s_average + '</span>';
                } else if (sersure.includes(avgdakika)) {
                    sersure = '<span style="color:var(--tp-color-green);">' + s_average + '</span>';
                }
    
    
    
                matches = str.split('~')
    
                var servicefeature = ""
                if (matches.includes('recommended')) {
                    servicefeature += '<span style="background:var(--tp-color-green2);"><i class="fa fa-thumbs-up"></i>' + langrecommend + '</span>';
                }
                if (matches.includes('bestseller')) {
                    servicefeature += '<span style="background:var(--tp-color-blue);"><i class="fas fa-stars"></i>' + langbestseller + '</span>';
                }
                if (matches.includes('updated')) {
                    servicefeature += '<span style="background:var(--tp-color-yellow);"><i class="fas fa-waveform-path"></i>' + langupdated + '</span>';
                }
                if (matches.includes('instant')) {
                    servicefeature += '<span style="background:var(--tp-color-red);"><i class="fas fa-shipping-fast"></i>' + langinstant + '</span>';
                }
                if (matches.includes('fast')) {
                    servicefeature += '<span style="background:var(--tp-color-blue);"><i class="fa fa-clock"></i>' + langfast + '</span>';
                }
                if (matches.includes('favorite')) {
                    servicefeature += '<span style="background:var(--tp-color-gold);color:#171f2e"><i class="fa fa-star"></i>' + langfav + '</span>';
                }              
				if (matches.includes('drop')) {
                    servicefeature += '<span style="background:var(--tp-color-green2)"><i class="fa fa-arrow-down"></i>' + langdrop + '</span>';
                } 
                if (matches.includes('off')) {
                    servicefeature += '<img src="https://storage.perfectcdn.com/a3vltc/iswpawojtko2cjyd.png" width="36">';
                }				
                if (matches.includes('undefined')) {
                    servicefeature = ' ';
                }
    
                favveri = localStorage.getItem('favorilist')
                if (favveri.includes(service_id || 'veriyok' || '')) {
                    var delcontent = "active"
                    var favcontent = "hidden"
                } else {
                    var delcontent = "hidden"
                    var favcontent = "active"
                }
                favdurumlist = localStorage.getItem('favoridurum')
                if (favdurumlist.includes('active')) {
                    $('.serfav').css({"background-color": "var(--tp-color-cyan)", "color": "white"});
                    $('.allfav').css({"background-color": "var(--tp-color-200)", "color": "var(--tp-color-500)"});
                    if (favveri.includes(service_id || 'veriyok' || '')) {
                        var servicecontent = ""
                    }else {
                        var servicecontent = "hidden"
                    }
                }else{
                    $('.serfav').css({"background-color": "var(--tp-color-200)", "color": "var(--tp-color-500)"});
                    $('.allfav').css({"background-color": "var(--tp-color-cyan)", "color": "white"});
                }
    
    
                if ($(this).attr('data-show') != 'hidden') {
                    var ico = ikon($(this).text());
                    $("#services-drop").append(`<button type="button" class="servicebox sclr${s_id} ${servicecontent}" onclick="selectOrder(${s_id})" ><div class="servicetop"><div class="sertops"><div class="servicename">${ico} ${s_name} ${hotted} </div></div><div><div class="servicedetail"><div class="min-maxs"><div class="serviceid srcsp"> Rate : <span class="color"> ${selectcurrency} </span></div></div><div class="serviceaverage srcsp">${langavg} : <span class="color">${sersure} </span></div></div></div></div><div class="servicebottom"><div class="servicespeed">${servicefeature}</div></div></button>`);
                }
            });
            var e = document.getElementById("orderform-service");
            var selected = e.options[e.selectedIndex].text;
            var ico = ikon(selected);
            var str = selected
            matches = str.match(/[^~]+/g);
            var servicename = matches[0];
            $("#order-services").html(ico + servicename);
    
            $("#orderform-service").change(function() {
                service_id = $(this).val();
                $('.sclr' + [service_id]).css("border-color", "var(--color-7)");
            })
    
    
        } else if (val == 1) {
    
            $("#category-drop").empty();
            $("#orderform-category option").each(function() {
    
    
                var icon = "ikon";
                category_id = $(this).val();
                var cdata = [icon] + [category_id]
                var ikons = window[cdata]
                $("#caticon").html(ikons);
                
                favveri = localStorage.getItem('favorilist')
                favdurumlist = localStorage.getItem('favoridurum')
                catID = `c${category_id}c`
                if (favdurumlist.includes('active')) {
                    if (favveri.includes(catID)) {
                        var catcontent = ""
                    }else {
                        var catcontent = "hidden"
                    }
                }
    
                if ($(this).attr('data-show') != 'hidden') {
                    var ico = ikon($(this).text());
                    $("#category-drop").append('<button type="button" class="categoryselect select-category ct' + $(this).val() + ' '+ catcontent +'" onclick="selectCategory(' + $(this).val() + ')">' + ikons + $(this).text() + '</button>');
                }
            });
    
            var e = document.getElementById("orderform-category");
            var selected = e.options[e.selectedIndex].text;
            $("#order-category").html(selected);
    
        }
    }
    
    
    $(function(ready) {
        $("#orderform-service").change(function() {
            setList(0);
        });
        $("#orderform-category").change(function() {
            setList(1);
        });
    });
}
function buyselect() {
    var element = document.getElementById("scrollfield");
    element.scrollIntoView({
        block: 'start',
        inline: 'start',
        margin: '50% 0 50%'
    });
    buybtn.classList.remove("active");
    sbuy.classList.add("active");
}

function selectOrder(val) {
    $('#orderform-service').val(val);
    $("#orderform-service").trigger("change");
    $('.sclr' + [val]).css("border-color", "var(--tp-color-cyan)");
    var ico = ikon($("#orderform-service option[value='" + val + "']").text());
    $("#order-services").html(ico + $("#orderform-service option[value='" + val + "']").text());
    servicesmenu.classList.remove("active");
    servicescontent.classList.remove("active");
    buybtn.classList.add("active");
}
$("#order-sItem").click(function() {
    $("#order-services").html($(this).html());
});

function selectCategory(val) {
    $('#orderform-category').val(val);
    $("#orderform-category").trigger("change");
    var ico = ikon($("#orderform-category option[value='" + val + "']").text());
    $("#order-category").html($("#orderform-category option[value='" + val + "']").text());
    categorymenu.classList.remove("active");
    categorycontent.classList.remove("active");
    servicesmenu.classList.remove("active");
    servicescontent.classList.remove("active");
}

function selectCategory(val) {
    $('#orderform-category').val(val);
    $("#orderform-category").trigger("change");
    var ico = ikon($("#orderform-category option[value='" + val + "']").text());
    $("#order-category").html($("#orderform-category option[value='" + val + "']").text());
    categorymenu.classList.remove("active");
    categorycontent.classList.remove("active");
    servicesmenu.classList.remove("active");
    servicescontent.classList.remove("active");
}
const descriptionsdiv = document.querySelector(".description");
$("#orderform-service").change(function() {
    service_id = $(this).val();
    sdescription = window.modules.siteOrder.services[service_id].description
    sname = window.modules.siteOrder.services[service_id].name
    average = window.modules.siteOrder.services[service_id].average_time
    var str = sdescription
    if (str === null) {
        str = ' ';
    }
    matches = str.match(/[^~]+/g);
    var servicedescription = matches[0];
    $("#s_description").html(servicedescription);
    $("#s_descriptionmaster").html(servicedescription);
    $("#s_name").html(sname);
    $("#s_sure").html(average);
})


$(document).ready(function() {
    $('.categorybox').click(function() {
        $('.servicesbox').toggleClass('hidden');
    })
});

$(document).ready(function() {
    $('.category-dropdown-header i').click(function() {
        $('.categorymenu').removeClass('active');
        $('.categorycontent').removeClass('active');
    })
});

$(document).ready(function() {
    $('.services-dropdown-header i').click(function() {
        $('.servicesmenu').removeClass('active');
        $('.servicescontent').removeClass('active');
    })
});

$(document).ready(function() {
    $('.tn-item').each(function() {
        var $title = $(this).find('.tn-text');
        
        if ($title.length && $.trim($title.text()) !== '') {
            $(this).removeClass('hidden');
        }
    });
});

$('.tn-btn').each(function() {
    var link = $(this).find('a');
    if (link.text().trim() !== '') {
        $(this).removeClass('hidden');
    } else {
        $(this).addClass('hidden');
    }
});
