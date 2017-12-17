var jsonStore = [];
var FavoriteList =[];//store all data
var FavoriteList0 = [];//store symbol only
var autoRefreshfunc;
var chartNum = 0;
var chartOpt = [];
$(document).ready(function() {
    if (screen.width >= 600) {
      var FavoriteListtmp = JSON.parse(localStorage.getItem('LS_FavoriteList'));
      var FavoriteList0tmp = JSON.parse(localStorage.getItem('LS_FavoriteList0'));
      if(FavoriteListtmp && FavoriteList0tmp) {
        FavoriteList = FavoriteListtmp;
        FavoriteList0 = FavoriteList0tmp;
      }
    }
    Comeon = localStorage.getItem('Comeon');
    console.log(FavoriteList);
    console.log(FavoriteList0);
    if(FavoriteList0 && FavoriteList0.length>0) ChangeFavoriteTable();
    $("#search").click(function() {
        $("#StockDetailsTable0").hide();
        $("#StockDetailsTable").show();
        $("#News0").hide();
        $("#News11").show();
        LoadingBar();
        $("#FavoriteDelet").hide();
        $("#FavoriteAdd").show();
        $("#FavoriteDelet").prop('disabled', true);
        $("#FavoriteAdd").prop('disabled', true);
        $("#FavoriteFB").prop('disabled', true);
        Reset();
        GetData($("#Symbol").val());
    }),
    $("#Read").click(function() {
      //test data for sortby and order
      FavoriteList =[["AB",900,-1,-0.1,1000,1],["AC",700,5,0.5,5000,2],["CD",600,33,0.33434,70000,3],["EC",400,60,0.12,500000,4]];
      FavoriteList0 = ["AB","CD","EC","AC"];
      ChangeFavoriteTable();
    })
    $("#Clear").click(function() {
      $("#Symbol").val("");//may cause problem
    })
    if (screen.width >= 600) {
      $("#CScardshd").html("<i class='fa fa-tachometer' aria-hidden='true'></i>Current Stock</a>");
      $("#HCcardshd").html("<i class='fa fa-bar-chart' aria-hidden='true'></i>Historical Charts</a>");
      $("#NFcardshd").html("<i class='fa fa-link' aria-hidden='true'></i>News Feeds</a>");
    }
    if (screen.width < 600) {
      $("#CScardshd").html("<i class='fa fa-tachometer' aria-hidden='true'></i>Stock</a>");
      $("#HCcardshd").html("<i class='fa fa-bar-chart' aria-hidden='true'></i>Charts</a>");
      $("#NFcardshd").html("<i class='fa fa-link' aria-hidden='true'></i>News</a>");
    }
    $("#FavoriteAdd").click(function() {
      $("#FavoriteAdd").hide();
      $("#FavoriteDelet").show();
      if(FavoriteList) {
        FavoriteElmt = [title,ylastPrice,yChange1,yChange2,parseInt(yVolume2),FavoriteList.length+1];
      }
      else FavoriteElmt = [title,ylastPrice,yChange1,yChange2,parseInt(yVolume2),1];
      FavoriteList.push(FavoriteElmt);
      FavoriteList0.push(title);
      if(asdes == 0) AscendingSort(sortidx);
      else DescendingSort(sortidx);
      ChangeFavoriteTable();
      console.log(FavoriteList);
      console.log(FavoriteList0);
    });
    $("#FavoriteDelet").click(function() {
      $("#FavoriteDelet").hide();
      $("#FavoriteAdd").show();
      for(var i=0; i<FavoriteList.length;i++) {
        if(FavoriteList[i][0]==title) {
          FavoriteList.splice(i, 1);
          FavoriteList0.splice(i, 1);
        }
      }
      ChangeFavoriteTable();
      console.log(FavoriteList);
      console.log(FavoriteList0);
    });
    $("#Refresh").click(function(){Refresh();});
    $("#FavoriteFB").click(function() {
      FBGetHighchartUrl();
    });
    $('#AutoRefreshtoggleOff').click(function() {
      $('#AutoRefreshtoggleOn').show();
      $('#AutoRefreshtoggleOff').hide();
      autoRefreshfunc = setInterval(function(){ Refresh() }, 5000);
    });
    $('#AutoRefreshtoggleOn').click(function() {
      $('#AutoRefreshtoggleOff').show();
      $('#AutoRefreshtoggleOn').hide();
      clearInterval(autoRefreshfunc);
    });
    //test data for sortby and order
    //FavoriteList =[["AB",900,-1,-0.1,1000,1],["AC",700,5,0.5,5000,2],["CD",600,33,0.33434,70000,3],["EC",400,60,0.12,500000,4]];
    //FavoriteList0 = ["AB","CD","EC","AC"];
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '290445991473512',
        xfbml      : true,
        status     : true,
        version    : 'v2.11'
      });
      FB.AppEvents.logPageView();
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  /*
  FB.init({
    appId            : '290445991473512',
    autoLogAppEvents : true,
    status           : true,
    cookie           : true,
    xfbml            : true,
    version          : 'v2.11'
  });
  */
});

function GetData(TargetSymbol) {
  title = TargetSymbol;
  $.ajax({
      type: "GET",
      url: "http://ec2-52-53-233-237.us-west-1.compute.amazonaws.com?inSymbol="+TargetSymbol+"&idx=quickSearch",
      dataType: "json",
      success: function(data) {
          if (data.msg) {
          }
          else {
            //console.log(data);
            generateData_Table(data);
            if(yTimestamp) {
              fillTable();
              $("#StockDetailsTable0").show();
              $("#StockDetailsTable").hide();
            }
            var found=0;
            if(FavoriteList0) {
              for(var i=0; i<FavoriteList0.length;i++) {
                if(FavoriteList0[i]==TargetSymbol) {
                  found=1;
                }
              }
            }
            if(!found) {
              $("#FavoriteDelet").hide();
              $("#FavoriteAdd").show();
            }
            else {
              $("#FavoriteDelet").show();
              $("#FavoriteAdd").hide();
            }
            $("#FavoriteDelet").prop('disabled', false);
            $("#FavoriteAdd").prop('disabled', false);
            $("#FavoriteFB").prop('disabled', false);
          }
      },
      error: function(jqXHR) {
          $('#StockDetailsTable').html("<br><br><br><br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get current stock data</div><br><br><br>");
      },
      timeout:10000
  }),
  $.ajax({
      type: "GET",
      url: "http://ec2-52-53-233-237.us-west-1.compute.amazonaws.com?inSymbol="+TargetSymbol+"&idx=stocktInfo0",
      dataType: "json",
      success: function(data) {
          if (data.msg) {
            $('#highchartcontainerPrice').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get Price data</div><br><br><br>");
          }
          else {
            generateData_Price(data);
            if(yyPrice.length!=0) StockPrice(xxDate0,yyPrice,yyVolume);
          }
      },
      error: function(jqXHR) {
        $('#highchartcontainerPrice').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get Price data</div><br><br><br>");
      },
      timeout:10000
  }),
  $.ajax({
      type: "GET",
      url: "http://ec2-52-53-233-237.us-west-1.compute.amazonaws.com?inSymbol="+TargetSymbol+"&idx=SMA",
      dataType: "json",
      success: function(data) {
          if (data.msg) {
            $('#highchartcontainerSMA').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get SMA data</div><br><br><br>");
          }
          else {
            generateData_SMA(data);
            if(yySMA.length!=0) SMA(xxDate1,yySMA);
          }
      },
      error: function(jqXHR) {
        $('#highchartcontainerSMA').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get SMA data</div><br><br><br>");
      },
      timeout:10000
  }),
  $.ajax({
      type: "GET",
      url: "http://ec2-52-53-233-237.us-west-1.compute.amazonaws.com?inSymbol="+TargetSymbol+"&idx=EMA",
      dataType: "json",
      success: function(data) {
          if (data.msg) {
            $('#highchartcontainerEMA').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get EMA data</div><br><br><br>");
          }
          else {
            generateData_EMA(data);
            if(yyEMA.length!=0) EMA(xxDate2,yyEMA);
          }
      },
      error: function(jqXHR) {
        $('#highchartcontainerEMA').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get EMA data</div><br><br><br>");
      },
      timeout:10000
  }),
  $.ajax({
      type: "GET",
      url: "http://ec2-52-53-233-237.us-west-1.compute.amazonaws.com?inSymbol="+TargetSymbol+"&idx=STOCH",
      dataType: "json",
      success: function(data) {
          if (data.msg) {
            $('#highchartcontainerSTOCH').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get STOCH data</div><br><br><br>");
          }
          else {
            generateData_STOCH(data);
            if(yySTOCH1.length!=0) STOCH(xxDate3,yySTOCH1,yySTOCH2);
          }
      },
      error: function(jqXHR) {
        $('#highchartcontainerSTOCH').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get STOCH data</div><br><br><br>");
      },
      timeout:10000
  }),
  $.ajax({
      type: "GET",
      url: "http://ec2-52-53-233-237.us-west-1.compute.amazonaws.com?inSymbol="+TargetSymbol+"&idx=RSI",
      dataType: "json",
      success: function(data) {
          if (data.msg) {
            $('#highchartcontainerRSI').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get RSI data</div><br><br><br>");
          }
          else {
            generateData_RSI(data);
            if(yyRSI.length!=0) RSI(xxDate4,yyRSI);
          }
      },
      error: function(jqXHR) {
        $('#highchartcontainerRSI').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get RSI data</div><br><br><br>");
      },
      timeout:10000
  }),
  $.ajax({
      type: "GET",
      url: "http://ec2-52-53-233-237.us-west-1.compute.amazonaws.com?inSymbol="+TargetSymbol+"&idx=ADX",
      dataType: "json",
      success: function(data) {
          if (data.msg) {
            $('#highchartcontainerADX').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get ADX data</div><br><br><br>");
          }
          else {
            generateData_ADX(data);
            if(yyADX.length!=0) ADX(xxDate5,yyADX);
          }
      },
      error: function(jqXHR) {
        $('#highchartcontainerADX').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get ADX data</div><br><br><br>");
      },
      timeout:10000
  }),
  $.ajax({
      type: "GET",
      url: "http://ec2-52-53-233-237.us-west-1.compute.amazonaws.com?inSymbol="+TargetSymbol+"&idx=CCI",
      dataType: "json",
      success: function(data) {
          if (data.msg) {
            $('#highchartcontainerCCI').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get CCI data</div><br><br><br>");
          }
          else {
            generateData_CCI(data);
            if(yyCCI.length!=0) CCI(xxDate6,yyCCI);
          }
      },
      error: function(jqXHR) {
        $('#highchartcontainerCCI').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get CCI data</div><br><br><br>");
      },
      timeout:10000
  }),
  $.ajax({
      type: "GET",
      url: "http://ec2-52-53-233-237.us-west-1.compute.amazonaws.com?inSymbol="+TargetSymbol+"&idx=BBANDS",
      dataType: "json",
      success: function(data) {
          if (data.msg) {
            $('#highchartcontainerBBANDS').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get BBANDS data</div><br><br><br>");
          }
          else {
            generateData_BBANDS(data);
            if(yyBBANDS1.length!=0) BBANDS(xxDate7,yyBBANDS1,yyBBANDS2,yyBBANDS3);
          }
      },
      error: function(jqXHR) {
        $('#highchartcontainerBBANDS').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get BBANDS data</div><br><br><br>");
      },
      timeout:10000
  }),
  $.ajax({
      type: "GET",
      url: "http://ec2-52-53-233-237.us-west-1.compute.amazonaws.com?inSymbol="+TargetSymbol+"&idx=MACD",
      dataType: "json",
      success: function(data) {
          if (data.msg) {
            $('#highchartcontainerMACD').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get MACD data</div><br><br><br>");
          }
          else {
            generateData_MACD(data);
            if(yyMACD1.length!=0) MACD(xxDate8,yyMACD1,yyMACD2,yyMACD3);
          }
      },
      error: function(jqXHR) {
        $('#highchartcontainerMACD').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get MACD data</div><br><br><br>");
      },
      timeout:10000
  }),
  $.ajax({
      type: "GET",
      url: "http://ec2-52-53-233-237.us-west-1.compute.amazonaws.com?inSymbol="+TargetSymbol+"&idx=stocktInfo2",
      dataType: "json",
      success: function(data) {
          if (data.msg) {
            $('#containerHistoricalChart').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get historical charts data</div><br><br><br>");
          }
          else {
            generateData_HistoricalChart(data);
            if(yyHistoricalPrice) fillHistoricalChart();
          }
      },
      error: function(jqXHR) {
          $('#containerHistoricalChart').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get historical charts data</div><br><br><br>");
      },
      timeout:10000
  }),
  $.ajax({
      type: "GET",
      url: "http://ec2-52-53-233-237.us-west-1.compute.amazonaws.com?inSymbol="+TargetSymbol+"&idx=News",
      dataType: "json",
      success: function(data) {
          if (data.msg) {
            $('#News11').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get news feed data</div><br><br><br>");
          }
          else {
            generateData_News(data);
            if(yyTitle) {
              fillNews();
              $("#News0").show();
              $("#News11").hide();
            }
          }
      },
      error: function(jqXHR) {
          $('#News11').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get news feed data</div><br><br><br>");
      },
      timeout:10000
  })
}

function Refresh() {
    for(var i=0; i<FavoriteList.length; i++) {
      var tmpsss=FavoriteList[i][0];
      $.ajax({
          type: "GET",
          url: "http://ec2-52-53-233-237.us-west-1.compute.amazonaws.com/?idx=quickSearch&inSymbol=" + tmpsss,
          dataType: "json",
          success: function(data) {
              if (data.msg) {
              }
              else {
                var xxError =0;
                var tmp_Timestamp;
                if(typeof data["InfoTableIntraday"]!='undefined'
                && typeof data["InfoTableIntraday"]["Meta Data"]!='undefined'
                && typeof data["InfoTableIntraday"]["Meta Data"]["3. Last Refreshed"] !='undefined'
                && typeof data["InfoTable"] !='undefined'
                && typeof data["InfoTable"]["Meta Data"] !='undefined'
                && typeof data["InfoTable"]["Meta Data"]["3. Last Refreshed"] !='undefined') {
                  yTimestamp = data["InfoTableIntraday"]["Meta Data"]["3. Last Refreshed"];
                  tmp_Timestamp = data["InfoTable"]["Meta Data"]["3. Last Refreshed"];
                  title = data["InfoTable"]["Meta Data"]["2. Symbol"];
                }
                else {
                  xxError =1;
                }
                if(xxError ==0
                && typeof data["InfoTableIntraday"] !='undefined'
                && typeof data["InfoTableIntraday"]["Time Series (1min)"] !='undefined'
                && typeof data["InfoTableIntraday"]["Time Series (1min)"][yTimestamp]["4. close"] !='undefined'
                && data["InfoTableIntraday"]
                && data["InfoTableIntraday"]["Time Series (1min)"]
                && data["InfoTableIntraday"]["Time Series (1min)"][yTimestamp]["4. close"]
                && typeof data["InfoTable"] !='undefined'
                && typeof data["InfoTable"]["Time Series (Daily)"] !='undefined'
                && typeof data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp] !='undefined'
                && typeof data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["1. open"] !='undefined'
                && typeof data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["5. volume"] !='undefined'
                && data["InfoTable"]
                && data["InfoTable"]["Time Series (Daily)"]
                && data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]
                && data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["1. open"]
                && data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["5. volume"]) {
                  ylastPrice = Round2D(data["InfoTableIntraday"]["Time Series (1min)"][yTimestamp]["4. close"]);
                  yOpen = Round2D(data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["1. open"]);//unknown
                  yChangetmp = Round2D((ylastPrice-yOpen)/yOpen);
                  yChange1 = Round2D(ylastPrice-yOpen);
                  yChange2 = yChangetmp;
                  yVolume2 = data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["5. volume"];
                  for(var i=0; i<FavoriteList.length;i++) {
                    if(FavoriteList[i][0]==title) {
                      FavoriteList[i][1]=ylastPrice;
                      FavoriteList[i][2]=yChange1;
                      FavoriteList[i][3]=yChange2;
                      FavoriteList[i][4]=parseInt(yVolume2);
                    }
                  }
                }
                console.log(FavoriteList);
                ChangeFavoriteTable();
              }
          },
          error: function(jqXHR) {
              alert("Error: " + jqXHR.status);
          }
      });
    }
}

function clicktoState(i) {
    $("#StockDetailsTable0").hide();
    $("#StockDetailsTable").show();
    //var controllerElement = document.querySelector('checked');
    var appElement = document.querySelector('[ng-app=Allapp]');
    var $scope = angular.element(appElement).scope();
    $scope.$apply(function() {
        $scope.checked = 1;
        $scope.havedata = 1;
    });
    LoadingBar();
    $("#FavoriteDelet").hide();
    $("#FavoriteAdd").show();
    $("#FavoriteDelet").prop('disabled', true);
    $("#FavoriteAdd").prop('disabled', true);
    $("#FavoriteFB").prop('disabled', true);
    Reset();
    GetData(FavoriteList[i][0]);
}

function chartNumSelect(i) {
  chartNum = i;
}

function FBGetHighchartUrl(){
  var exportUrl = 'http://export.highcharts.com/';
  var optionsStr = JSON.stringify({
     "xAxis": {
         "categories": ["Jan", "Feb", "Mar"]
     },
         "series": [{
         "data": [29.9, 71.5, 106.4]
     }]
  });
  optionsStr = chartOpt[chartNum];
  var dataString = encodeURI('async=true&type=jpeg&width=400&options=' + optionsStr);
  $.ajax({
      type: "POST",
      data: dataString,
      url: exportUrl,
      success: function(data) {
        FB.ui({
          app_id: '290445991473512',
          method: 'feed',
          picture: exportUrl + data
          }, (response) => {
          if (response && !response.error_message) {
            //alert("FB work");
            //succeed
          } else {
            //alert("FB doesn't work");
            //fail }
          }
        });

      },
      error: function(jqXHR) {
        alert('Get Highchart Url Fail');
      },
      timeout:10000
  })
}

function OriginalOrder() {
  //sxaas
}
function AscendingSort(sortidx) {
  FavoriteList0.sort();
  if(sortidx==0) {
    FavoriteList.sort(function(a, b){
      var idx = 0;
      while(idx<a[sortidx].length && idx<b[sortidx].length && a[sortidx][idx] == b[sortidx][idx]) idx++;
      return a[sortidx][idx] > b[sortidx][idx];
    });
  }
  else {
    FavoriteList.sort(function(a, b){
      return a[sortidx] > b[sortidx];
    });
  }
}
function DescendingSort(sortidx) {
  FavoriteList0.sort();
  if(sortidx==0) {
    FavoriteList.sort(function(a, b){
      var idx = 0;
      while(idx<a[sortidx].length && idx<b[sortidx].length && a[sortidx][idx] == b[sortidx][idx]) idx++;
      return a[sortidx][idx] > b[sortidx][idx];
    });
  }
  else {
    FavoriteList.sort(function(a, b){
      return a[sortidx] > b[sortidx];
    });
  }
  FavoriteList0.reverse();
  FavoriteList.reverse();
}
function removeFavoriteItem(idx) {
  for(var i=0; i<FavoriteList0.length;i++) {
    if(FavoriteList0[i]==FavoriteList[idx][0]) {
      FavoriteList0.splice(i, 1);
      break;
    }
  }
  FavoriteList.splice(idx, 1);
}
function trashCan(idx) {
  removeFavoriteItem(idx);
  ChangeFavoriteTable();
}
function ChangeFavoriteTable(){

  var html = "<tr><td><b>Symbol </b></td><td><b>Stock Price</b></td><td><b>Change(Change Percent)</b></td><td><b>Volume</b></td><td></td></tr>";
  for(var i=0; i<FavoriteList.length; i++) {
    if(typeof FavoriteList[i][1]!='undefined' && typeof FavoriteList[i][2]!='undefined' && typeof FavoriteList[i][3]!='undefined' && typeof FavoriteList[i][4]!='undefined') {
      var tmpChangeStr;
      if(FavoriteList[i][2]>=0) tmpChangeStr = FavoriteList[i][2]+"("+FavoriteList[i][3]+"%) <img width=14 src='images/Up.png'></img>";
      else tmpChangeStr = FavoriteList[i][2]+"("+FavoriteList[i][3]+"%) <img width=14 src='images/Down.png'></img>";
      if(FavoriteList[i][2]>=0) tmpChangeStr = "<span style='color:green'>" + tmpChangeStr + "</span>";
      else tmpChangeStr = "<span style='color:red'>" + tmpChangeStr + "</span>";
      html += "<tr><td><span style='cursor: pointer; color:blue;' onclick='clicktoState("+i+")'><b>"+FavoriteList[i][0]+"</b></span></td><td><b>"+FavoriteList[i][1]+"</b></td><td><b>"+tmpChangeStr+"</b></td><td>"+FavoriteList[i][4].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"</td><td>";
      html += "<button type='button' class='btn btn-secondary btn-sm' onclick ='trashCan("+i+")'><i class='fa fa-trash' asria-hidden='true'></i></button></td></tr>";
    }
    else {
      html += "<tr><td><span style='cursor: pointer; color:blue;' onclick='clicktoState("+i+")'><b>"+FavoriteList[i][0]+"</b></span></td><td><b>"+"Cannot get data"+"</b></td><td><b>"+"Cannot get data"+"</b></td><td>"+"Cannot get data"+"</td><td>";
      html += "Cannot get data</td></tr>";
    }
  }

  $("#FavoriteTable").html(html);
  if (screen.width >= 600) {
    localStorage.setItem('LS_FavoriteList',JSON.stringify(FavoriteList));
    localStorage.setItem('LS_FavoriteList0',JSON.stringify(FavoriteList0));
  }
}

var date0 ="";
var title ="";
var ylastPrice;
var yChange;
var yChange1;//number
var yChange2;//percent
var yTimestamp;
var yOpen;
var yClose;
var yRange;
var yVolume;//string form
var yVolume2;//number form
var xxDate = [];
var xxDate0 = [];
var xxDate1 = [];
var xxDate2 = [];
var xxDate3 = [];
var xxDate4 = [];
var xxDate5 = [];
var xxDate6 = [];
var xxDate7 = [];
var xxDate8 = [];
var yySMA = [];
var yyEMA = [];
var yySTOCH1 = [];
var yySTOCH2 = [];
var yyRSI = [];
var yyADX = [];
var yyCCI = [];
var yyBBANDS1 = [];
var yyBBANDS2 = [];
var yyBBANDS3 = [];
var yyMACD1 = [];
var yyMACD2 = [];
var yyMACD3 = [];
var yyPrice = [];
var yyVolume = [];
var yyHistoricalPrice = [];
var yyAuthor = [];
var yyDate = [];
var yyLink = [];
var yyTitle = [];

var sortidx=0;// 0:symbol; 1:Price; 2:Change; 3:ChangePercent; 4:Volume; 5:Default
var asdes =0;//0 Ascending; 1:Descending

function Reset() {
  date0 ="";
  title ="";
  ylastPrice =null;
  yChange =null;
  yChange1 =null;//number
  yChange2 =null;//percent
  yTimestamp =null;
  yOpen =null;
  yClose =null;
  yRange =null;
  yVolume =null;//string form
  yVolume2 =null;//number form
  xxDate = [];
  xxDate0 = [];
  xxDate1 = [];
  xxDate2 = [];
  xxDate3 = [];
  xxDate4 = [];
  xxDate5 = [];
  xxDate6 = [];
  xxDate7 = [];
  xxDate8 = [];
  yySMA = [];
  yyEMA = [];
  yySTOCH1 = [];
  yySTOCH2 = [];
  yyRSI = [];
  yyADX = [];
  yyCCI = [];
  yyBBANDS1 = [];
  yyBBANDS2 = [];
  yyBBANDS3 = [];
  yyMACD1 = [];
  yyMACD2 = [];
  yyMACD3 = [];
  yyPrice = [];
  yyVolume = [];
  yyHistoricalPrice = [];
  yyAuthor = [];
  yyDate = [];
  yyLink = [];
  yyTitle = [];
}

function LoadingBar() {
  $('#StockDetailsTable').html("<br><br><br><br><br><br><div class='progress' align='center'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100' style='width: 50%'></div></div><br><br><br><br><br>");
  $('#highchartcontainerPrice').html("<br><br><br><div class='progress' align='center'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100' style='width: 50%'></div></div><br><br><br><br><br>");
  $('#highchartcontainerSMA').html("<br><br><br><div class='progress' align='center'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100' style='width: 50%'></div></div><br><br><br><br><br>");
  $('#highchartcontainerEMA').html("<br><br><br><div class='progress' align='center'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100' style='width: 50%'></div></div><br><br><br><br><br>");
  $('#highchartcontainerSTOCH').html("<br><br><br><div class='progress' align='center'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100' style='width: 50%'></div></div><br><br><br><br><br>");
  $('#highchartcontainerRSI').html("<br><br><br><div class='progress' align='center'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100' style='width: 50%'></div></div><br><br><br><br><br>");
  $('#highchartcontainerADX').html("<br><br><br><div class='progress' align='center'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100' style='width: 50%'></div></div><br><br><br><br><br>");
  $('#highchartcontainerCCI').html("<br><br><br><div class='progress' align='center'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100' style='width: 50%'></div></div><br><br><br><br><br>");
  $('#highchartcontainerBBANDS').html("<br><br><br><div class='progress' align='center'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100' style='width: 50%'></div></div><br><br><br><br><br>");
  $('#highchartcontainerMACD').html("<br><br><br><div class='progress' align='center'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100' style='width: 50%'></div></div><br><br><br><br><br>");
  $('#News11').html("<br><br><br><div class='progress' align='center'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100' style='width: 50%'></div></div><br><br><br><br><br>");
  $('#containerHistoricalChart').html("<br><br><br><div class='progress' align='center'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100' style='width: 50%'></div></div><br><br><br><br><br>");
}

function fillTable() {
  $("#T_symbol").html(title);
  $("#T_lastPrice").html(ylastPrice);
  $("#T_Change").html(yChange);
  $("#T_Timestamp").html(yTimestamp);
  $("#T_Open").html(yOpen);
  $("#T_Close").html(yClose);
  $("#T_Range").html(yRange);
  $("#T_Volume").html(yVolume);
}

function fillHistoricalChart() {
      // Create the chart
      Highcharts.stockChart('containerHistoricalChart', {
            rangeSelector: {
              buttons: [{
                  type: 'week',
                  count: 1,
                  text: '1w'
              }, {
                  type: 'month',
                  count: 1,
                  text: '1m'
              }, {
                  type: 'month',
                  count: 3,
                  text: '3m'
              }, {
                  type: 'month',
                  count: 6,
                  text: '6m'
              }, {
                  type: 'ytd',
                  count: 1,
                  text: 'ytd'
              }, {
                  type: 'year',
                  count: 1,
                  text: '1y'
              }, {
                  type: 'all',
                  text: 'All'
              }],
              selected: 0
          },
          title: {
              text: title+' Stock Value'
          },
          subtitle: {
              text: 'Source: <a href="http://www.alphavantage.co/"> Alpha Vantage</a>',
              style: {
                color: '#0000FF'
              }
          },
          yAxis: [{
              title: {
                  text: 'Stock Value'
              },
              min: 0,
          }],
          series: [{
              type: 'area',
              name: title,
              data: yyHistoricalPrice,
              tooltip: {
                  valueDecimals: 2
              }
          }]
      });
}

function fillNews() {
  var tmpContent;
  for(var ii=0; ii<5; ii++) {
    if(yyTitle[ii]=='undefined') {
      break;
    }
    var tmpAuthor = yyAuthor[ii];
    var tmpDate = yyDate[ii];
    var tmpLink = yyLink[ii];
    var tmpTitle = yyTitle[ii];
    tmpContent = "<br><a href='" + tmpLink + "'  style='' target='_blank' ><b>" + tmpTitle + "</b></a>" + "<br><br>";
    tmpContent = tmpContent + "<b>Author: " + tmpAuthor + "</b>" + "<br>";
    tmpContent = tmpContent + "<b>Date: " + tmpDate + " EDT</b>" + "<br><br>";
    var idxtmp = ii + 1;
    var targettmp = "#News" + idxtmp;
    $(targettmp).html(tmpContent);
  }
}

function fillChart() {
  if(yyPrice.length!=0) StockPrice(xxDate0,yyPrice,yyVolume);
  if(yySMA.length!=0) SMA(xxDate1,yySMA);
  if(yyEMA.length!=0) EMA(xxDate2,yyEMA);
  if(yySTOCH1.length!=0) STOCH(xxDate3,yySTOCH1,yySTOCH2);
  if(yyRSI.length!=0) RSI(xxDate4,yyRSI);
  if(yyADX.length!=0) ADX(xxDate5,yyADX);
  if(yyCCI.length!=0) CCI(xxDate6,yyCCI);
  if(yyBBANDS1.length!=0) BBANDS(xxDate7,yyBBANDS1,yyBBANDS2,yyBBANDS3);
  if(yyMACD1.length!=0) MACD(xxDate8,yyMACD1,yyMACD2,yyMACD3);
}

function Round2D(num) {
  return Math.round(num * 100) / 100;
}

function generateData_News(data){
  if(1) {
    for(var ii=0;ii<5;ii++) {
      if(typeof data["News"] != 'undefined'
      && typeof data["News"][ii] != 'undefined'
      && typeof data["News"][ii]["Author"] != 'undefined'
      && typeof data["News"][ii]["Date"] != 'undefined'
      && typeof data["News"][ii]["Link"] != 'undefined'
      && typeof data["News"][ii]["Title"] != 'undefined') {
        if(data["News"][ii]["Title"][0]=='undefined') break;
        yyAuthor.push(data["News"][ii]["Author"][0]);
        yyDate.push(data["News"][ii]["Date"]);
        yyLink.push(data["News"][ii]["Link"][0]);
        yyTitle.push(data["News"][ii]["Title"][0]);
      }
      else {
        $('#News11').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get news feed data</div><br><br><br>");
        break;
      }
    }
  }
  else {
    $('#News11').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get news feed data</div><br><br><br>");
  }
}

function generateData_HistoricalChart(data){
  var ii = 0;
  if(typeof data["InfoTableHistorical"] !='undefined'
  && typeof data["InfoTableHistorical"]["Time Series (Daily)"] !='undefined') {
    for(var Target in data["InfoTableHistorical"]["Time Series (Daily)"]) {
      if(ii<1000) {
        var date = new Date(Target);
        var timestamp0 = date.getTime();
        if(typeof data["InfoTableHistorical"]["Time Series (Daily)"][Target] !='undefined'
        && typeof data["InfoTableHistorical"]["Time Series (Daily)"][Target]["4. close"] !='undefined')
          yyHistoricalPrice.push([timestamp0, parseFloat(data["InfoTableHistorical"]["Time Series (Daily)"][Target]["4. close"])]);
        else {
          $('#containerHistoricalChart').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get historical charts data</div><br><br><br>");
          break;
        }
      }
      ii++;
      if(ii>1000) break;
    }
  }
  else {
    $('#containerHistoricalChart').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get historical charts data</div><br><br><br>");
  }
  yyHistoricalPrice.reverse();
}

function generateData_Price(data) {
  if(typeof data["InfoTable"] !='undefined'
  && typeof data["InfoTable"]["Meta Data"] !='undefined'
  && typeof data["InfoTable"]["Meta Data"]["2. Symbol"] !='undefined'
  && typeof data["InfoTable"]["Time Series (Daily)"] !='undefined') {
    var ii = 0;
    date0 = data["InfoTable"]["Meta Data"]["2. Symbol"];
    for(var Target in data["InfoTable"]["Time Series (Daily)"]) {
      tmp = Target;
      if(ii<130) {
        xxDate0.push(String(tmp).substr(5,2)+'/'+String(tmp).substr(8,2));
        if(typeof data["InfoTable"]["Time Series (Daily)"][Target] !='undefined'
        && typeof data["InfoTable"]["Time Series (Daily)"][Target]["4. close"] !='undefined'
        && typeof data["InfoTable"]["Time Series (Daily)"][Target]["5. volume"] !='undefined') {
          yyPrice.push(parseFloat(data["InfoTable"]["Time Series (Daily)"][Target]["4. close"]));
          yyVolume.push(parseFloat(data["InfoTable"]["Time Series (Daily)"][Target]["5. volume"]));
        }
        else {
          $('#highchartcontainerPrice').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get Price data</div><br><br><br>");
          break;
        }
      }
      ii++;
      if(ii>130) break;
    }
    xxDate0.reverse();
    yyPrice.reverse();
    yyVolume.reverse();
  }
  else {
    $('#highchartcontainerPrice').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get Price data</div><br><br><br>");
  }
}

function generateData_SMA(data) {
  if(typeof data["SMA"] !='undefined'
  && typeof data["SMA"]["Technical Analysis: SMA"] !='undefined') {
    var ii = 0;
    for(var Target in data["SMA"]["Technical Analysis: SMA"]) {
      tmp = Target;
      if(ii<130) {
        xxDate1.push(String(tmp).substr(5,2)+'/'+String(tmp).substr(8,2));
        if(typeof data["SMA"]["Technical Analysis: SMA"][Target] !='undefined'
        && typeof data["SMA"]["Technical Analysis: SMA"][Target]["SMA"] !='undefined') {
          yySMA.push(parseFloat(data["SMA"]["Technical Analysis: SMA"][Target]["SMA"]));
        }
        else {
          $('#highchartcontainerSMA').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get SMA data</div><br><br><br>");
          break;
        }
      }
      ii++;
      if(ii>130) break;
    }
    xxDate1.reverse();
    yySMA.reverse();
  }
  else {
    $('#highchartcontainerSMA').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get SMA data</div><br><br><br>");
  }
}

function generateData_EMA(data) {
  if(typeof data["EMA"] !='undefined'
  && typeof data["EMA"]["Technical Analysis: EMA"] !='undefined') {
    var ii = 0;
    for(var Target in data["EMA"]["Technical Analysis: EMA"]) {
      tmp = Target;
      if(ii<130) {
        if(typeof data["EMA"]["Technical Analysis: EMA"][Target] !='undefined'
        && typeof data["EMA"]["Technical Analysis: EMA"][Target]["EMA"] !='undefined') {
          xxDate2.push(String(tmp).substr(5,2)+'/'+String(tmp).substr(8,2));
          yyEMA.push(parseFloat(data["EMA"]["Technical Analysis: EMA"][Target]["EMA"]));
        }
        else {
          $('#highchartcontainerEMA').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get EMA data</div><br><br><br>");
          break;
        }
      }
      ii++;
      if(ii>130) break;
    }
    xxDate2.reverse();
    yyEMA.reverse();
  }
  else {
    $('#highchartcontainerEMA').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get EMA data</div><br><br><br>");
  }
}

function generateData_STOCH(data) {
  if(typeof data["STOCH"] !='undefined'
  && typeof data["STOCH"]["Technical Analysis: STOCH"] !='undefined') {
    var ii = 0;
    for(var Target in data["STOCH"]["Technical Analysis: STOCH"]) {
      tmp = Target;
      if(ii<130) {
        xxDate3.push(String(tmp).substr(5,2)+'/'+String(tmp).substr(8,2));
        if(typeof data["STOCH"]["Technical Analysis: STOCH"][Target] !='undefined'
        && typeof data["STOCH"]["Technical Analysis: STOCH"][Target]["SlowK"] !='undefined'
        && typeof data["STOCH"]["Technical Analysis: STOCH"][Target]["SlowD"] !='undefined') {
          yySTOCH1.push(parseFloat(data["STOCH"]["Technical Analysis: STOCH"][Target]["SlowK"]));
          yySTOCH2.push(parseFloat(data["STOCH"]["Technical Analysis: STOCH"][Target]["SlowD"]));
        }
        else {
          $('#highchartcontainerSTOCH').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get STOCH data</div><br><br><br>");
          break;
        }
      }
      ii++;
      if(ii>130) break;
    }
    xxDate3.reverse();
    yySTOCH1.reverse();
    yySTOCH2.reverse();
  }
  else {
    $('#highchartcontainerSTOCH').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get STOCH data</div><br><br><br>");
  }
}

function generateData_RSI(data) {
  if(typeof data["RSI"] !='undefined'
  && typeof data["RSI"]["Technical Analysis: RSI"] !='undefined') {
    var ii = 0;
    for(var Target in data["RSI"]["Technical Analysis: RSI"]) {
      tmp = Target;
      if(ii<130) {
        xxDate4.push(String(tmp).substr(5,2)+'/'+String(tmp).substr(8,2));
        if(typeof data["RSI"]["Technical Analysis: RSI"][Target] !='undefined'
        && typeof data["RSI"]["Technical Analysis: RSI"][Target]["RSI"] !='undefined') {
          yyRSI.push(parseFloat(data["RSI"]["Technical Analysis: RSI"][Target]["RSI"]));
        }
        else {
          $('#highchartcontainerRSI').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get RSI data</div><br><br><br>");
          break;
        }
      }
      ii++;
      if(ii>130) break;
    }
    xxDate4.reverse();
    yyRSI.reverse();
  }
  else {
    $('#highchartcontainerRSI').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get RSI data</div><br><br><br>");
  }
}

function generateData_ADX(data) {
  if(typeof data["ADX"] !='undefined'
  && typeof data["ADX"]["Technical Analysis: ADX"] !='undefined') {
    var ii = 0;
    for(var Target in data["ADX"]["Technical Analysis: ADX"]) {
      tmp = Target;
      if(ii<130) {
        xxDate5.push(String(tmp).substr(5,2)+'/'+String(tmp).substr(8,2));
        if(typeof data["ADX"]["Technical Analysis: ADX"][Target] !='undefined'
        && typeof data["ADX"]["Technical Analysis: ADX"][Target]["ADX"] !='undefined') {
          yyADX.push(parseFloat(data["ADX"]["Technical Analysis: ADX"][Target]["ADX"]));
        }
        else {
          $('#highchartcontainerADX').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get ADX data</div><br><br><br>");
          break;
        }
      }
      ii++;
      if(ii>130) break;
    }
    xxDate5.reverse();
    yyADX.reverse();
  }
  else {
    $('#highchartcontainerADX').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get ADX data</div><br><br><br>");
  }
}

function generateData_CCI(data) {
  if(typeof data["CCI"] !='undefined'
  && typeof data["CCI"]["Technical Analysis: CCI"] !='undefined') {
    var ii = 0;
    for(var Target in data["CCI"]["Technical Analysis: CCI"]) {
      tmp = Target;
      if(ii<130) {
        xxDate6.push(String(tmp).substr(5,2)+'/'+String(tmp).substr(8,2));
        if(typeof data["CCI"]["Technical Analysis: CCI"][Target] !='undefined'
        && typeof data["CCI"]["Technical Analysis: CCI"][Target]["CCI"] !='undefined') {
          yyCCI.push(parseFloat(data["CCI"]["Technical Analysis: CCI"][Target]["CCI"]));
        }
        else {
          $('#highchartcontainerCCI').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get CCI data</div><br><br><br>");
          break;
        }
      }
      ii++;
      if(ii>130) break;
    }
    xxDate6.reverse();
    yyCCI.reverse();
  }
  else {
    $('#highchartcontainerCCI').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get CCI data</div><br><br><br>");
  }
}

function generateData_BBANDS(data) {
  if(typeof data["BBANDS"] !='undefined'
  && typeof data["BBANDS"]["Technical Analysis: BBANDS"] !='undefined') {
    var ii = 0;
    for(var Target in data["BBANDS"]["Technical Analysis: BBANDS"]) {
      tmp = Target;
      if(ii<130) {
        xxDate7.push(String(tmp).substr(5,2)+'/'+String(tmp).substr(8,2));
        if(typeof data["BBANDS"]["Technical Analysis: BBANDS"][Target] !='undefined'
        && typeof data["BBANDS"]["Technical Analysis: BBANDS"][Target]["Real Upper Band"] !='undefined'
        && typeof data["BBANDS"]["Technical Analysis: BBANDS"][Target]["Real Middle Band"] !='undefined'
        && typeof data["BBANDS"]["Technical Analysis: BBANDS"][Target]["Real Lower Band"] !='undefined') {
          yyBBANDS1.push(parseFloat(data["BBANDS"]["Technical Analysis: BBANDS"][Target]["Real Upper Band"]));
          yyBBANDS2.push(parseFloat(data["BBANDS"]["Technical Analysis: BBANDS"][Target]["Real Middle Band"]));
          yyBBANDS3.push(parseFloat(data["BBANDS"]["Technical Analysis: BBANDS"][Target]["Real Lower Band"]));
        }
        else {
          $('#highchartcontainerBBANDS').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get BBANDS data</div><br><br><br>");
          break;
        }
      }
      ii++;
      if(ii>130) break;
    }
    xxDate7.reverse();
    yyBBANDS1.reverse();
    yyBBANDS2.reverse();
    yyBBANDS3.reverse();
  }
  else {
    $('#highchartcontainerBBANDS').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get BBANDS data</div><br><br><br>");
  }
}

function generateData_MACD(data) {
  if(typeof data["MACD"] !='undefined'
  && typeof data["MACD"]["Technical Analysis: MACD"] !='undefined') {
    var ii = 0;
    for(var Target in data["MACD"]["Technical Analysis: MACD"]) {
      tmp = Target;
      if(ii<130) {
        xxDate8.push(String(tmp).substr(5,2)+'/'+String(tmp).substr(8,2));
        if(typeof data["MACD"]["Technical Analysis: MACD"][Target] !='undefined'
        && typeof data["MACD"]["Technical Analysis: MACD"][Target]["MACD"] !='undefined'
        && typeof data["MACD"]["Technical Analysis: MACD"][Target]["MACD_Hist"] !='undefined'
        && typeof data["MACD"]["Technical Analysis: MACD"][Target]["MACD_Signal"] !='undefined') {
          yyMACD1.push(parseFloat(data["MACD"]["Technical Analysis: MACD"][Target]["MACD"]));
          yyMACD2.push(parseFloat(data["MACD"]["Technical Analysis: MACD"][Target]["MACD_Hist"]));
          yyMACD3.push(parseFloat(data["MACD"]["Technical Analysis: MACD"][Target]["MACD_Signal"]));
        }
        else {
          $('#highchartcontainerMACD').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get MACD data</div><br><br><br>");
          break;
        }
      }
      ii++;
      if(ii>130) break;
    }
    xxDate8.reverse();
    yyMACD1.reverse();
    yyMACD2.reverse();
    yyMACD3.reverse();
  }
  else {
    $('#highchartcontainerMACD').html("<br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get MACD data</div><br><br><br>");
  }
}

function generateData_Table(data){
  if(typeof data["InfoTable"] !='undefined'
  && typeof data["InfoTable"]["Meta Data"] !='undefined'
  && typeof data["InfoTable"]["Meta Data"]["3. Last Refreshed"] !='undefined'
  && typeof data["InfoTable"]["Meta Data"]["2. Symbol"] !='undefined'
  && typeof data["InfoTableIntraday"] !='undefined'
  && typeof data["InfoTableIntraday"]["Meta Data"] !='undefined'
  && typeof data["InfoTableIntraday"]["Meta Data"]["3. Last Refreshed"] !='undefined'
  && typeof data["InfoTableIntraday"]["Time Series (1min)"] !='undefined'
  && typeof data["InfoTable"]["Time Series (Daily)"] !='undefined') {
    date0 = "("+data["InfoTable"]["Meta Data"]["3. Last Refreshed"]+")";
    var tmp_Timestamp = data["InfoTable"]["Meta Data"]["3. Last Refreshed"];
    title = data["InfoTable"]["Meta Data"]["2. Symbol"];
    yTimestamp = data["InfoTableIntraday"]["Meta Data"]["3. Last Refreshed"];
    if(typeof data["InfoTableIntraday"]["Time Series (1min)"][yTimestamp] !='undefined'
    && typeof data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp] !='undefined'
    && typeof data["InfoTableIntraday"]["Time Series (1min)"][yTimestamp]["4. close"] !='undefined'
    && typeof data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["1. open"] !='undefined'
    && typeof data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["4. close"] !='undefined'
    && typeof data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["3. low"] !='undefined'
    && typeof data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["2. high"] !='undefined'
    && typeof data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["5. volume"] !='undefined'
    && data["InfoTableIntraday"]["Time Series (1min)"][yTimestamp]["4. close"] !=''
    && data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["1. open"] !=''
    && data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["4. close"] !=''
    && data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["3. low"] !=''
    && data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["2. high"] !=''
    && data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["5. volume"] !='') {
      ylastPrice = Round2D(data["InfoTableIntraday"]["Time Series (1min)"][yTimestamp]["4. close"]);
      yTimestamp = yTimestamp + " EDT";
      yOpen = Round2D(data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["1. open"]);//unknown
      yChangetmp = Round2D((ylastPrice-yOpen)/yOpen);
      yChange1 = Round2D(ylastPrice-yOpen);
      yChange2 = yChangetmp;
      yChange = yChange1 + " (" + yChangetmp + "%)";
      if(yChange1>=0) yChange = yChange + " <img width=14 src='images/Up.png'></img>";
      else yChange = yChange + " <img width=14 src='images/Down.png'></img>";
      if(yChange1>=0) yChange = "<span style='color:green'>" + yChange + "</span>";
      else yChange = "<span style='color:red'>" + yChange + "</span>";
      yClose = Round2D(data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["4. close"]);//unknown
      yRange = String(Round2D(data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["3. low"])) + " - " + String(Round2D(data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["2. high"]));
      yVolume = data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["5. volume"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      yVolume2 = data["InfoTable"]["Time Series (Daily)"][tmp_Timestamp]["5. volume"];
    }
    else {
      $('#StockDetailsTable').html("<br><br><br><br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get current stock data</div><br><br><br>");
    }
  }
  else {
    $('#StockDetailsTable').html("<br><br><br><br><br><br><div class='alert alert-danger' role='alert'>Error! Failed to get current stock data</div><br><br><br>");
  }
}

function SMA(xx,yy){
  Highcharts.chart('highchartcontainerSMA', {
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Simple Moving Average (SMA)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'SMA'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title,
      data: yy,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
  chartOpt[1] = JSON.stringify({
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Simple Moving Average (SMA)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'SMA'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title,
      data: yy,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
}
function EMA(xx,yy){
  Highcharts.chart('highchartcontainerEMA', {
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Exponential Moving Average (EMA)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'EMA'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title,
      data: yy,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
  chartOpt[2] = JSON.stringify({
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Exponential Moving Average (EMA)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'EMA'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title,
      data: yy,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
}
function STOCH(xx,yy,yy2){
  Highcharts.chart('highchartcontainerSTOCH', {
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Stochastic Oscillator (STOCH)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'STOCH'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title+' SlowK',
      data: yy,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    },
    {
      name: title+' SlowD',
      data: yy2,
      color: '#00FF00',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
  chartOpt[3] = JSON.stringify({
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Stochastic Oscillator (STOCH)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'STOCH'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title+' SlowK',
      data: yy,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    },
    {
      name: title+' SlowD',
      data: yy2,
      color: '#00FF00',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
}
function RSI(xx,yy){
  Highcharts.chart('highchartcontainerRSI', {
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Relative Strength Indicator (RSI)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'RSI'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title,
      data: yy,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
  chartOpt[4] = JSON.stringify({
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Relative Strength Indicator (RSI)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'RSI'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title,
      data: yy,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
}
function ADX(xx,yy){
  Highcharts.chart('highchartcontainerADX', {
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Average Directional Index (ADX)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'ADX'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title,
      data: yy,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
  chartOpt[5] = JSON.stringify({
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Average Directional Index (ADX)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'ADX'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title,
      data: yy,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
}
function CCI(xx,yy){
  Highcharts.chart('highchartcontainerCCI', {
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Commodity Channel Index (CCI)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'CCI'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title,
      data: yy,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
  chartOpt[6] = JSON.stringify({
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Commodity Channel Index (CCI)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'CCI'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title,
      data: yy,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
}
function BBANDS(xx,yy,yy2,yy3){
  Highcharts.chart('highchartcontainerBBANDS', {
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Bollinger Band (BBANDS)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'BBANDS'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title+' Real Upper Band',
      data: yy,
      color: '#000000',
      marker:{symbol : 'square',radius : 3 }
    },
    {
      name: title+' Real Lower Band',
      data: yy3,
      color: '#00FF00',
      marker:{symbol : 'square',radius : 3 }
    },
    {
      name: title+' Real Middle Band',
      data: yy2,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
  chartOpt[7] = JSON.stringify({
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Bollinger Band (BBANDS)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'BBANDS'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title+' Real Upper Band',
      data: yy,
      color: '#000000',
      marker:{symbol : 'square',radius : 3 }
    },
    {
      name: title+' Real Lower Band',
      data: yy3,
      color: '#00FF00',
      marker:{symbol : 'square',radius : 3 }
    },
    {
      name: title+' Real Middle Band',
      data: yy2,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
}
function MACD(xx,yy,yy2,yy3){
  Highcharts.chart('highchartcontainerMACD', {
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Moving Average Convergence/Divergence (MACD)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'MACD'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title+' MACD',
      data: yy,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    },
    {
      name: title+' MACD_Hist',
      data: yy2,
      color: '#CFAC80',
      marker:{symbol : 'square',radius : 3 }
    },
    {
      name: title+' MACD_Signal',
      data: yy3,
      color: '#000000',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
  chartOpt[8] = JSON.stringify({
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'Moving Average Convergence/Divergence (MACD)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: {
        title: {
            text: 'MACD'
        },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
      name: title+' MACD',
      data: yy,
      color: '#FF0000',
      marker:{symbol : 'square',radius : 3 }
    },
    {
      name: title+' MACD_Hist',
      data: yy2,
      color: '#CFAC80',
      marker:{symbol : 'square',radius : 3 }
    },
    {
      name: title+' MACD_Signal',
      data: yy3,
      color: '#000000',
      marker:{symbol : 'square',radius : 3 }
    }]
  });
}
function StockPrice(xx,yy,yy2){
  Highcharts.chart('highchartcontainerPrice', {
    chart: {
        type: 'column',
        zoomType: 'x'
    },
    title: {
        text: date0 +' Stock Price and Volume'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: [{
        title: {
            text: 'Stock Price'
        },
        min: 0,
    },
    {
        floor: 0,
        title: {
            text: 'Volume'
        },
        labels: {
            format: '{value} M',
            formatter: function() {
              return this.value/1000000 + 'M';
            }
        },
        opposite: true
    }
    ],
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        area: {
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.Color('#0000ff').setOpacity(0.3).get('rgba')],
                    [1, Highcharts.Color('#0000ff').setOpacity(0.3).get('rgba')]
                ]
            },
            marker: {
                radius: 0
            },
            lineWidth: 2,
            states: {
                hover: {
                    lineWidth: 1
                }
            },
            threshold: null
        }
    },
    series: [{
      type: 'area',
      name: 'Price',
      data: yy,
      color: '#0000ff'
    },
    {
      type: 'column',
      name: 'Volume',
      yAxis: 1,
      data: yy2,
      color: '#ff0000'
    }]
  });
  chartOpt[0] = JSON.stringify({
    chart: {
        type: 'column',
        zoomType: 'x'
    },
    title: {
        text: date0 +' Stock Price and Volume'
    },
    subtitle: {
        text: 'Source: <a href="http://www.alphavantage.co/" target="_blank"> Alpha Vantage</a>',
        style: {
          color: '#0000FF'
        }
    },
    xAxis: {
          categories: xx,
          tickInterval: 5
    },
    yAxis: [{
        title: {
            text: 'Stock Price'
        },
        min: 0,
    },
    {
        floor: 0,
        title: {
            text: 'Volume'
        },
        labels: {
            format: '{value}'
        },
        opposite: true
    }
    ],
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
        area: {
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.Color('#0000ff').setOpacity(0.3).get('rgba')],
                    [1, Highcharts.Color('#0000ff').setOpacity(0.3).get('rgba')]
                ]
            },
            marker: {
                radius: 0
            },
            lineWidth: 2,
            states: {
                hover: {
                    lineWidth: 1
                }
            },
            threshold: null
        }
    },
    series: [{
      type: 'area',
      name: 'Price',
      data: yy,
      color: '#0000ff'
    },
    {
      type: 'column',
      name: 'Volume',
      yAxis: 1,
      data: yy2,
      color: '#ff0000'
    }]
  });
}

/**
 * You must include the dependency on 'ngMaterial'
 */
var app = angular.module('Allapp', ['ngMaterial','ngAnimate']);
  app.controller("autocompleteController", function($http){
    this.querySearch = function(query){
      return $http
        .get("http://ec2-52-53-233-237.us-west-1.compute.amazonaws.com?idx=autocompleteInfo&inSymbol=" + query)
        .then(function(response){
          //console.log(response.data);
          var res = [];
          for (var i = 0; i < response.data.length; i++) {
              var ss = response.data[i].Symbol;
              var ll = (" - " + response.data[i].Name + " (" + response.data[i].Exchange + ")");
              var tmp = {shortexp: ss, longexp: ll};
              res.push(tmp);
          }
          return res;
        });
    };
  });
  app.controller('SelectAsyncController', function($timeout, $scope) {
    $scope.user0 = null;
    $scope.users0 = [
      { id: 1, name: 'Default' },
      { id: 2, name: 'Symbol' },
      { id: 3, name: 'Price' },
      { id: 4, name: 'Change' },
      { id: 5, name: 'Change Percent' },
      { id: 6, name: 'Volume' }
    ];
    $scope.ShowRRR0 = function() {
      // 0:symbol; 1:Price; 2:Change; 3:ChangePercent; 4:Volume; 5:Default
      return $timeout(function() {
         if($scope.user0.name=='Default') {
           sortidx=5;
           if(asdes == 0) AscendingSort(sortidx);
           else DescendingSort(sortidx);
           ChangeFavoriteTable();
         }
         if($scope.user0.name=='Symbol') {
           sortidx=0;
           if(asdes == 0) AscendingSort(sortidx);
           else DescendingSort(sortidx);
           ChangeFavoriteTable();
         }
         if($scope.user0.name=='Price') {
           sortidx=1;
           if(asdes == 0) AscendingSort(sortidx);
           else DescendingSort(sortidx);
           ChangeFavoriteTable();
         }
         if($scope.user0.name=='Change') {
           sortidx=2;
           if(asdes == 0) AscendingSort(sortidx);
           else DescendingSort(sortidx);
           ChangeFavoriteTable();
         }
         if($scope.user0.name=='Change Percent') {
           sortidx=3;
           if(asdes == 0) AscendingSort(sortidx);
           else DescendingSort(sortidx);
           ChangeFavoriteTable();
         }
         if($scope.user0.name=='Volume') {
           sortidx=4;
           if(asdes == 0) AscendingSort(sortidx);
           else DescendingSort(sortidx);
           ChangeFavoriteTable();
         }
      }, 10);
    };
  });
  app.controller('SelectAsyncController2', function($timeout, $scope) {
    $scope.user = null;
    $scope.users = [
      { id: 1, name: 'Ascending' },
      { id: 2, name: 'Descending' }
    ];
    $scope.ShowRRR = function() {
      return $timeout(function() {
         if($scope.user.name=='Ascending') {
           if(sortidx>=0) AscendingSort(sortidx);
           else OriginalOrder();
           asdes = 0;
           ChangeFavoriteTable();
         }
         if($scope.user.name=='Descending') {
           if(sortidx>=0) DescendingSort(sortidx);
           else OriginalOrder();
           asdes = 1;
           ChangeFavoriteTable();
         }
      }, 10);
    };
  });
