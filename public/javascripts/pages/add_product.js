$(document).ready(function(){
    $('.datepicker').datepicker({
        isRTL: true
    });

    $('select').formSelect();
    
     document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems);
    });
  });