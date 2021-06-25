import { Component, OnInit } from "@angular/core";
import { EChartsOption, graphic } from "echarts";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "eChartsSample";
  chartOption: EChartsOption;
  echart = graphic;
  selectedMonths = 100;
  dataJson = [];
  dateArr = [];
  constructor(private httpClient: HttpClient) {}
  getData() {
    this.httpClient
      .get<any[]>("https://api.gravyt.in/FeedMorStarApi/NavHistoryTest")
      .subscribe((res) => {
        this.dataJson = res;
        this.filterMonth(100)
      });
  }
  ngOnInit() {
    this.getData();
  }

  filterMonth(no) {
    this.bindChart([], []);

setTimeout(() => {
  this.selectedMonths = no;
  var data = [...this.dataJson];
  const dateArr = [];
  const dataArr = [];

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - no);
  const oneMonthBack = [
    currentDate.getFullYear(),
    ("0" + currentDate.getMonth()).slice(-2),
    ("0" + currentDate.getDate()).slice(-2),
  ].join("-");
  data.forEach((val, index) => {
    if (no >= 100 || val.navDate.split("T")[0] >= oneMonthBack.toString()) {
      dateArr.push(val.navDate.split("T")[0]);
      dataArr.push(val.nav);
    }
  });

  this.bindChart(dateArr, dataArr)
}, 300);


  }

  bindChart(dateArr, data) {

    const min1 = Math.round(Math.min(...data)) ;//=> 0
    const max1 = Math.round(Math.max(...data)); //=> 100
    const that = this;
    this.chartOption = {
      tooltip: {
       trigger: "axis",
       position: function(point, params, dom, rect, size){
        // where point is the current mouse position, and size has two properties: viewSize and contentSize, which are the size of the outer div and tooltip prompt box, respectively
var x = point[0];//
var y = point[1];
var viewWidth = size.viewSize[0];
var viewHeight = size.viewSize[1];
var boxWidth = size.contentSize[0];
var boxHeight = size.contentSize[1];
        var posX = 0; // x coordinate position
        var posY = 0; // y coordinate position

        if (x <boxWidth) {// Can't let go on the left
   posX = 5;
        } else {// Left down
   posX = x-boxWidth;
}

        if (y <boxHeight) {// Can't let go above
   posY = 5;
        } else {// The top can be put down
   posY = y-boxHeight;
}

return [posX,posY];

       },
       formatter: function(params) {
         console.log('params',params)
         const label = moment(params[0].axisValue).format("D MMM YYYY")+ "<br />" + "₹" +params[0].data;
        // let time = ''
        // let str = ''
        // time = parseInt(params[0].axisValue)
        // if (time < 10) {
        //   time = '0' + time
        // }
        // str = `Time:${time}:00 <br/>`
        // for (let i = 0; i < params.length; i++) {
        //   str += `${params[i].marker}${params[i].seriesName}：${params[i].value}mm<br/>`
        // }
        return label;
      }
      },
      title: {
        left: "center",
        text: "Index",
      },

      xAxis: {
        type: "category",
        boundaryGap: true,
        data: dateArr,
        axisLabel: {
          formatter: function (value: any) {
            var label = moment(value).format("MMM 'YY");
            if(that.selectedMonths < 12){
              label = moment(value).format("D. MMM");
            }
            return label;
          },
        },
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "100%"],
        min: min1 -5,
        max: max1 + 5,
        maxInterval: 5,
        minInterval: 0,
        splitNumber: 3,
        axisLabel: {
          formatter: function (value: any) {
            var label = "₹" + value;

            return label;
          },
        },

      },

      series: [
        {

          name: "Index",
          showSymbol: false,
          type: "line",
          symbol: "emptyCircle",
          symbolSize:5,
          sampling: "none",
          animation:true,
          itemStyle: {
             color: "#0F4988",
              borderWidth: 3,
              borderColor: "green"
          },
          areaStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#96B7DC'
            }, {
                offset: 1,
                color: '#FFFFFF'
            }])
        },
          data: data,
        },
      ],
    };
  }
}
