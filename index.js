$(function (){
  gunpowder = new Decimal('1');
  gps = new Decimal('1');
  lastTick = new Date().getTime();
  timeNow = new Date().getTime();
  notationMod = 0;

  function notation(num) {
    if (notationMod == 0) {
      if (num.exponent >= 6) {
        return ((num.mantissa).toFixed(2)) + 'e' + num.exponent;
      } else {
        return (num.mantissa*(10**num.exponent)).toFixed(2);
      }
    }
  }
  function displayBasic() {
    $('#gunpowder').html(function (index,html) {
      return 'You Have ' + notation(gunpowder) + ' Gunpowder';
    });
    $('#gps').html(function (index,html) {
      return notation(gps) + 'g/s';
    });
  }

  $(document).on('click','#mainNavs > span',function() {
    indexThis = $('#mainNavs > span').index(this);
    $('#warpMenus > div').hide();
    $('#warpMenus > div:eq(' + indexThis + ')').show();
  });

  setInterval( function (){
    tickGain = timeNow - lastTick;
    gunpowder = gunpowder.add(gps.multiply(tickGain/1000));
    displayBasic();
    lastTick = timeNow;
    timeNow = new Date().getTime();
  }, 100);
});
