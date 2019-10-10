class TrainManager {
    constructor() {
        this.actionData = null // content script data
        chrome.runtime.onMessage.addListener(this.msgListener)

        chrome.storage.sync.get('history',value=>{
            if(!value.history){
                chrome.storage.sync.set({'history':[]})
            }
        })
    }

    //從json取得車站清單
    fetchTraniList() {
        return new Promise((resolve,reject)=>{
            fetch('./store/train.json')
            .then(res => {
                return res.json()
            })
            .then(data => {
                resolve(data)
            })
        })

    }

    searchByTime(params) {
        //將參數存入變數
        this.actionData = {
            type: 'time',
            startStation: params.startStation, //開始時間
            endStation: params.endStation, //結束時間
            rideDate: params.rideDate, //查詢日期
            timeType: params.timeType, //時間類型
            startTime: params.startTime, //開始時間
            endTime: params.endTime, //結束時間
            trainNo: params.trainNo, //列車編號
            isTransfer: params.isTransfer, //接受轉乘
            checkType: params.checkType //對號
        }
        //開啟新頁面
        chrome.tabs.create(
            {
            url:'https://tip.railway.gov.tw/tra-tip-web/tip/tip001/tip112/gobytime'
        })
    }

    searchByStation(params) {
        //將參數存入變數
        this.actionData = {
            type: 'station',
            rideDate: params.rideDate,
            singleStation: params.singleStation
        }
        //開啟新頁面
        chrome.tabs.create({
            url:'https://tip.railway.gov.tw/tra-tip-web/tip/tip001/tip112/gobystation'
        })
    }

    searchByTrainNo(params) {
        //將參數存入變數
        this.actionData = {
            type: 'trainno',
            rideDate: params.rideDate,
            trainNo: params.trainNo
        }
        //開啟新頁面
        chrome.tabs.create({
            url:'https://tip.railway.gov.tw/tra-tip-web/tip/tip001/tip112/gobytrainno'
        })
    }

    saveActionData(){
        chrome.storage.sync.get('history',value=>{
            //移除最舊的資料
            let historys = value.history
            if(historys.length > 4 ){
                historys.splice(0, 1)
            }
            historys.push(this.actionData)
            this.actionData = null
            chrome.storage.sync.set({'history':historys})
        })
    }

    fetchHistoryList(){
        return new Promise((resolve,reject)=>{
            chrome.storage.sync.get('history',value=>{
                resolve(value.history)
            })
        })
    }

    msgListener(request, sender, sendResponse){
        switch(request.func){
            case 'getSearch': 
                sendResponse(trainManager.actionData)
                trainManager.saveActionData()
                break
        }   
    }
}

var trainManager = new TrainManager()
