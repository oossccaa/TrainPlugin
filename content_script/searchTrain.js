switch (location.pathname) {
    case '/tra-tip-web/tip/tip001/tip112/gobytime':
        chrome.runtime.sendMessage({ func: 'getSearch' }, runTrainByTime)
        break
    case '/tra-tip-web/tip/tip001/tip112/gobystation':
        chrome.runtime.sendMessage({ func: 'getSearch' }, runTrainByStation)
        break
    case '/tra-tip-web/tip/tip001/tip112/gobytrainno':
        chrome.runtime.sendMessage({ func: 'getSearch' }, runTrainByTrainno)
}

function runTrainByTime(res) {
    if(!res){
        return 
    }
    //起站
    document.getElementById('startStation').value = res.startStation
    //迄站
    document.getElementById('endStation').value = res.endStation
    //轉乘條件 點選 => 接受轉乘
    if (res.isTransfer)
        document.querySelector('.zone.form-horizontal #option2').click()
    else 
        document.querySelector('.zone.form-horizontal #option1').click()

    //日期
    document.getElementById('rideDate').value = res.rideDate.replace(/-/g,'/')
    //開始時間
    document.getElementById('startTime').value = res.startTime
    //結束時間
    document.getElementById('endTime').value = res.endTime
    //查詢出發時間/抵達時間
    if(res.timeType === 'departure')
        document.getElementById('startOrEndTime1').click()
    else
        document.getElementById('startOrEndTime2').click()
    // 車種
    if(res.checkType === 'all'){
        document.getElementById('trainTypeList1').click()
    }else if(res.checkType === 'checkmark'){
        document.getElementById('trainTypeList2').click()
    }else{
        document.getElementById('trainTypeList3').click()
    }
    //送出
    document.querySelector('input[type="submit"]').click()
}

function runTrainByStation(res) {
    if(!res){
        return 
    }
    // 日期
    document.getElementById('rideDate').value = res.rideDate.replace(/-/g,'/')
    // 車站
    document.getElementById('station').value = res.singleStation
    // 送出
    document.querySelector('input[type="submit"]').click()
}

function runTrainByTrainno(res) {
    if(!res){
        return 
    }
    // 日期
    document.getElementById('rideDate').value = res.rideDate.replace(/-/g,'/')
    // 車號
    document.getElementById('trainNo').value = res.trainNo
    // 送出
    document.querySelector('input[type="submit"]').click()
}
