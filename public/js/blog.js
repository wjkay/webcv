// Status handler
function updateStatus() {
  var status = $('#status').val()
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
      $('.wall').html('')
      for (i = 0; i < statusList.length; i++) { 
        var container = document.createElement('div');
        var content = document.createElement('div');
        var footer = document.createElement('div');
        container.setAttribute('class', 'status');
        footer.setAttribute('class', 'status created');
        content.innerHTML = statusList[i]
.status
        footer.innerHTML = statusList[i].created
        container.appendChild(content)
        container.appendChild(footer)
        $('.wall').append(container)
      }
    }
  };
};

// OGP Parser
