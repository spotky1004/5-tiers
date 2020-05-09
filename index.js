$(function (){
  savePoint = 'GunpowderFactory';
  overallBoost = new Decimal('1');
  gunpowder = new Decimal('10');
  gps1 = new Decimal('0');
  gps2 = new Decimal('0');
  gps3 = new Decimal('0');
  gps4 = new Decimal('0');
  gLimitLevel = new Decimal('0');
  booster = new Decimal('0');
  bpc = new Decimal('1');
  boughtStr = new Decimal('0');
  boosterBoost = new Decimal('1');
  ep = new Decimal('0');
  epBoost = new Decimal('1');
  eCount = new Decimal('0');
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
    localStorage[savePoint] = JSON.stringify(saveFile);
  }
  function gameLoad() {
    savedFile = JSON.parse(localStorage[savePoint]);
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
    displayUnlocks();
    switch (menuNow) {
      case 0:
        displayStructs();
        break;
      case 1:
        displayBooster();
        break;
      case 3:
        displayExplosion();
        break;
    }
  }
  function displayBasic() {
    $('#gunpowder').html(function (index,html) {
      return 'You Have ' + notation(gunpowder) + '/' + notation(gLimit) + ' Gunpowder';
    });
    $('#gps').html(function (index,html) {
      return notation(gps1.multiply(overallBoost)) + 'g/s' + (gps2 > 0 ? ', ' + notation(gps2.multiply(overallBoost)) + 'g/s<sup>2</sup>': '') + (gps3 > 0 ? ', ' + notation(gps3.multiply(overallBoost)) + 'g/s<sup>3</sup>': '') + (gps4 > 0 ? ', ' + notation(gps4.multiply(overallBoost)) + 'g/s<sup>4</sup>': '');
    });
  }
  function displayStructs() {
    for (var i = 0; i < 10; i++) {
      $('.structs:eq(' + i + ') > span:nth-child(1)').html(function (index,html) {
        return structsName[i] + ': ' + notation(structsHave[i]) + ' (' + notation(overallBoost.multiply(structsPower[i][0])) + '/s<sup>' + (structsPower[i][1] >= 2 ? structsPower[i][1] : '') + '</sup>)';
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
  function displayExplosion() {
    $('#explosionPoint').html(function (index,html) {
      return 'You have ' + notation(ep) + ' Explosion Point -> x' + notation(epBoost) + ' production';
    });
  }
  function calcAll() {
    calcExplosion();
    calcBooster();
    calcBasic();
  }
  function displayUnlocks() {
    if (ep.gt(0)) {
      $('#mainNavs > span:eq(3)').show();
    }
  }
  function calcBasic() {
    overallBoost = boosterBoost.multiply(epBoost);
    gps3 = gps3.add(gps4.multiply(overallBoost).multiply(tickGain));
    gps2 = gps2.add(gps3.multiply(overallBoost).multiply(tickGain));
    gps1 = gps1.add(gps2.multiply(overallBoost).multiply(tickGain));
    gunpowder = gunpowder.add(gps1.multiply(overallBoost).multiply(tickGain));
    gLimit = gLimitLevel.pow_base('1e5').multiply('1e20');
    if (gunpowder.gt(gLimit)) {
      if (eCount.lt(5)) {
        firstExplosion();
      }
      eCount = eCount.add('1');
      ep = ep.add('1');
      gunpowder = new Decimal('10');
      structsCost = {
        0: new Decimal('1e1'),
        1: new Decimal('1e2'),
        2: new Decimal('2.5e3'),
        3: new Decimal('1.0e4'),
        4: new Decimal('1.5e5'),
        5: new Decimal('1.0e6'),
        6: new Decimal('5.0e6'),
        7: new Decimal('1.0e8'),
        8: new Decimal('1.0e9'),
        9: new Decimal('1.0e13'),
      };
      structsHave = {
        0: new Decimal('0'),
        1: new Decimal('0'),
        2: new Decimal('0'),
        3: new Decimal('0'),
        4: new Decimal('0'),
        5: new Decimal('0'),
        6: new Decimal('0'),
        7: new Decimal('0'),
        8: new Decimal('0'),
        9: new Decimal('0')
      };
      gps1 = new Decimal('0');
      gps2 = new Decimal('0');
      gps3 = new Decimal('0');
      gps4 = new Decimal('0');
      booster = new Decimal('0');
    }
  }
  function calcBooster() {
    boughtStr = new Decimal('0');
    for (var i = 0; i < 10; i++) {
      boughtStr = boughtStr.add(structsHave[i]);
    }
    bpc = boughtStr.multiply(0.2).add(1)
    boosterDeacy = new Decimal('1.001');
    boosterDeacy = boosterDeacy.pow_base(tickGain/500+1);
    if (booster.gt(0.1)) {
      booster = booster.divide(boosterDeacy);
    } else {
      booster = booster.add(booster.multiply('-1'))
    }
    boosterBoost = new Decimal(booster.divide('10').add('1').log(8)+1);
    if (booster.gt('1e10')) {
      boosterBoost = new Decimal(boosterBoost*booster.divide('1e9').log(10));
    }
  }
  function calcExplosion() {
    epBoost = ep.sqrt(2).add(1);
  }
  function firstExplosion() {
    $('#gunpowder').hide();
    $('#gps').hide();
    $('#mainNavs').hide();
    $('#warpMenus').hide();
    $('#explsionScreen').show();
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
    indexThis = $('.structs > span:nth-child(3)').index(this);
    if (indexThis != -1 && gunpowder.greaterThanOrEqualTo(structsCost[indexThis])) {
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
  $(document).on('click','#explsionScreen',function() {
    menuNow = 3;
    displayAll();
    $('#warpMenus > div').hide();
    $('#warpMenus > div:eq(3)').show();
    $('#gunpowder').show();
    $('#gps').show();
    $('#mainNavs').show();
    $('#warpMenus').show();
    $('#explsionScreen').hide();
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
  localStorage[savePoint] = JSON.stringify(saveFile);
  location.reload();
}
