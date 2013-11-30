// Page transition animation
function pageTransistion(element){ 
  if ($('#primarywrapper').is(':visible')){
    $('#primarywrapper').hide('slow')
    setTimeout(function(){ 
      $('.maindiv').hide()
      $(element).show()
      $('#primarywrapper').show('slow')
    }, 500)
  }
  else {
    $(element).show()
    $('#primarywrapper').show('slow')
    
  }
} 

// Selection transition animation
function selectionTransition(name){
    $('.active').removeClass('active');
    element = '#'+name.val();
    if ($(element).is(':visible')){
      $('.cvdiv').hide('slow');
    }
    else {
      $(name).addClass('active');
      $('.cvdiv').hide('slow');
      $(element).show('slow');
    } 
}

function changePage(element){
    $("#splash").animate({marginTop:"0%"}, 400);
    document.title, url = element, window.location + '/' +element
    // Manipulate history
    history.pushState(url, element, url);
    var content = '#'+element;
    setTimeout(pageTransistion(content), 500);
  };


$(document).ready(function(){
  // Main menu/Splash screen onclick animations
  $(".mainMenu:button").click(function(){
    changePage($(this).val());
  });
  //CV onclick animation
  $(".cvmenu:button").click(function(){
    selectionTransition($(this));
  });
});

window.onpopstate = function(event) {
  console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
};

