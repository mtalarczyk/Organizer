document.addEventListener("DOMContentLoaded", function(){
    
    //Pobranie danych z serwera    
    var tasks = null;
    $.ajax({
            url: "./php/getToDo.php"

            }).done(function(response){
                tasks = JSON.parse(response);

            }).fail(function(error) {
                console.log(error)
            });    
    
    //Wysyłanie danych na serwer
    function sendData(){
    $.ajax({ 
                url: "./php/putToDo.php",
                dataType: 'json',
                type: 'POST',
                data: JSON.stringify(tasks)

            }).done(function(response){

            }).fail(function(error) {
                console.log(error)
            })        
    }

    
    //Ustawienie wartości parametrów wejściowych
    var addTask = document.querySelector('#addTaskButton');
    var ul = document.querySelector('#taskList');
    var taskInput = document.querySelector('#taskInput');
    var removeAll = document.querySelector('#removeFinishedTasksButton');
    var counter = document.querySelector('#counter');
    var index = 0;
    var priority = document.querySelector('#priority');
    var addTaskHeader = document.querySelector('.addTaskHeader');
    var addTaskMain = document.querySelector('.addTaskMain');
    var addTaskClass = document.querySelector('.addTask');
    var fail = document.querySelector('.fail');
    
    addTaskHeader.addEventListener('click', function(){
        $(addTaskMain).slideToggle(500);
        $(fail).slideUp(500);
        taskInput.value = '';
    });
    
    //sortowanie elementów w zależności od priorytettu
    function sortByPriority(){
        var allLi = ul.querySelectorAll('li');
        
        for(var i=0; i < allLi.length; i++){
            ul.removeChild(allLi[i]);
        }
        
        tasks = [];
        
        for(var i=10; i >= 0; i--){
            for(var j=0; j<allLi.length; j++){
                if(allLi[j].getAttribute('data-priority') == i){
                 ul.appendChild(allLi[j]);
                    var newTask = {
                        task: allLi[j].querySelector('.newTask td:last-of-type p').innerText,
                        priority: allLi[j].getAttribute('data-priority'),
                        done: allLi[j].getAttribute('data-done')
                    };
                    tasks.push(newTask);
                }
            }
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
    function createItem(newTask, newPriority, newDone){
            var li = document.createElement('li');
            li.setAttribute('data-priority', newPriority);
            li.setAttribute('data-done', newDone);
            li.innerHTML= '<table class="newTask"><tr><td><p class="priority'+newPriority+'">'+newPriority+'</p></td><td><p>'+newTask+'</p></td></tr></table><div>Delete</div><div>Complete</div>';
        
            ul.appendChild(li);

            var btn = li.querySelectorAll('div');
            var del = btn[0];
            var cmpl = btn[1];
        
            del.classList.add('delete');
            cmpl.classList.add('complete');
        
            if(newDone == 'true'){
                li.classList.toggle('done');
            }

            cmpl.addEventListener('click', function(){
                li.classList.toggle('done');
                var dataId = li.getAttribute('data-id');
                
                if(li.getAttribute('data-done') == 'false'){
                    counter.innerText = --index;
                    li.setAttribute('data-done', true);
                } else {
                    counter.innerText = ++index;
                    li.setAttribute('data-done', false);
                }
                
                tasks[dataId].done = li.getAttribute('data-done');
                sendData();
            });

            del.addEventListener('click', function(){
                tasks.splice(li.getAttribute('data-id'),1);
                sendData();
                if(li.getAttribute('data-done') == 'false'){
                    counter.innerText = --index;    
                }
                this.parentElement.parentElement.removeChild(li);
                renewID();
            });
            
            taskInput.value = '';
            if(newDone == 'false'){
                counter.innerText = ++index;
            }          
    }
    
    setTimeout(function(){
      for(var i=0; i<tasks.length; i++){
        createItem(tasks[i].task, tasks[i].priority, tasks[i].done)
      }
      renewID();
    }, 100);

    addTask.addEventListener('click', function(){
        var taskValue = taskInput.value;

        if(taskValue.length >= 5 && taskValue.length <= 100 ){
            createItem(taskValue, priority.value, 'false');
            sortByPriority();
            renewID();
            $(fail).slideUp(500);
        } else {
            $(fail).slideDown(500);
        }
    });
    
    removeAll.addEventListener('click', function(){
        var done = document.querySelectorAll('[data-done="true"]');

        for(var i=(done.length-1); i >= 0; i--){
            tasks.splice(done[i].getAttribute('data-id'),1);
            ul.removeChild(done[i]);
        }
        sendData();
        renewID();
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
        $(this).children().slideDown(500)
    });
    
    menu.on('mouseleave', function(){
        $(this).children().slideUp(500)
    });
 
});