$(function (){
  savePoint = 'GunpowderFactory';
  overallBoost = new Decimal('1');
  gunpowder = new Decimal('10');
  gps1 = new Decimal('0');
  gps2 = new Decimal('0');
  gps3 = new Decimal('0');
  gps4 = new Decimal('0');
  gLimit = new Decimal('1e20');
  gLimitLevel = new Decimal('0');
  booster = new Decimal('0');
  bpc = new Decimal('1');
  boughtStr = new Decimal('0');
  boosterBoost = new Decimal('1');
  ep = new Decimal('0');
  epGain = new Decimal('0');
  epBoost = new Decimal('1');
  eCount = new Decimal('0');
  bits = new Decimal('0');
  bitPC = new Decimal('1');
  bitPS = new Decimal('0');
  bitPrestige = new Decimal('0');
  meta = new Decimal('0');
  np = new Decimal('0');
  nCount = new Decimal('0');
  lastTick = new Date().getTime();
  timeNow = new Date().getTime();
  menuNow = 0;
  notationMod = 0;
  titleCool = 10;
  bulkResearch = 0;
  playtime = new Date().getTime();

  $(document).keydown(function(e) {
    if (event.keyCode == '77') {
      buyMaxAll();
    }
    else if (event.keyCode == '69') {
      if (gLimitLevel.gt(0.1) && gunpowder.gt(1e20)) {
        doExplosion();
      }
    }
  });

  function notation(num) {
    if (notationMod == 0) {
      if (num.exponent >= 6) {
        return ((num.gt('1.8e308')) ? 'Infinite': ((num.mantissa).toFixed(2)) + 'e' + num.exponent);
      } else {
        return (num.mantissa*(10**num.exponent)).toFixed(2);
      }
    }
  }
  function normalNotation(num) {
    return ;
  }
  function fixedNum(num) {
    return num.mantissa*10**num.exponent;
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

  function buyMaxAll() {
    buyMaxStr();
  }
  function buyMaxStr() {
    for (var i = 9; i >= 0; i--) {
      pubExpeThis = new Decimal(Math.log10((i+1)/5+1));
      leftOOM = new Decimal(gunpowder.divide(structsCost[i]).log(10));
      buyable = new Decimal(Math.max(Math.floor(leftOOM.divide(pubExpeThis))+1, 0));
      if (buyable.gt(0)) {
        structsHave[i] = structsHave[i].add(buyable);
        gunpowder = gunpowder.minus(structsCost[i].multiply(pubExpeThis.pow_base(10).pow(buyable-1)));
        switch (structsPower[i][1]) {
          case 1:
            gps1 = gps1.add(buyable.multiply(structsPower[i][0]));
            break;
          case 2:
            gps2 = gps2.add(buyable.multiply(structsPower[i][0]));
            break;
          case 3:
            gps3 = gps3.add(buyable.multiply(structsPower[i][0]));
            break;
          case 4:
            gps4 = gps4.add(buyable.multiply(structsPower[i][0]));
            break;
        }
        structsCost[i] = structsCost[i].multiply(pubExpeThis.pow_base(10).pow(buyable));
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
      case 4:
        displayBitPeak();
        break;
    }
  }
  function displayUnlocks() {
    if (eCount.gt(0)) {
      $('#mainNavs > span:eq(3)').show();
    }
    if (researchBoost[4].gt(100)) {
      $('#mainNavs > span:eq(4)').show();
    }
    if (researchBoost[4].gt(1e10)) {
      $('#mainNavs > span:eq(5)').show();
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
    if (gLimitLevel.gt(0.1) && gunpowder.gt(1e20)) {
      $('#explosionNow').show();
      $('#explosionNow > p').html(function (index,html) {
        return 'Explode Now and get (E)<br>' + notation(epGain) + ' EP';
      });
    } else {
      $('#explosionNow').hide();
    }
  }
  function displayBooster() {
    $('#booster').html(function (index,html) {
      return 'You have ' + notation(booster) + ' Boosters -> x' + notation(boosterBoost) + ' production';
    });
    $('#boostButton').html(function (index,html) {
      return 'Boost! (+' + notation(bpc) + ')';
    });
  }
  function displayExplosion() {
    $('#explosionPoint').html(function (index,html) {
      return 'You have ' + notation(ep) + ' Explosion Point -> x' + notation(epBoost) + ' production';
    });
    if (bitUpgradeBought[1] == 1) {
      $('#bulkResearch').show();
    } else {
      $('#bulkResearch').hide();
    }
    $('#explosionResearchWarp > div > span:nth-child(2)').html(function (index,html) {
      return notation(researchAssign[index]) + ' Working';
    });
    $('#explosionResearchWarp > div > span:nth-child(3)').html(function (index,html) {
      switch (index) {
        case 0:
          return '+' + notation(researchBoost[index]);
          break;
        case 1:
          return 'x' + notation(researchBoost[index].pow_base('5'));
          break;
        case 2: case 3:
          return 'x' + notation(researchBoost[index]);
          break;
        case 4:
          return notation(researchBoost[index]) + '/' + ((researchBoost[index].gt(100)) ? ((researchBoost[index].gt(1e10)) ? 'Maxed' : '1.00e10') : '100.0');
          break;
      }
    });
  }
  function displayBitPeak() {
    $('#bitDisplay').html(function (index,html) {
      return 'You have ' + notation(bits) + '/' + notation(bitShift.multiply(2**20-1)) + ' bits';
    });
    $('#bitpsDisplay').html(function (index,html) {
      return notation(bitPS) + 'b/s';
    });
    $('#bits > p').html(function (index,html) {
      return fixedNum(bitOpen[19-index]);
    });
    $("#bits > p:contains('0')").css('color', '#216622');
    $("#bits > p:contains('0')").css('text-shadow', '');
    $("#bits > p:contains('1')").css('color', '#34eb37');
    $("#bits > p:contains('1')").css('text-shadow', '0 0 7px #34eb37');
    if (bits.greaterThanOrEqualTo(bitShift.multiply(2**20-1))) {
      $("#bits > p:contains('1')").css('color', '#eb3434');
      $("#bits > p:contains('1')").css('text-shadow', '0 0 7px #eb3434');
    }
    $('#bitButton').html(function (index,html) {
      return 'Add bit! (+' + notation(bitPC) + ')';
    });
    $('#bitThingWarp > div:nth-child(1) > div > span:nth-child(2)').html(function (index,html) {
      return bitBoostOperator[index] + notation(bitBoost[index]);
    });
    $('#bitThingWarp > div:nth-child(2) > span > p:nth-child(2)').html(function (index,html) {
      return 'Cost: ' + notation(bitProductionCost[index]) + ((index == 0) ? ' Gunpowder' : ((index == 1 || index == 2) ? ' EP' : ((index == 3) ? ((researchCount[4].gt(1e10)) ? ' Meta' : '????' ) : ((index == 4) ? ' bits' : '' ) ) ) );
    });
    for (var i = 0; i < 5; i++) {
      resThis = ((i == 0) ? gunpowder : ((i == 1 || i == 2) ? ep : ((i == 3) ? meta : ((i == 4) ? bits : '' ) ) ) );
      $('#bitThingWarp > div:nth-child(2) > span:eq(' + i + ')').attr({
        'class' : 'bitBuy' + ((resThis.gt(bitProductionCost[i])) ? 'Y' : 'N')
      });
    }
    for (var i = 0; i < 10; i++) {
      $('#bitThingWarp > div:nth-child(3) > span:eq(' + i + ')').attr({
        'class' : 'bitBuy' + ((bitUpgradeBought[i] == 1) ? 'B' : ((bits.gt(bitUpgradeCost[i])) ? 'Y' : 'N') )
      });
    }
    $('#bitThingWarp > div:nth-child(4) > p:nth-child(2)').html(function (index,html){
      return 'Prestige count: ' + fixedNum(bitPrestige);
    });
  }

  function calcAll() {
    calcExplosion();
    calcBooster();
    calcBasic();
    calcBitPeak();
    calcBeforeBreak();
  }
  function calcBasic() {
    overallBoost = boosterBoost.multiply(epBoost).multiply(bitBoost[0]).multiply(((bitUpgradeBought[0] == 1) ? 5 : 1 ));
    gps3 = gps3.add(gps4.multiply(overallBoost).multiply(tickGain));
    gps2 = gps2.add(gps3.multiply(overallBoost).multiply(tickGain));
    gps1 = gps1.add(gps2.multiply(overallBoost).multiply(tickGain));
    gunpowder = gunpowder.add(gps1.multiply(overallBoost).multiply(tickGain));
    calcBeforeBreak();
    gLimit = gLimitLevel.pow_base('5').multiply('1e20');
    if (gLimitLevel.gt(0.1) && gunpowder.gt(1e20)) {
      epGain = new Decimal('1').multiply(researchBoost[2]).multiply(gunpowder.divide('1e20').log(2)).add('1');
    }
    if (gunpowder.gt(gLimit)) {
      if (gLimitLevel.lt(0.1)) {
        epGain = new Decimal('1').multiply(researchBoost[2]);
        if (eCount.lt(10)) {
          firstExplosion();
        }
        doExplosion();
      } else {
        gunpowder = gLimit;
        epGain = new Decimal('1').multiply(researchBoost[2]).multiply(gunpowder.divide('1e20').log(2)).add('1');
        doExplosion();
      }
    }
  }
  function calcBooster() {
    boughtStr = new Decimal('0');
    for (var i = 0; i < 10; i++) {
      boughtStr = boughtStr.add(structsHave[i]);
    }
    bpc = boughtStr.multiply(0.2).add(1).multiply(researchBoost[3]).multiply(bitBoost[1]).pow(((bitUpgradeBought[3] == 1) ? 0.1 : 1 ));
    boosterDeacy = new Decimal('1.001');
    boosterDeacy = boosterDeacy.pow_base(tickGain/500+1);
    if (booster.gt(0.1)) {
      booster = booster.divide(boosterDeacy);
    } else {
      booster = booster.add(booster.multiply('-1'));
    }
    boosterBoost = new Decimal(booster.divide('10').add('1').log(8)+1);
    if (booster.gt('1e10')) {
      boosterBoost = new Decimal(boosterBoost*booster.divide('1e9').log(10));
    }
    boosterBoost = boosterBoost.pow(bitBoost[2]).multiply(((bitUpgradeBought[3] == 1) ? boosterBoost.pow(0.2) : 1 ));
  }
  function calcExplosion() {
    epBoost = ep.sqrt(2).add(1);
    researchProgressSpeed = new Decimal('0.99');
    researchProgressGain = researchProgressSpeed.pow(tickGain/5*((bitUpgradeBought[2] == 1) ? 10 : 1 )).multiply(-1).add(1);
    for (var i = 0; i < 10; i++) {
      if (researchAssign[i].gt(0)) {
        researchCount[i] = researchCount[i].add(researchAssign[i].multiply(researchProgressGain));
        researchAssign[i] = researchAssign[i].minus(researchAssign[i].multiply(researchProgressGain));
      } else {
        researchAssign[i] = new Decimal('0');
      }
    }
    researchBoost[0] = researchCount[0].pow(3);
    researchBoost[1] = researchCount[1];
    gLimitLevel = researchCount[1];
    researchBoost[2] = new Decimal(researchCount[2].divide(3).add(1).log(3)+1);
    researchBoost[3] = researchCount[3].pow_base(2);
    researchBoost[4] = researchCount[4];
  }
  function calcBitPeak() {
    bitShift = new Decimal(bitPrestige.pow_base(8).divide(bitProductionBought[4].pow_base(2)))
    bitPC = new Decimal('1');
    bitPC = bitPC.add(bitBoost[5]).multiply(bitProductionBought[2].pow_base(3));
    bitPS = new Decimal('0');
    bitPS = bitPS.add(bitProductionBought[0]).add(bitProductionBought[1]).multiply(bitProductionBought[3].pow_base(1.7));
    bits = bits.add(bitPS.multiply(tickGain))
    if (bits.gt(bitShift.multiply(2**20-1))) {
      bits = bitShift.multiply(2**20-1);
    }
    fixedBit = Math.round(fixedNum(bits.divide(bitShift)));
    for (var i = 0; i < 20; i++) {
      bitOpen[i] = ((2**i-2 < (fixedBit-1)%(2**(i+1)) && (fixedBit-1)%(2**(i+1)) < 2**(i+1)-1) ? new Decimal(1) : new Decimal(0));
    }
    bitBoost = {
      0: new Decimal(bitPrestige.pow_base(4200)),
      1: new Decimal(bitPrestige.pow_base(35000)),
      2: new Decimal(bitPrestige.multiply(0.3).add(1)),
      3: new Decimal(bitPrestige.multiply(3)),
      4: new Decimal(bitPrestige.pow_base(6)),
      5: new Decimal(bitPrestige.multiply(30)),
      6: new Decimal(bitPrestige.pow_base(10))
    };
    for (var i = 0; i < 20; i++) {
      if (bitOpen[i] == 1) {
        switch (bitEffect[i][0]) {
          case 0: case 1: case 4: case 6:
            bitBoost[bitEffect[i][0]] = bitBoost[bitEffect[i][0]].multiply(bitEffect[i][1]);
            break;
          case 2: case 3: case 5:
            bitBoost[bitEffect[i][0]] = bitBoost[bitEffect[i][0]].add(bitEffect[i][1]);
            break;
        }
      }
    }
    bitProductionCost = {
      0: new Decimal(bitProductionBought[0].pow_base('1e10').multiply('1e50')),
      1: new Decimal(bitProductionBought[1].pow_base('9').multiply('1e3')),
      2: new Decimal(bitProductionBought[2].pow('2').pow_base('1e5').multiply('1e5')),
      3: new Decimal(bitProductionBought[3].pow_base('1e9999').multiply('1e9999')),
      4: new Decimal(bitProductionBought[4].pow_base('10').multiply('1e7'))
    }
  }
  function calcBeforeBreak() {
    ((gunpowder.gt('1.8e308')) ? gunpowder = new Decimal('1.79e308') : '' );
    ((gLimit.gt('1.8e308')) ? gLimit = new Decimal('1.79e308') : '' );
    ((booster.gt('1.8e308')) ? booster = new Decimal('1.79e308') : '' );
  }

  function firstExplosion() {
    $('#gunpowder').hide();
    $('#gps').hide();
    $('#mainNavs').hide();
    $('#warpMenus').hide();
    $('#explsionScreen').show();
  }
  function doExplosion() {
    eCount = eCount.add('1');
    ep = ep.add(epGain).multiply(bitBoost[4]);
    gunpowder = new Decimal(researchBoost[0].add('10'));
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

  $(document).on('click','#mainNavs > span',function() {
    indexThis = $('#mainNavs > span').index(this);
    menuNow = indexThis;
    displayAll();
    $('#warpMenus > div').hide();
    $('#warpMenus > div:eq(' + indexThis + ')').show();
  });
  $(document).on('click','#boostButton',function() {
    booster = booster.add(bpc);
    calcBeforeBreak();
    calcBooster();
    displayBooster();
  });
  $(document).on('click','#strBuyMax',function() {
    buyMaxStr();
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
  $(document).on('click','#bulkResearch > span',function() {
    indexThis = $('#bulkResearch > span').index(this);
    bulkResearch = indexThis;
  });
  $(document).on('click','#explosionResearchWarp > div > span:nth-child(4)',function() {
    indexThis = $('#explosionResearchWarp > div > span:nth-child(4)').index(this);
    switch (bulkResearch) {
      case 0:
        toUse = new Decimal(1);
        break;
      case 1:
        toUse = ep.divide(10);
        break;
      case 2:
        toUse = ep.divide(4);
        break;
      case 3:
        toUse = ep.divide(2);
        break;
      case 4:
        toUse = ep;
        break;
    }
    if (ep.greaterThanOrEqualTo(1)) {
      researchAssign[indexThis] = researchAssign[indexThis].add(toUse);
      ep = ep.minus(toUse);
    }
  });
  $(document).on('click','#explosionNow',function() {
    doExplosion();
  });
  $(document).on('click','#bitButton',function() {
    bits = bits.add(bitPC);
  });
  $(document).on('click','#bitNavs > span',function() {
    indexThis = $('#bitNavs > span').index(this);
    $('#bitThingWarp > div').hide();
    $('#bitThingWarp > div:eq(' + indexThis + ')').show();
  });
  $(document).on('mouseover','#bits > p',function(e) {
    thisCell = 19-$("#bits > p").index(this);
    $('#bitDesc > span:nth-child(1)').html(function (index,html) {
      return 'Bit Nr' + (thisCell+1);
    });
    $('#bitDesc > span:nth-child(2)').html(function (index,html) {
      return ((thisCell != 16 || researchBoost[4].gt(1e10)) ? bitBoostName[bitEffect[thisCell][0]] : '??? gain' ) + ' ' + ((bitEffect[thisCell][0] == 2) ?  '+' : '' ) + bitBoostOperator[bitEffect[thisCell][0]] + bitEffect[thisCell][1] + ((bitEffect[thisCell][0] == 3) ?  ' level' : '' );
    });
  });
  $(document).on('click','#bitThingWarp > div:nth-child(2) > span:not(.bitBuyN)',function() {
    indexThis = $('#bitThingWarp > div:nth-child(2) > span').index(this);
    switch (indexThis) {
      case 0:
        gunpowder = gunpowder.minus(bitProductionCost[indexThis]);
        bitProductionBought[indexThis] = bitProductionBought[indexThis].add(1);
        break;
      case 1: case 2:
        ep = ep.minus(bitProductionCost[indexThis]);
        bitProductionBought[indexThis] = bitProductionBought[indexThis].add(1);
        break;
      case 3:

        break;
      case 4:
        bits = bits.minus(bitProductionCost[indexThis]);
        bitProductionBought[indexThis] = bitProductionBought[indexThis].add(1);
        break;
    }
  });
  $(document).on('click','#bitThingWarp > div:nth-child(3) > span:not(.bitBuyN):not(.bitBuyB)',function() {
    indexThis = $('#bitThingWarp > div:nth-child(3) > span').index(this);
    bits = bits.minus(bitUpgradeCost[indexThis]);
    bitUpgradeBought[indexThis]++;
  });
  $(document).on('click','#bitThingWarp > div:nth-child(4) > div',function() {
    if (bits.greaterThanOrEqualTo(bitShift.multiply(2**20-1))) {
      bitPrestige = bitPrestige.add(1);
      bits = new Decimal(0);
    }
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
    if (titleCool < 0) {
      $('title').html(function (index,html) {
        return 'You Have ' + notation(gunpowder.add(gps1.multiply(overallBoost).multiply(tickGain))) + ' Gunpowder';
      });
    } else {
      titleCool -= 5;
    }
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
