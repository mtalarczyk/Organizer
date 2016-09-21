document.addEventListener("DOMContentLoaded", function(){
    
    var main = document.querySelector('.main');
    var calendar = main.querySelector('.calendar');
    var contact = main.querySelector('.contact');
    var list = main.querySelector('.todolist');
    
    var box = main.querySelectorAll('.box'); 
    
    $(box).on('mouseenter', function(){
        $(this).animate({
            width: '+=20px',
            height: '+=20px',
            'line-height': '+=20px',
            'font-size': '+=5px',
            'margin-top': '-=10px',
            'margin-left': '-=10px',
            'margin-right': '-=10px'
        }, 300);
    });
    
    $(box).on('mouseleave', function(){
        $(this).animate({
            width: '-=20px',
            height: '-=20px',
            'line-height': '-=20px',
            'font-size': '-=5px',
            'margin-top': '+=10px',
            'margin-left': '+=10px',
            'margin-right': '+=10px'
        }, 300);
    });
    
    calendar.addEventListener('click', function(){
        location.href='./calendar.html';
    });
    
    contact.addEventListener('click', function(){
        location.href='./contacts.html';
    });
    
    list.addEventListener('click', function(){
        location.href='./todolist.html';
    });
});