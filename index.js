$(function (){
  gunpowder = new Decimal('10');
  gps1 = new Decimal('0');
  gps2 = new Decimal('0');
  gps3 = new Decimal('0');
  gps4 = new Decimal('0');
  gLimitLevel = new Decimal('0');
  booster = new Decimal('0');
  bpc = new Decimal('1');
  boosterBoost = new Decimal('1');
  lastTick = new Date().getTime();
  timeNow = new Date().getTime();
  menuNow = 0;
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
  function gameSave() {
    saveFile = [];
    for (var i = 0; i < varData.length; i++) {
      saveFile[i] = eval(varData[i]);
    }
    localStorage.setItem('saveFile', JSON.stringify(saveFile));
  }
  function gameLoad() {
    savedFile = JSON.parse(localStorage.getItem('saveFile'));
    dataCopy = JSON.parse(JSON.stringify(resetData));
    Object.assign(dataCopy, savedFile);
    for (var i = 0; i < varData.length; i++) {
      if (typeof dataCopy[i] == 'string') {
        this[varData[i]] = new Decimal(dataCopy[i]);
      } else if (typeof dataCopy[i] == 'object') {
        for (var j = 0; j < Object.keys(dataCopy[i]).length; j++) {
          this[varData[i]][j] = new Decimal(dataCopy[i][j]);
        }
      } else {
        this[varData[i]] = dataCopy[i];
      }
    }
  }
  function displayAll() {
    displayBasic();
    switch (menuNow) {
      case 0:
        displayStructs();
        break;
      case 1:
        displayBooster();
        break;
    }
  }
  function displayBasic() {
    gLimit = gLimitLevel.pow_base('1e5').multiply('1e20');
    $('#gunpowder').html(function (index,html) {
      return 'You Have ' + notation(gunpowder) + '/' + notation(gLimit) + ' Gunpowder';
    });
    $('#gps').html(function (index,html) {
      return notation(gps1.multiply(boosterBoost)) + 'g/s' + (gps2 > 0 ? ', ' + notation(gps2.multiply(boosterBoost)) + 'g/s<sup>2</sup>': '') + (gps3 > 0 ? ', ' + notation(gps3.multiply(boosterBoost)) + 'g/s<sup>3</sup>': '') + (gps4 > 0 ? ', ' + notation(gps4.multiply(boosterBoost)) + 'g/s<sup>4</sup>': '');
    });
  }
  function displayStructs() {
    for (var i = 0; i < 10; i++) {
      $('.structs:eq(' + i + ') > span:nth-child(1)').html(function (index,html) {
        return structsName[i] + ': ' + notation(structsHave[i]) + ' (' + notation(boosterBoost.multiply(structsPower[i][0])) + '/s<sup>' + (structsPower[i][1] >= 2 ? structsPower[i][1] : '') + '</sup>)';
      });
      $('.structs:eq(' + i + ') > span:nth-child(2)').html(function (index,html) {
        return 'cost: ' + notation(structsCost[i]) + 'g';
      });
      $('.structs:eq(' + i + ') > span:eq(2)').attr({
        'class' : 'strBuy' + ((gunpowder.greaterThanOrEqualTo(structsCost[i])) ? 'Y' : 'N')
      });
    }
  }
  function displayBooster() {
    $('#booster').html(function (index,html) {
      return 'You have ' + notation(booster) + ' Boosters -> x' + boosterBoost.toFixed(2) + ' production';
    });
    $('#boostButton').html(function (index,html) {
      return 'Boost! (+' + notation(bpc) + ')';
    });
  }
  function calcAll() {
    calcBooster();
    calcBasic();
  }
  function calcBasic() {
    gps3 = gps3.add(gps4.multiply(tickGain));
    gps2 = gps2.add(gps3.multiply(tickGain));
    gps1 = gps1.add(gps2.multiply(tickGain));
    gunpowder = gunpowder.add(gps1.multiply(tickGain));
  }
  function calcBooster() {
    boosterDeacy = new Decimal('1.001');
    boosterDeacy = boosterDeacy.pow_base(tickGain/100+1);
    if (booster.gt(0.1)) {
      booster = booster.divide(boosterDeacy);
    } else {
      booster = booster.add(booster.multiply('-1'))
    }
    boosterBoost = new Decimal(booster.divide('10').add('1').log(10)+1);
    if (booster.gt('1e10')) {
      boosterBoost = new Decimal(boosterBoost*booster.divide('1e9').log(10));
    }
  }

  $(document).on('click','#mainNavs > span',function() {
    indexThis = $('#mainNavs > span').index(this);
    menuNow = indexThis;
    displayAll();
    $('#warpMenus > div').hide();
    $('#warpMenus > div:eq(' + indexThis + ')').show();
  });
  $(document).on('click','#boostButton',function() {
    booster = booster.add(bpc);
    calcBooster();
    displayBooster();
  });
  $(document).on('click','.structs > span:nth-child(3)',function() {
    indexThis = $('.structs > span:not(.strBuyN):nth-child(3)').index(this);
    if (indexThis != -1) {
      gunpowder = gunpowder.minus(structsCost[indexThis]);
      structsHave[indexThis] = structsHave[indexThis].add('1');
      structsCost[indexThis] = structsCost[indexThis].multiply((indexThis+1)/5+1);
      switch (structsPower[indexThis][1]) {
        case 1:
          gps1 = gps1.add(structsPower[indexThis][0]);
          break;
        case 2:
          gps2 = gps2.add(structsPower[indexThis][0]);
          break;
        case 3:
          gps3 = gps3.add(structsPower[indexThis][0]);
          break;
        case 4:
          gps4 = gps4.add(structsPower[indexThis][0]);
          break;
      }
    }
    displayStructs();
    displayBasic();
  });

  setInterval( function (){
    tickGain = (timeNow - lastTick)/1000;
    calcAll();
    displayAll();
    lastTick = timeNow;
    timeNow = new Date().getTime();
  }, 100);
  setInterval( function (){
    gameSave();
  }, 5000);

  gameLoad();
});

function gameReset() {
  for (var i = 0; i < varData.length; i++) {
    if (typeof dataCopy[i] == 'string') {
      this[varData[i]] = new Decimal(resetData[i]);
    } else if (typeof resetData[i] == 'object') {
      for (var j = 0; j < Object.keys(resetData[i]).length; j++) {
        this[varData[i]][j] = new Decimal(resetData[i][j]);
      }
    } else {
      this[varData[i]] = resetData[i];
    }
  }
  saveFile = [];
  for (var i = 0; i < varData.length; i++) {
    saveFile[i] = eval(varData[i]);
  }
  localStorage.setItem('saveFile', JSON.stringify(saveFile));
  location.reload();
}
