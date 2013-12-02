// Status handler
function updateStatus() {
  var status = $('#statusbox').val();
  var author = $('#namebox').val();
  if(status === '') {
    alert('Please enter a status!');
  }

  else {
    $('#statusbutton').addClass('loading');
    $('#statusbutton').html('').prop("onclick", null);
    if(!author){
      author = 'Anonymous'
    }
    $.ajax({
      url       : '/status',
    type        : 'PUT',
      dataType  : 'text',
      data      : {'status':status,'author':author},
      success   : function(res) {
        $('#statusbox').val('');
        $('#statusbutton').removeClass('loading');
        $('#statusbutton').attr('onclick','updateStatus();');
        $('#statusbutton').html('submit');
      },
      error     : function(res) {console.log(res)}
    });
  }
};

var rawStatuses
// Event stream handler
function createStream() {
  var stream = new EventSource("/sse");
  stream.onmessage = function (event) {
    if (event.data !== null && rawStatuses !== event.data) {
      rawStatuses = event.data;
      statusList = JSON.parse(rawStatuses);
      $('#statuswall').html('')
      for (i = statusList.length-1; i >= 0; i--) { 
        var container = document.createElement('div');
        var media = document.createElement('div');
        var content = document.createElement('div');
        var header = document.createElement('span');
        container.setAttribute('class', 'status');
        header.setAttribute('class', 'time');
        content.innerHTML = statusList[i].status
        header.innerHTML = timeParser(statusList[i].created) +' by: '+statusList[i].author
        container.appendChild(header)
        container.appendChild(content)
        $('#statuswall').append(container)
        $('#statuswall').append(document.createElement('hr'));
      }
    }
  };
};

function timeParser(date) {
  var difference = ((Date.now() - Date.parse(date))/100)
  if (difference < 20) {
    return 'Just now'
  }
  if (difference <= 60) {
    return 'Less than a minute ago'
  }
  difference = difference/60
  if (difference <= 60) {
    return (parseInt(difference) + ' Minutes ago')
  }
  difference = difference/60
  if (difference/24 <= 7) {
    return (parseInt(difference) + ' Hours ago')
  differnece = difference/7
  return parseInt(difference) + ' Days ago'
  } 
}


