// Status handler
function updateStatus() {
  var status = $('#statusbox').val()
  if(status === '') {
    alert('Please enter a status!')
  }
  else {
    $.ajax({
      url       : '/status',
    type        : 'PUT',
      dataType  : 'text',
      data      : {'status':status},
      success   : function(res) {
                    console.log(res)
                  },
      error     : function(res) {
                    console.log(res)
                  }
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
      $('#wall').html('')
      for (i = statusList.length-1; i >= 0; i--) { 
        var container = document.createElement('div');
        var media = document.createElement('div');
        var content = document.createElement('div');
        var header = document.createElement('span');
        container.setAttribute('class', 'status');
        header.setAttribute('class', 'time');
        content.innerHTML = statusList[i].status
        header.innerHTML = statusList[i].created
        container.appendChild(header)
        container.appendChild(content)
        $('#wall').append(container)
        $('#wall').append(document.createElement('hr'));
      }
    }
  };
};


