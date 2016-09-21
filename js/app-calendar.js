document.addEventListener("DOMContentLoaded", function(){
    
//Funkcja odpowiedzialna za pobranie aktualnej daty z serwera    
var newDate = function(){
    var tmp = null;
    $.ajax({
        'async': false,
        'url': "./php/date.php",
        'data': {},
        'success': function(data){
            tmp = data;
        }
    });
    
    return tmp;
}();
    
//Pobranie wydarzeń z serwera    
var events = null;
$.ajax({
        url: "./php/getEvent.php"
            
        }).done(function(response){
            events = JSON.parse(response);

        }).fail(function(error) {
           console.log(error)
        });

//Wyszukiwanie elementów na stronie
var cells = document.querySelectorAll('td > p');
var firstCells = document.querySelectorAll('tr > td:first-child > p');  //wyszukanie wszystkich pierwszych dni tygodnia
var body = document.querySelector('body');

var showMonthName = document.querySelector('.month');
var btnPrev = document.querySelector('.prev');
var btnNext = document.querySelector('.next');
    
var remove = [];
    
//Ustawienia wartości początkowych
var actualDate = new Date(newDate*1000); //pobranie wartości aktualnej daty/bieżącego dnia
var today = new Date(newDate*1000);     //aktualny dzień
    
actualDate.setDate(1);      //ustawia datę na pierwszy dzień miesiąca
    
var actDOW = actualDate.getDay(); //DOW - Day Of Week, dzień tygodnia w którym zaczyna się miesiąc
var actMonth = actualDate.getMonth(); //pobranie aktualnego miesiąca
var prevMonth = (actMonth-1 < 0) ? 11 : actMonth-1; //twierdzenie warunkowe które potrzebne jest do wyliczenia dni poprzedniego miesiąca
var actYear = actualDate.getFullYear(); //pobranie aktualnego roku
    
//Pętla przypisująca wszystkim komórkom nr ID  
for(var i=0; i < cells.length; i++){
    cells[i].parentElement.setAttribute('data-id', i);
}

//pętla pogrubiająca wszystkie pierwsze dni tygodnia (niedziele)
for(var j = 0; j < firstCells.length; j++){
    firstCells[j].style.fontWeight = 700;
}


    //Funkcja sprawdzająca ile dni ma dany miesiąc i jaka jest nazwa tego miesiąca
    function checkMonth(month, year){ 
        
        var name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var amountOfDays = [31, ((year%4 == 0) ? amountOfDays = 29 : amountOfDays = 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
               
        name = name[month];
        amountOfDays = amountOfDays[month];
        
        return [amountOfDays, name];
    }
    
    //Funkcja odpowiedzialna za dodawanie wydarzeń do kalendarza
    function addEvents(indexDay, i){
        var allItems = 0;
        var itemIndex = 0;
        
        for(var k=0; k < events.length; k++){
            var seekDate = new Date(events[k].date);
            
            if(actYear == seekDate.getFullYear() && actMonth == seekDate.getMonth() && indexDay == seekDate.getDate()){
                if(allItems < 3){
                    var newItem = document.createElement('p');
                    newItem.innerText = events[k].name;
                    newItem.classList.add('new');
                    cells[i].parentElement.appendChild(newItem);
                    allItems++;
                } else {
                    itemIndex++;
                }
            }
        }
        
        if(itemIndex > 0){
            var other = document.createElement('p');
            other.innerText = "+ "+itemIndex+" more";
            other.classList.add('new');
            cells[i].parentElement.appendChild(other);
        }
    }
    
    //Funkcja czyszcząca komórki
    function clearCells(i){
        $(cells[i]).siblings().remove();
        cells[i].parentElement.classList.remove('oldnew','today','actual');
        cells[i].parentElement.removeEventListener('click', showItems);
    }
    
    
    //Funkcja tworząca widok całego miesiąca, uzupełniająca odpowiednio komórki tablicy                                        
    function createMonthView(){ 
        showMonthName.innerText = (checkMonth(actMonth, actYear)[1] + " " + actYear).toUpperCase(); //wypisuje w DIV wybrany miesiąc i rok
        
        var prevIndexDay = checkMonth(prevMonth, actYear)[0]; //ostatni dzień poprzedniego miesiąca
        
        // pętla która wypisuje dni z poprzedniego miesiąca
        for(var i = actDOW-1; i >=0 ; i--){
            clearCells(i);
            cells[i].parentElement.classList.add('oldnew');
            cells[i].innerText = prevIndexDay;
           
            prevIndexDay--;
        }
        
        var indexDay = 1;   //ustawienie wartości po
        var lastDay = checkMonth(actMonth, actYear)[0];  //pobranie wartości ile dni ma aktualny miesiąc
        
        //pętla iterująca po dniach aktualnego oraz kolejnego miesiąca
        for(var i = actDOW; i < cells.length; i++){  //pętla iterująca po dniach aktualnego oraz kolejnego miesiąca
            clearCells(i);
            
            if(indexDay > lastDay){
                indexDay = 1;
                actualDate.setMonth(actMonth+1);    //jak dojdzie do końca miesiąca to przestawia na kolejny tak żeby nie dublować wydarzeń, na kolejny miesiąc
                actMonth = actualDate.getMonth();
            }
            
            cells[i].parentElement.classList.remove('today');
            cells[i].innerText = indexDay;
            
            if(i > (lastDay+actDOW-1)){
                cells[i].parentElement.classList.add('oldnew');
            } else {
                cells[i].parentElement.classList.add('actual');
                cells[i].parentElement.addEventListener('click', showItems);
                
                addEvents(indexDay, i); //wywołanie funkcji odpowiedzialnej za tworzenie wydarzeń
            }
                
            //warunek zaznaczający aktualny dzień w kalendarzu
            if((actYear == today.getFullYear()) && (actMonth == today.getMonth()) && (indexDay == today.getDate())){
                cells[i].parentElement.classList.add('today');
            }
            
            indexDay++;
        }
        
        //poniższy zabieg ma za zadanie przywrócenie z powrotem wartości aktualnie przeglądanego miesiąca
        actualDate.setMonth(actMonth-1); 
        actMonth = actualDate.getMonth();     
        return;
    }
    
    setTimeout(createMonthView,100); //stworzenie aktualnego widoku miesiąca, opóźnienie wprowadzone celowo w celu możliwości odczytania z serwera wartości "events"
    
    //sprawdzenie poprawności zapisanej daty
    function checkdate(newDate){
        var year = parseInt(newDate.substring(0,4));
        var month = parseInt(newDate.substring(5,7));
        var day = parseInt(newDate.substring(8,10));
        
        month = month-1;
        checkMonth(month, year)[0];
        
        if(isNaN(year) || isNaN(month) || isNaN(day) || newDate.substring(4,5) != '-' || newDate.substring(7,8) != '-' ){
            return false;
        } else if (year<1000 || year>9999 || month<0 || month>11){
            return false;
        } else if (day < 1 || day > checkMonth(month, year)[0]){
            return false;
        } else {
            return true;
        }
    }
    
    //funkcja usuwująca z tablicy events usunięte wcześniej wydarzenia i wysyłająca do pliku aktualne dane
    function sendData(){        
        if(remove.length > 0){
            remove.sort(function(a,b){ return b - a; });

            for(var i = 0; i < remove.length; i++){
                events.splice(remove[i],1);
            }
        }
                
        createMonthView();

        //zapis danych
        $.ajax({ 
                url: "./php/putEvent.php",
                dataType: 'json',
                type: 'POST',
                data: JSON.stringify(events)

            }).done(function(response){

            }).fail(function(error) {
                console.log(error)
            });
        return events
    }
    
    
    //Obsługa formularza do dodawania wydarzeń
    var form = document.querySelector('#newEventForm');
    var cancel = document.querySelector('.cancel');
    var create = document.querySelector('.create'); //w celu zmiany widoku
    var inputName = form.querySelector('#name');
    var inputData = form.querySelector('#date');
    var inputDescription = form.querySelector('#description');
    var createError = $(create).find('.fail');
    var createErrorList = createError.find('ul').children('li');
    var dayInCell = null; //wartość początkowa, nie ma znaczenia
    
    form.addEventListener('submit', function(e){
        e.preventDefault();
        
        var inputNameValue = inputName.value;
        var inputDataValue = inputData.value;
        var inputDescriptionValue = inputDescription.value;               
                    
        if(inputNameValue.length < 5 || inputDataValue.length > 10 || !checkdate(inputDataValue)){
            
            createError.slideDown(500);
            
            if(inputNameValue.length < 5){
                $(createErrorList[0]).show(300)
            } else{
                $(createErrorList[0]).hide(300)
            }
            
            if(inputDataValue.length < 10 || !checkdate(inputDataValue)){
                $(createErrorList[1]).show(300)
            } else{
                $(createErrorList[1]).hide(300)
            }
            
        } else {
            
            createError.slideUp(500);
            $(createErrorList[0]).hide(0);
            $(createErrorList[1]).hide(0);
            
            var newEvent = {
                name: inputName.value,
                date: inputData.value,
                description: inputDescription.value
            };

            events.push(newEvent);
            
            var allData = document.querySelector('.fullScreen');
            body.removeChild(allData);
            create.style.display = "none";
            sendData();
            createMonthView();
            
        }
    });
    
    cancel.addEventListener('click', function(){
        createError.hide(0);
        $(createErrorList[0]).hide(0);
        $(createErrorList[1]).hide(0);
        var allData = document.querySelector('.fullScreen');
        body.removeChild(allData);
        create.style.display = "none";
        sendData();
    });
    
    function createEvent(){      
        create.style.display = "block";
        var monthAdd = (actMonth+1 < 10) ? "0"+(actMonth+1) : (actMonth+1);
        var dayAdd = (dayInCell < 10) ? "0"+dayInCell : dayInCell;
        inputName.value='';
        inputData.value=actYear+'-'+monthAdd+'-'+dayAdd;
        inputDescription.value='';
    }
    
    //Funkcja odpowiedzialna za wyszukiwanie wydarzeń w danym dniu
    function showItems(){
        dayInCell = this.children[0].innerText;      //pobranie nr dnia
        var cellsId = this.getAttribute('data-id');     //numer komórki ID liczony od 0 (ze wszystkich komórek)
        
        var items = document.createElement('div');      //nałożenie czarnego, półprzezroczystego DIVa na ekran
        items.classList.add('fullScreen');
        
        var box = document.createElement('div');        //box na środku ekranu
        box.classList.add('items');
        box.innerHTML = "<p class='boxHeader'>Events: "+this.firstChild.innerText+" "+checkMonth(actMonth, actYear)[1]+" "+actYear+"</p>"; //wypisanie w boxie daty z bieżącego dnia i miesiąca
        
        items.appendChild(box);
        
        var itemsElements = document.createElement('div');
        itemsElements.classList.add('itemsElements');
        box.appendChild(itemsElements);
        
        //pętla odpowiedzialna za wypisanie wszystkich wydarzeń z danego dnia wraz z odpowiednimi przyciskami
        for(var i=0; i < events.length; i++){
            var seekDate = new Date(events[i].date);
            
            if(actYear == seekDate.getFullYear() && actMonth == seekDate.getMonth() && parseInt(this.firstChild.innerText) == seekDate.getDate()){
                var newItem = document.createElement('div');
                newItem.setAttribute('data-id', events.indexOf(events[i]));
                newItem.classList.add('boxNewItem');
                itemsElements.appendChild(newItem);
                
                var fail = document.createElement('div');
                fail.classList.add('fail');
                fail.innerHTML = "<strong>Invalid data!</strong><ul><li>Name: min. length = 5, max. length = 15</li><li>Date: correct record - YYYY-MM-DD, e.g. 2015-06-30</li></ul>"
                newItem.appendChild(fail);
                
                var itemInfo = document.createElement('table');
                itemInfo.classList.add('boxItemInfo');
                itemInfo.innerHTML = "<tr><td>Name:</td><td>"+events[i].name+"</td></tr><tr><td>Date:</td><td>"+events[i].date+"</td></tr><tr><td>Description:</td><td>"+events[i].description+"</td></tr>";
                newItem.appendChild(itemInfo);
                        
                var del = document.createElement('div');
                del.classList.add('del');
                del.setAttribute('data-id', events.indexOf(events[i]));
                del.innerText='Delete';
                newItem.appendChild(del);
                
                var editElmt = document.createElement('div');
                editElmt.classList.add('editElmt');
                editElmt.setAttribute('data-id', events.indexOf(events[i]));
                editElmt.innerText='Edit';
                newItem.appendChild(editElmt);    
            }
        }
        
        remove = []; //stworzenie pustej tablicy elementów do usunięcia
        
        var delBtn = box.querySelectorAll('.del');
        var editElmtBtn = box.querySelectorAll('.editElmt');
        
        //Pętla przypisująca wszytskim elementom listy event usuwania wydarzenia
        for(var j=0; j < delBtn.length; j++){
            delBtn[j].addEventListener('click', function(){
                    remove.push(parseInt(this.getAttribute('data-id')));
                    itemsElements.removeChild(this.parentElement);
            });
        }
        
        //Pętla przypisująca wszytskim elementom listy event edytowania wydarzenia
        for(var j=0; j < editElmtBtn.length; j++){
            editElmtBtn[j].addEventListener('click', function(){
                
                var eventID = $(this).parent().attr('data-id');     //pobranie id danego eventu 
                var editEvent = $(this).parent().find('tr > td:last-child');
                
                //ustawienie maksymalnej długości tekstu poszczególnych pól oraz tooltipów
                editEvent[0].setAttribute('max', 15);
                editEvent[1].setAttribute('max', 10);
                editEvent[2].setAttribute('max', 200);
                
                //dodanie tooltipów dla każdego edytowanego elementu
                editEvent[0].setAttribute('title', "Name: min. length = 5, max. length = 15");
                editEvent[1].setAttribute('title', "Date: correct record - YYYY-MM-DD, e.g. 2015-06-30");
                editEvent[2].setAttribute('title', "Description: max. length = 200");
                
                var newParent = $(editEvent[0]).closest('.boxNewItem');          
                
                //pętla nadająca event edytowanym wydarzeniom - ograniczanie długości tekstu, blokowanie entera
                for(var i=0; i<editEvent.length; i++){
                    editEvent[i].addEventListener('keydown', function(e){
                        var keycode = e.which;
                        var deletingAndMove = (keycode == 8 || keycode == 46 || keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40);
                        if((this.innerText.length >= this.getAttribute('max') && !deletingAndMove) || keycode == 13){
                            e.preventDefault();    
                        }
                    }); 
                }
                
                //walidacja edytowanego wydarzenia!
                if( $(editEvent).attr('contenteditable') == 'true' ){
                    
                    var newName = editEvent[0].innerText;  //pobranie zedytowanej treści. musi być za pomocą text() lub innerText, ponieważ to nie jest input z formularza i pobieramy treść ze środka znacznika
                    var newDescription = editEvent[2].innerText;
                    var newDate = editEvent[1].innerText;
                    var failList = newParent.find('.fail').find('ul').children('li');
                    
                    
                    if(newName.length < 5 || newDate.length < 10 || !checkdate(newDate)){
                        
                        newParent.find('.fail').slideDown(500);
                        
                        if(newName.length < 5){
                            $(failList[0]).show(500)
                        } else{
                            $(failList[0]).hide(500)
                        }
                        
                        if(newDate.length < 10 || !checkdate(newDate)){
                            $(failList[1]).show(500)
                        } else{
                            $(failList[1]).hide(500)
                        }
                        
                    } else {
                        
                        $(editEvent).attr('contenteditable', false);
                        $(editEvent).toggleClass('editable');
                        this.innerText = 'Edit';
                        newParent.find('.fail').slideUp(500);
                        
                        var newEvent = {
                            name: newName,
                            description: newDescription,
                            date: newDate
                        };
                    
                        events[eventID] = newEvent;
                        this.classList.remove('accept');
                        this.previousElementSibling.classList.remove('accept');
        
                    }
                    
                } else {
                    $(editEvent).attr('contenteditable', true);
                    $(editEvent).toggleClass('editable');
                    this.innerText = 'Accept';
                    this.classList.add('accept');
                    this.previousElementSibling.classList.add('accept');
                }
            });
        }
        
        
        if(box.querySelectorAll('tr').length < 1){
            var newItem = document.createElement('p');
            newItem.innerHTML = "You have no plans for this day!";
            itemsElements.appendChild(newItem);
        }
        
        var add = document.createElement('div');
        add.classList.add('add');
        add.innerText='Add';
        
        var close = document.createElement('div');
        close.classList.add('close');
        close.innerText='Close';
        
        box.appendChild(add);
        box.appendChild(close);
        body.appendChild(items);
        
        add.addEventListener('click', createEvent);
        
        close.addEventListener('click', function(){
            body.removeChild(items);
            sendData();  
        });
        
        body.appendChild(items);
    }
       
    
    //Tworzenie poprzedniego miesiąca
    btnPrev.addEventListener('click', function(){
        
        actualDate.setMonth(actMonth-1); //ustawienie daty na porzedni miesiąc
        
        //ponowne przypisanie wartości do zmiennych po aktualizacji miesiąca
        actMonth = actualDate.getMonth(); 
        actDOW = actualDate.getDay(); //DOW - Day Of Week, dzień tygodnia w którym zaczyna się miesiąc
        prevMonth = (actMonth-1 < 0) ? 11 : actMonth-1; 
        actYear = actualDate.getFullYear();
        
        createMonthView(); //odświeżenie widoku
    });
    
    
    //Tworzenie kolejnego miesiąca
    btnNext.addEventListener('click', function(){
        
        actualDate.setMonth(actMonth+1); //ustawienie daty na kolejny miesiąc
        
        //ponowne przypisanie wartości do zmiennych po aktualizacji miesiąca
        actMonth = actualDate.getMonth(); //ponowne przypisanie wartości do zmiennej
        actDOW = actualDate.getDay(); //DOW - Day Of Week, dzień tygodnia w którym zaczyna się miesiąc      
        prevMonth = (actMonth-1 < 0) ? 11 : actMonth-1;
        actYear = actualDate.getFullYear();
        
        createMonthView();  //odświeżenie widoku     
    });
   

    //Sticky menu
    var nav = $('header');
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
    
});