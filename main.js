
// テストモード 
const debugMode = true
// 最初に放送終了したい曜日のindex
const startDayIndex = 3

const dayListDef = [
  {
    title: '月曜日',
    endFlag: false,
    endDateTime: '2019-02-25T05:00:00+09:00'
  },
  {
    title: '火曜日',
    endFlag: false,
    endDateTime: '2019-02-26T05:00:00+09:00'
  },
  {
    title: '水曜日',
    endFlag: false,
    endDateTime: '2019-02-27T05:00:00+09:00'
  },
  {
    title: '木曜日',
    endFlag: false,
    endDateTime: '2019-02-28T05:00:00+09:00'
  },
  {
    title: '金曜日',
    endFlag: false,
    endDateTime: '2019-02-22T05:00:00+09:00'
  },
  {
    title: '土曜日',
    endFlag: false,
    endDateTime: '2019-02-23T05:00:00+09:00'
  },
  {
    title: '日曜日',
    endFlag: false,
    endDateTime: '2019-02-24T05:00:00+09:00'
  }
]

const dateFormart = function (date, format) {
  if (!format) format = 'YYYY-MM-DD hh:mm:ss'
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  return format
}

var app = new Vue({
  el: '#app',
  data: {
    nowDateTime: 0,
    intervalId: undefined,
    interval: 10,  //10秒間隔
    cancel: false,
    dayList: dayListDef,
  },
  methods: {
    do: function () {
      //2. 一定間隔で処理を実行するためメソッドを用意します
      this.intervalId = setInterval(() => {  
        //処理内容
        this.nowDateTime = Date.now()
        this.moveDay()
      }, this.interval * 1000)
    },
    moveDay: function () {
      // 全てが放送終了の場合setIntervalをキャンセルするフラグをON
      let notEndList = this.dayList.find(function(day) {
        return !day.endFlag
      })
      if (notEndList === undefined) {
        this.cancel = true
        return false
      }
      //　曜日リストのendFlagの書き込み
      this.dayList.forEach(function(day, index) {
        const endDateTime = new Date(day.endDateTime).getTime()
        if (endDateTime < this.nowDateTime) {
          day.endFlag = true
        }
      }, this)
      let notEndDayList = this.dayList.filter(function(day) {
        return !day.endFlag
      })
      let endDayList = this.dayList.filter(function(day) {
        return day.endFlag
      })
      // 未放送分ソート
      notEndDayList.sort(function(a, b) {
        if (a.endDateTime > b.endDateTime) return 1;
        if (a.endDateTime < b.endDateTime) return -1;
        return 0;
      })
      // 放送終了分ソート
      endDayList.sort(function(a, b) {
        if (a.endDateTime > b.endDateTime) return 1;
        if (a.endDateTime < b.endDateTime) return -1;
        return 0;
      })
      // マージ
      this.dayList = notEndDayList.concat(endDayList)
    },
    shift: function () {
      const arr = this.dayList.shift()
      this.dayList.push(arr)
    },
    // 動作確認用に放送終了日時を現在から10秒間隔に設置する
    setEndTime: function () {
      let endDateTime = new Date(this.nowDateTime);
      let index = startDayIndex
      const maxIndex = this.dayList.length - 1
      for (let i = 0; i <= maxIndex; i++) {
        endDateTime.setSeconds(endDateTime.getSeconds() + 10);
        let strDate = dateFormart(endDateTime, 'YYYY-MM-DDThh:mm:ss')
        strDate = strDate + '+09:00'
        this.dayList[index].endDateTime = strDate
        index += 1
        if (index > maxIndex) index = 0 
      }
    }
  },
  computed: {
    nowDateTimeFormat: function() {
      const dd = new Date()
      dd.setTime(this.nowDateTime)
      return dateFormart(dd, 'YYYY-MM-DD hh:mm:ss')
    }  
  },
  created () {
    this.nowDateTime = Date.now();
    if (debugMode) {
      this.setEndTime()
    }
  },
  mounted() {
    // 一度リストを描画させるためメソッドを呼び出し
    // createのタイミングでもよいのだが、動きが見えないのでmountedで実行
    this.moveDay()
    this.do()
  },
  watch: {
    cancel: function(cancel) {
      if (cancel) {
        clearInterval(this.intervalId)
      }
    }
  },
  beforeDestroy() {    //4. 使用後はしっかりとクリアする必要があります
    clearInterval(this.intervalId)
  }
})
