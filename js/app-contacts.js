document.addEventListener("DOMContentLoaded", function(){
    
    //Pobranie danych z serwera    
    var contacts = null;
    $.ajax({
            url: "./php/getContacts.php"

            }).done(function(response){
                contacts = JSON.parse(response);
                
            }).fail(function(error) {
                console.log(error)
            });    
    
    //Wysyłanie danych na serwer
    function sendData(){
    $.ajax({ 
                url: "./php/putContacts.php",
                dataType: 'json',
                type: 'POST',
                data: JSON.stringify(contacts)

            }).done(function(response){

            }).fail(function(error) {
                console.log(error)
            })        
    }

    
    //Deklaracja zmiennych
    var addContact = document.querySelector('.addContact');
    var ul = document.querySelector('.contactList');
    
    var fullScreen = document.querySelector('.fullScreen');
    var form = document.querySelector('#newEventForm');
    var cancel = document.querySelector('.cancel');
    var create = document.querySelector('.create');
    var boxHeader = create.querySelector('.boxHeader');
    var createError = create.querySelector('.fail');
    var createErrorList = createError.querySelector('p');
    
    var inputName = form.querySelector('#name');
    var inputSurname = form.querySelector('#surname');
    var inputPhone = form.querySelector('#phone');
    var inputEmail = form.querySelector('#email');
    var inputDate = form.querySelector('#date');
    var inputAddress = form.querySelector('#address');
    var inputCity = form.querySelector('#city');
    var inputCountry = form.querySelector('#country');
    
    function clearPolls(){
        inputName.value = '';
        inputSurname.value = '';
        inputPhone.value = '';
        inputEmail.value = '';
        inputDate.value = '';
        inputAddress.value = '';
        inputCity.value = '';
        inputCountry.value = '';
    }
    
    //funkcja sprawdzająca ilość dni w miesiącu
    function checkMonth(month, year){ 
        
        var amountOfDays = [31, ((year%4 == 0) ? amountOfDays = 29 : amountOfDays = 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        amountOfDays = amountOfDays[month];
        
        return amountOfDays;
    }
    
    //sprawdzenie poprawności zapisanej daty
    function checkdate(newDate){
        var year = parseInt(newDate.substring(0,4));
        var month = parseInt(newDate.substring(5,7));
        var day = parseInt(newDate.substring(8,10));
        
        month = month-1;
        checkMonth(month, year);
        if(newDate == ''){
            return true;
        } else if(isNaN(year) || isNaN(month) || isNaN(day) || newDate.substring(4,5) != '-' || newDate.substring(7,8) != '-' ){
            return false;
        } else if (year<1000 || year>9999 || month<0 || month>11){
            return false;
        } else if (day < 1 || day > checkMonth(month, year)){
            return false;
        } else {
            return true;
        }
    }
    
    //sortowanie elementów alfabetcznie wg nazwiska
    function sortBySurname(){
        var allLi = ul.querySelectorAll('li');
        
        for(var i=0; i < allLi.length; i++){
            ul.removeChild(allLi[i]);
        }
        
        contacts.sort(function(a, b) {
            var nameA=a.surname.toLowerCase();
            var nameB=b.surname.toLowerCase();
            return nameA.localeCompare(nameB);
        });
        
        for(var i=0; i<contacts.length; i++){
            createItem(contacts[i])
        }
        sendData();
    };
    
    function renewID(){
        var allLi = ul.querySelectorAll('li');
        
        for(var i=0; i<allLi.length; i++){
            allLi[i].setAttribute('data-id', i);
        }
    }
    
    //dodawanie nowego elementu do listy
    function createItem(newContact){
            
            var li = document.createElement('li');
        
            var p = document.createElement('p');
            p.innerText = newContact.surname+" "+newContact.name;
            p.classList.add('newContactHeader');
            li.appendChild(p);
            
            var details = document.createElement('div');
            details.classList.add('newContact');
            li.appendChild(details);
        
            var table = document.createElement('table');
            table.innerHTML= '<tr><td>Name:</td><td>'+newContact.name+'</td></tr><tr><td>Surname:</td><td>'+newContact.surname+'</td></tr><tr><td>Phone:</td><td>'+newContact.phone+'</td></tr><tr><td>E-mail:</td><td title="'+newContact.email+'">'+newContact.email+'</td></tr><tr><td>Date of birth:</td><td>'+newContact.dateOfBirth+'</td></tr><tr><td>Address</td><td>'+newContact.address+'</td></tr><tr><td>City</td><td>'+newContact.city+'</td></tr><tr><td>Country</td><td>'+newContact.country+'</td></tr>';
        
            details.appendChild(table);    
            
            var del = document.createElement('div')
            del.innerText='Delete';
            details.appendChild(del);
        
            var edit = document.createElement('div');
            edit.innerText='Edit';
            details.appendChild(edit);
            
            p.addEventListener('click', function(){
                var allDetails = $(ul).find('.newContact').not(details).slideUp(500);
                var allContactHeader = $(ul).find('.newContactHeader').not($(this)).removeClass('open');

                $(details).slideToggle(500);
                this.classList.toggle('open');
            });
        
            ul.appendChild(li);


            edit.addEventListener('click', function(){
                boxHeader.innerText = "Edit contact";
                $(fullScreen).fadeIn(500);
                form.setAttribute('data-edit',li.getAttribute('data-id'));
                inputName.value = newContact.name;
                inputSurname.value = newContact.surname;
                inputPhone.value = newContact.phone;
                inputEmail.value = newContact.email;
                inputDate.value = newContact.dateOfBirth;
                inputAddress.value = newContact.address;
                inputCity.value = newContact.city;
                inputCountry.value = newContact.country;
            });

            del.addEventListener('click', function(){
                contacts.splice(li.getAttribute('data-id'),1);
                sendData();
                this.parentElement.parentElement.parentElement.removeChild(li);
                renewID();
            });   
    }
    
    setTimeout(function(){
      for(var i=0; i<contacts.length; i++){
        createItem(contacts[i])
      }
      renewID();
    }, 500);

    addContact.addEventListener('click', function(){
        boxHeader.innerText = "Add contact";
        $(fullScreen).fadeIn(500);
    });
    
    
    
    form.addEventListener('submit', function(e){
        e.preventDefault();
        
        var inputNameValue = inputName.value;
        var inputSurnameValue = inputSurname.value;
        var inputPhoneValue = inputPhone.value;
        var inputEmailValue = inputEmail.value;
        var inputDateValue = inputDate.value;
        var inputAddressValue = inputAddress.value;
        var inputCityValue = inputCity.value;
        var inputCountryValue = inputCountry.value;
        
        if(inputNameValue.length < 3 || inputDateValue.length > 15){
            
            $(createError).fadeIn(500);
            createErrorList.innerText = "Name is too short or too long. Minimum length: 3, maximum length: 15.";
            
        } else if(inputSurnameValue.length < 3 || inputSurnameValue.length > 30){
            $(createError).fadeIn(500);
            createErrorList.innerText = "Surname is too short or too long. Minimum length: 3, maximum length: 30.";
            
        } else if(inputPhoneValue.length < 9 && inputPhoneValue.length > 0){
            
            $(createError).fadeIn(500);
            createErrorList.innerText = "Phone number must have exactly 9 digits.";

        } else if(isNaN(parseInt(inputPhoneValue)) && inputPhoneValue.length > 0){
            
            $(createError).fadeIn(500);
            createErrorList.innerText = "Phone number must be a number.";
        
        } else if(inputEmailValue.length > 0 && ((inputEmailValue.indexOf('@') == -1) || (inputEmailValue.indexOf('.') == -1))){
            
            $(createError).fadeIn(500);
            createErrorList.innerText = "Correct your address e-mail.";
            
        } else if(!checkdate(inputDateValue)){
            $(createError).fadeIn(500);
            createErrorList.innerText = "Check date. Correct format: YYYY-MM-DD";
            
        } else if(inputAddressValue.length > 40){
            $(createError).fadeIn(500);
            createErrorList.innerText = "Address is too long. Maximum length: 40.";
                
        } else if(inputCityValue.length > 30){
            $(createError).fadeIn(500);
            createErrorList.innerText = "City is too long. Maximum length: 30.";
            
        } else if(inputCityValue.length > 30){
            $(createError).fadeIn(500);
            createErrorList.innerText = "Country is too long. Maximum length: 30.";
            
        } else {
            
            $(createError).fadeOut(500);
            
            var newContact = {
                name: inputName.value,
                surname: inputSurname.value,
                phone: inputPhone.value,
                email: inputEmail.value,
                dateOfBirth: inputDate.value,
                address: inputAddress.value,
                city: inputCity.value,
                country: inputCountry.value
            };
            
            if(form.getAttribute('data-edit') == 'false'){
                contacts.push(newContact);
                createItem(newContact);
                sortBySurname();
                renewID();
                
            } else {
                contacts[form.getAttribute('data-edit')] = newContact;
                sortBySurname();
                renewID();
            };

            $(fullScreen).fadeOut(500);
            form.setAttribute('data-edit', false);
            clearPolls();
        }
    });
    
    cancel.addEventListener('click', function(){
        $(fullScreen).fadeOut(500);
        form.setAttribute('data-edit', false);
        clearPolls();
    });
    
    createError.addEventListener('click', function(){
        $(this).fadeOut(500);
    });
    
    window.addEventListener('click', function(){
        $(createError).fadeOut(500);
    });
    
    
    //Sticky menu
    var nav = $('header');
    var menu = nav.find('ul');
    var top = nav.position().top;
    
    $(window).on('scroll', function(){
        var distanceTop = $(document).scrollTop();
        
        (distanceTop > top) ? nav.addClass('sticky') : nav.removeClass('sticky'); 
    });
    
    $(window).on('resize', function(){
        var distanceTop = $(document).scrollTop();
        
        top = nav.position().top;
        
        (distanceTop > top) ? nav.addClass('sticky') : nav.removeClass('sticky');
    });
    
    nav.find('p').on('click', function(){
        location.href = './index.html'
    });
    
    menu.on('mouseenter', function(){
        $(this).children().slideDown(500);
    })
    
    menu.on('mouseleave', function(){
        $(this).children().finish().slideUp(500);
    })
});