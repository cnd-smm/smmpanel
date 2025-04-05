  function searchID() {
            var service = $('#input_service').val();
            let errorSender = document.getElementById('error_search');
            let errorMsg = ` <div class="alert alert-dismissible alert-danger">
            <button type="button" class="btn-close" data-bs-dismiss="alert"
                                        aria-label="Close"></button>
      Opps.. Wrong Services Id. Check services id and try again.
   </div>`;
            try {
                var selectSerCatID = window.modules.siteOrder.services[service].cid;
            }
            catch (err) {
                errorSender.innerHTML = errorMsg;
            }

            let orderCat = document.getElementById('orderform-category');
            let orderSer = document.getElementById('orderform-service');


            if (selectSerCatID) {
                errorSender.innerHTML = '';
                $(function () {
                    orderCat.querySelector('[selected]').removeAttribute('selected');
                    console.log(selectSerCatID);
                    orderCat.querySelector('[value="' + selectSerCatID + '"]').setAttribute('selected', 'selected');
                    orderCat.value = selectSerCatID;

                    var event = document.createEvent('HTMLEvents');
                    event.initEvent('change', true, false);
                    orderCat.dispatchEvent(event);
                    setTimeout(() => {
                        let controlSel = orderSer.querySelector('[selected]')
                        if (controlSel) {
                            controlSel.removeAttribute('selected');
                        }
                        // console.log(service);
                        orderSer.querySelector('[value="' + service + '"]').setAttribute('selected', 'selected');
                        orderSer.value = service;
                        orderSer.dispatchEvent(event);
                    }, 1000);
                    $('#pills-tab li:first-child button').tab('show');
                });
            }
        }
        
        function themeModeToggle() {
            const smmsunCurrentMode = localStorage.getItem('smmsunCurrentMode');
            const bodyFire = document.getElementById('body');
            const modeIcon = document.getElementById('modeToggler');

            if (smmsunCurrentMode) {
                localStorage.removeItem('smmsunCurrentMode');
                bodyFire.classList.remove('nightmode');
                modeIcon.innerHTML = `<i class="fas fa-moon"></i>`;
            } else {
                localStorage.setItem('smmsunCurrentMode', 'nightmode');
                bodyFire.classList.add('nightmode');
                modeIcon.innerHTML = `<i class="fas fa-sun"></i>`;
            }
        }
        
          $('#orderform-service').on('change', function () {
            setTimeout(function () {
                let mainTime = $('#field-orderform-fields-average_time').val();
                document.getElementById('avarage_time').innerHTML = mainTime;
            }, 100)
        });
