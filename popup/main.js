Vue.component('Titles', {
    props: ['current'],
    data() {
        return {
            data: {
                time: '依時刻',
                station: '依車站',
                trainno: '依車次'
            }
        }
    },
    computed: {
        others() {
            return Object.keys(this.data).filter(item => item !== this.current)
        }
    },
    methods: {
        switchPage(page) {
            this.$emit('switch-page', page)
        }
    },
    template: `
    <div class="titles">
      <span v-if="current !=='history'">{{data[current]}}查詢</span>
      <span v-else>歷史記錄</span>
      <a v-for="key in others" :key="key" @click="switchPage(key)">{{data[key]}}</a>
      <a class="right" @click="switchPage('history')" v-if="current !=='history'">歷史記錄</a>
    </div>`
})

var app = new Vue({
    el: '#app',
    data() {
        return {
            currentPage: 'time',
            title: '依時刻查詢',
            trainList: [],
            category: [],
            historyList:[],
            startCategory: '',
            endCategory: '',
            searchForm: {
                startStation: '',
                endStation: '',
                isTransfer: false, // 是否接受轉乘,默認直達
                rideDate: '', // YYYY/MM/DD
                startTime: '00:00', // hh:mm
                endTime: '23:59', // hh:mm
                timeType: 'departure', // departure 或 arrival 時間類型
                checkType: 'all', // all 或 checkmark 或 non-checkmark 對號
                singleStation: '', //單一車站
                trainNo: '' // 列車編號
            },
            dataService: null
        }
    },
    computed: {
        timeOptions() {
            let times = []
            for (var n = 0; n < 24; n++) {
                if (n < 10) {
                    times.push(`0${n}:00`)
                    times.push(`0${n}:30`)
                } else {
                    times.push(`${n}:00`)
                    times.push(`${n}:30`)
                }
            }
            times.push('23:59')
            return times
        },
        startTrainList(){
            if(this.startCategory){
                return this.trainList.filter(item=>item.parent === this.startCategory)
            }
            return this.trainList
        },
        endTrainList(){
            if(this.endCategory){
                return this.trainList.filter(item=>item.parent === this.endCategory)
            }
            return this.trainList
        }
    },
    filters:{
        formatType(value){
            switch(value.type){
                case 'time':
                    return '依時刻'
                case 'station':
                    return '依車站'
                case 'trainno':
                    return '依車次'
            }
        },
        formatContent(value){
            switch(value.type){
                case 'time':
                    return `${value.startStation} -> ${value.endStation}`
                case 'station':
                    return value.singleStation
                case 'trainno':
                    return value.trainNo
            }
        }
    },
    methods: {
        switchPage(page) {
            this.currentPage = page
        },
        submitSearch() {
            if(
                dayjs().isAfter(dayjs(this.searchForm.rideDate)) && 
                this.searchForm.rideDate != dayjs().format('YYYY-MM-DD')
            ){
                alert('日期必須大於昨日')
                return 
            }
            switch (this.currentPage) {
                case 'time':
                    if(!this.searchForm.startStation || !this.searchForm.endStation){
                        alert('站點不得為空')
                        return 
                    }
                    this.dataService.searchByTime(this.searchForm)
                    break
                case 'station':
                    if(!this.searchForm.singleStation){
                        alert('站點不得為空')
                        return 
                    }
                    this.dataService.searchByStation(this.searchForm)
                    break
                case 'trainno':
                    if(!this.searchForm.trainNo){
                        alert('列車編號不得為空')
                        return 
                    }
                    this.dataService.searchByTrainNo(this.searchForm)
                    break
            }
        },
        clearCondition() {
            this.searchForm = {
                startStation: '',
                endStation: '',
                isTransfer: false, 
                rideDate: '', 
                startTime: '00:00', 
                endTime: '23:59', 
                timeType: 'departure',
                checkType: 'all', 
                singleStation: '', 
                trainNo: '' 
            }
        },
        useHistory(history){
            switch(history.type){
                case 'time':
                    this.searchForm.startStation = history.startStation
                    this.searchForm.endStation = history.endStation
                    this.searchForm.isTransfer = history.isTransfer
                    this.searchForm.startTime = history.startTime
                    this.searchForm.endTime = history.endTime
                    this.searchForm.timeType = history.timeType
                    this.searchForm.checkType = history.checkType
                    break
                case 'station':
                    this.searchForm.singleStation = history.singleStation
                    break
                case 'trainno':
                    this.searchForm.trainNo = history.trainNo
                    break
            }
            this.searchForm.rideDate = history.rideDate
            this.currentPage = history.type
        }
    },
    mounted() {
        //更新資料
        chrome.runtime.getBackgroundPage(background => {
            this.dataService = background.trainManager
            this.dataService.fetchTraniList().then(res=>{
                this.trainList = res['train-list']
                this.category = res['category']
            })


            this.dataService.fetchHistoryList().then(historys=>{
                this.historyList = historys
            })
        })
        
        this.searchForm.rideDate = dayjs().format('YYYY-MM-DD')
    }
})
