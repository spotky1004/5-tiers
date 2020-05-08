$(function (){
  gunpowder = new Decimal('1');
  gps = new Decimal('0');
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
  }

  $(document).on('click','#mainNavs > span',function() {
    indexThis = $('#mainNavs > span').index(this);
    $('#warpMenus > div').hide();
    $('#warpMenus > div:eq(' + indexThis + ')').show();
  });

  setInterval( function (){
    gunpowder = gunpowder.multiply('12450918243562664640');
    displayBasic();
  }, 100);

  $('#mainNavs > span:not(.tier1)').hide();
});
