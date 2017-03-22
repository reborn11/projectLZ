(function() {
	var myChart = echarts.init(document.getElementById("main"));
	var option = {
		title: {
			text: '今日客流数据统计',
			textStyle: {
				color: '#00FFF9',
				fontSize: 22
			},
			top: '0',
		},
		tooltip: {
			trigger: 'axis',
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: ['8:00', '9:30', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
			axisLine: {
				show: false,
				lineStyle: {
					color: '#3A3C3D'
				},
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				textStyle: {
					color: '#00FFF9'
				}
			}
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value} '
			},
			axisLine: {
				show: false,
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				textStyle: {
					color: '#00FFF9'
				}
			}
		},
		series: [{
			name: '客流量',
			type: 'line',
			smooth: true,
			data: [300, 280, 260, 270, 300, 550, 500, 390, 380, 400, 500, 600, 750, 800, 700, 600, 400],
			//			data: [0, 7, 10, 11, 13, 17, 19, 15, 9, 7, 8, 15, 27, 26, 18, 8, 0],
			
		}],
		color: '#00FFF9'
	};

	myChart.setOption(option);
})();

(function() {
	var myChart = echarts.init(document.getElementById('main1'));
 var option = {
//  backgroundColor: '#2c343c',

    title: {
        text: '今日到店年龄分布',
        left: 'center',
        top: 20,
        textStyle: {
            color: '#05dfde'
        }
    },

    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
            colorLightness: [0, 1]
        }
    },
    series : [
        {
            name:'访问来源',
            type:'pie',
            radius : '55%',
            center: ['50%', '50%'],
            data:[
                {value:335, name:'0-18岁'},
                {value:310, name:'19-20岁'},
                {value:274, name:'21-30岁'},
                {value:235, name:'31-40岁'},
                {value:400, name:'40岁以上'}
            ].sort(function (a, b) { return a.value - b.value}),
            roseType: 'angle',
            label: {
                normal: {
                    textStyle: {
                        color: '#49bdca'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: '#1e5f6f'
                    },
//                  smooth: 0.2,
//                  length: 10,
//                  length2: 20
                }
            },
            itemStyle: {
                normal: {
                    color: '#00fff9',
                    shadowBlur: 200,
                   
                }
            }
        }
    ]
};
myChart.setOption(option);
})();

(function() {
	var mychart = echarts.init(document.getElementById('daliy'));
	var option = {
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b}: {c} ({d}%)"
		},
		legend: {
			orient: 'vertical',
			x: 'left',
			data: ['直接访']
		},
		series: [{
			name: '访问来源',
			type: 'pie',
			radius: ['50%', '70%'],
			avoidLabelOverlap: false,
			label: {
				normal: {
					show: false,
					position: 'center'
				},
				emphasis: {
					show: true,
					textStyle: {
						fontSize: '30',
						fontWeight: 'bold'
					}
				}
			},
			labelLine: {
				normal: {
					show: false
				}
			},
			data: [{
				value: 177,
				name: '今日出勤率'
			}, {
				value: 863,
				name: '今日出勤率'
			}]
		}]
	};
	mychart.setOption(option);
})();

(function() {
	var myChart = echarts.init(document.getElementById('week'));
	var dataAxis = ['点', '击', '柱', '子', '或', '者', '两'];
	var data = [220, 182, 191, 234, 290, 330, 310];
	var yMax = 500;
	var dataShadow = [];

	for(var i = 0; i < data.length; i++) {
		dataShadow.push(yMax);
	}

	var option = {
		title: {
			text: '特性示例：渐变色 阴影 点击缩放',
			subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
		},
		xAxis: {
			data: dataAxis,
			axisLabel: {
				inside: true,
				textStyle: {
					color: '#fff'
				}
			},
			axisTick: {
				show: false
			},
			axisLine: {
				show: false
			},
			z: 10
		},
		yAxis: {
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				textStyle: {
					color: '#999'
				}
			}
		},
		dataZoom: [{
			type: 'inside'
		}],
	series: [{ // For shadow
//			type: 'bar',
//			itemStyle: {
//				normal: {
//					color: 'rgba(0,0,0,0.05)'
//				}
//			},
//			barGap: '-100%',
//			barCategoryGap: '40%',
//			data: dataShadow,
//			animation: false
//		}, {
			type: 'bar',
			itemStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(
						0, 0, 0, 1, [{
							offset: 0,
							color: '#83bff6'
						}, {
							offset: 0.5,
							color: '#188df0'
						}, {
							offset: 1,
							color: '#188df0'
						}]
					)
				},
				emphasis: {
					color: new echarts.graphic.LinearGradient(
						0, 0, 0, 1, [{
							offset: 0,
							color: '#2378f7'
						}, {
							offset: 0.7,
							color: '#2378f7'
						}, {
							offset: 1,
							color: '#83bff6'
						}]
					)
				}
			},
			data: data
		}]
	};

	// Enable data zoom when user click bar.
	var zoomSize = 6;
	myChart.on('click', function(params) {
		console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
		myChart.dispatchAction({
			type: 'dataZoom',
			startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
			endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
		});
	});
	myChart.setOption(option)
})();

(function() {
	//以下是map（地图）
var myChart = echarts.init(document.getElementById('map'));
  var geoCoordMap = {
      '上海': [121.4648, 31.2891],
      '东莞': [113.8953, 22.901],
      '东营': [118.7073, 37.5513],
      '中山': [113.4229, 22.478],
      '临汾': [111.4783, 36.1615],
      '临沂': [118.3118, 35.2936],
      '丹东': [124.541, 40.4242],
      '丽水': [119.5642, 28.1854],
      '乌鲁木齐': [87.9236, 43.5883],
      '佛山': [112.8955, 23.1097],
      '保定': [115.0488, 39.0948],
      '兰州': [103.5901, 36.3043],
      '包头': [110.3467, 41.4899],
      '北京': [116.4551, 40.2539],
      '北海': [109.314, 21.6211],
      '南京': [118.8062, 31.9208],
      '南宁': [108.479, 23.1152],
      '南昌': [116.0046, 28.6633],
      '南通': [121.1023, 32.1625],
      '厦门': [118.1689, 24.6478],
      '台州': [121.1353, 28.6688],
      '合肥': [117.29, 32.0581],
      '呼和浩特': [111.4124, 40.4901],
      '咸阳': [108.4131, 34.8706],
      '哈尔滨': [127.9688, 45.368],
      '唐山': [118.4766, 39.6826],
      '嘉兴': [120.9155, 30.6354],
      '大同': [113.7854, 39.8035],
      '大连': [122.2229, 39.4409],
      '天津': [117.4219, 39.4189],
      '太原': [112.3352, 37.9413],
      '威海': [121.9482, 37.1393],
      '宁波': [121.5967, 29.6466],
      '宝鸡': [107.1826, 34.3433],
      '宿迁': [118.5535, 33.7775],
      '常州': [119.4543, 31.5582],
      '广州': [113.5107, 23.2196],
      '廊坊': [116.521, 39.0509],
      '延安': [109.1052, 36.4252],
      '张家口': [115.1477, 40.8527],
      '徐州': [117.5208, 34.3268],
      '德州': [116.6858, 37.2107],
      '惠州': [114.6204, 23.1647],
      '成都': [103.9526, 30.7617],
      '扬州': [119.4653, 32.8162],
      '承德': [117.5757, 41.4075],
      '拉萨': [91.1865, 30.1465],
      '无锡': [120.3442, 31.5527],
      '日照': [119.2786, 35.5023],
      '昆明': [102.9199, 25.4663],
      '杭州': [119.5313, 29.8773],
      '枣庄': [117.323, 34.8926],
      '柳州': [109.3799, 24.9774],
      '株洲': [113.5327, 27.0319],
      '武汉': [114.3896, 30.6628],
      '汕头': [117.1692, 23.3405],
      '江门': [112.6318, 22.1484],
      '沈阳': [123.1238, 42.1216],
      '沧州': [116.8286, 38.2104],
      '河源': [114.917, 23.9722],
      '泉州': [118.3228, 25.1147],
      '泰安': [117.0264, 36.0516],
      '泰州': [120.0586, 32.5525],
      '济南': [117.1582, 36.8701],
      '济宁': [116.8286, 35.3375],
      '海口': [110.3893, 19.8516],
      '淄博': [118.0371, 36.6064],
      '淮安': [118.927, 33.4039],
      '深圳': [114.5435, 22.5439],
      '清远': [112.9175, 24.3292],
      '温州': [120.498, 27.8119],
      '渭南': [109.7864, 35.0299],
      '湖州': [119.8608, 30.7782],
      '湘潭': [112.5439, 27.7075],
      '滨州': [117.8174, 37.4963],
      '潍坊': [119.0918, 36.524],
      '烟台': [120.7397, 37.5128],
      '玉溪': [101.9312, 23.8898],
      '珠海': [113.7305, 22.1155],
      '盐城': [120.2234, 33.5577],
      '盘锦': [121.9482, 41.0449],
      '石家庄': [114.4995, 38.1006],
      '福州': [119.4543, 25.9222],
      '秦皇岛': [119.2126, 40.0232],
      '绍兴': [120.564, 29.7565],
      '聊城': [115.9167, 36.4032],
      '肇庆': [112.1265, 23.5822],
      '舟山': [122.2559, 30.2234],
      '苏州': [120.6519, 31.3989],
      '莱芜': [117.6526, 36.2714],
      '菏泽': [115.6201, 35.2057],
      '营口': [122.4316, 40.4297],
      '葫芦岛': [120.1575, 40.578],
      '衡水': [115.8838, 37.7161],
      '衢州': [118.6853, 28.8666],
      '西宁': [101.4038, 36.8207],
      '西安': [109.1162, 34.2004],
      '贵阳': [106.6992, 26.7682],
      '连云港': [119.1248, 34.552],
      '邢台': [114.8071, 37.2821],
      '邯郸': [114.4775, 36.535],
      '郑州': [113.4668, 34.6234],
      '鄂尔多斯': [108.9734, 39.2487],
      '重庆': [107.7539, 30.1904],
      '金华': [120.0037, 29.1028],
      '铜川': [109.0393, 35.1947],
      '银川': [106.3586, 38.1775],
      '镇江': [119.4763, 31.9702],
      '长春': [125.8154, 44.2584],
      '长沙': [113.0823, 28.2568],
      '长治': [112.8625, 36.4746],
      '阳泉': [113.4778, 38.0951],
      '青岛': [120.4651, 36.3373],
      '韶关': [113.7964, 24.7028]
  };

  var BJData = [
      [{
          name: '北京'
      }, {
          name: '上海',
          value: 95
      }],
      [{
          name: '北京'
      }, {
          name: '广州',
          value: 90
      }],
      [{
          name: '北京'
      }, {
          name: '大连',
          value: 80
      }],
      [{
          name: '北京'
      }, {
          name: '南宁',
          value: 70
      }],
      [{
          name: '北京'
      }, {
          name: '南昌',
          value: 60
      }],
      [{
          name: '北京'
      }, {
          name: '拉萨',
          value: 50
      }],
      [{
          name: '北京'
      }, {
          name: '长春',
          value: 40
      }],
      [{
          name: '北京'
      }, {
          name: '包头',
          value: 30
      }],
      [{
          name: '北京'
      }, {
          name: '重庆',
          value: 20
      }],
      [{
          name: '北京'
      }, {
          name: '常州',
          value: 10
      }]
  ];

  var SHData = [
      [{
          name: '上海'
      }, {
          name: '包头',
          value: 95
      }],
      [{
          name: '上海'
      }, {
          name: '昆明',
          value: 90
      }],
      [{
          name: '上海'
      }, {
          name: '广州',
          value: 80
      }],
      [{
          name: '上海'
      }, {
          name: '郑州',
          value: 70
      }],
      [{
          name: '上海'
      }, {
          name: '长春',
          value: 60
      }],
      [{
          name: '上海'
      }, {
          name: '重庆',
          value: 50
      }],
      [{
          name: '上海'
      }, {
          name: '长沙',
          value: 40
      }],
      [{
          name: '上海'
      }, {
          name: '北京',
          value: 30
      }],
      [{
          name: '上海'
      }, {
          name: '丹东',
          value: 20
      }],
      [{
          name: '上海'
      }, {
          name: '大连',
          value: 10
      }]
  ];

  var GZData = [
      [{
          name: '广州'
      }, {
          name: '福州',
          value: 95
      }],
      [{
          name: '广州'
      }, {
          name: '太原',
          value: 90
      }],
      [{
          name: '广州'
      }, {
          name: '长春',
          value: 80
      }],
      [{
          name: '广州'
      }, {
          name: '重庆',
          value: 70
      }],
      [{
          name: '广州'
      }, {
          name: '西安',
          value: 60
      }],
      [{
          name: '广州'
      }, {
          name: '成都',
          value: 50
      }],
      [{
          name: '广州'
      }, {
          name: '常州',
          value: 40
      }],
      [{
          name: '广州'
      }, {
          name: '北京',
          value: 30
      }],
      [{
          name: '广州'
      }, {
          name: '北海',
          value: 20
      }],
      [{
          name: '广州'
      }, {
          name: '海口',
          value: 10
      }]
  ];
  
  var planePath = "path://M917.965523 917.331585c0 22.469758-17.891486 40.699957-39.913035 40.699957-22.058388 0-39.913035-18.2302-39.913035-40.699957l-0.075725-0.490164-1.087774 0c-18.945491-157.665903-148.177807-280.296871-306.821991-285.4748-3.412726 0.151449-6.751774 0.562818-10.240225 0.562818-3.450589 0-6.789637-0.410346-10.202363-0.524956-158.606321 5.139044-287.839661 127.806851-306.784128 285.436938l-1.014096 0 0.075725 0.490164c0 22.469758-17.854647 40.699957-39.913035 40.699957s-39.915082-18.2302-39.915082-40.699957l-0.373507-3.789303c0-6.751774 2.026146-12.903891 4.91494-18.531052 21.082154-140.712789 111.075795-258.241552 235.432057-312.784796C288.420387 530.831904 239.989351 444.515003 239.989351 346.604042c0-157.591201 125.33352-285.361213 279.924387-285.361213 154.62873 0 279.960203 127.770012 279.960203 285.361213 0 97.873098-48.391127 184.15316-122.103966 235.545644 124.843356 54.732555 215.099986 172.863023 235.808634 314.211285 2.437515 5.290493 4.01443 10.992355 4.01443 17.181311L917.965523 917.331585zM719.822744 346.679767c0-112.576985-89.544409-203.808826-199.983707-203.808826-110.402459 0-199.944821 91.232864-199.944821 203.808826s89.542362 203.808826 199.944821 203.808826C630.278335 550.488593 719.822744 459.256752 719.822744 346.679767z";
  var convertData = function(data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
          var dataItem = data[i];
          var fromCoord = geoCoordMap[dataItem[0].name];
          var toCoord = geoCoordMap[dataItem[1].name];
          if (fromCoord && toCoord) {
              res.push({
                  fromName: dataItem[0].name,
                  toName: dataItem[1].name,
                  coords: [fromCoord, toCoord]
              });
          }
      }
      return res;
  };

  var color = ['#a6c84c', '#ffa022', '#46bee9'];
  var series = [];
  [
      ['北京', BJData],
      ['上海', SHData],
      ['广州', GZData]
  ].forEach(function(item, i) {
      series.push({ //线
          name: item[0],
          //                    name: item[0] + ' Top10',
          type: 'lines',
          zlevel: 1,
          effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: '#fff',
              symbolSize: 3
          },
          lineStyle: {
              normal: {
                  color: color[i],
                  width: 0,
                  curveness: 0.2
              }
          },
          data: convertData(item[1])
      }, { //移动 点
          name: item[0],
          type: 'lines',
          zlevel: 2,
          effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: planePath,
              symbolSize: 15
          },
          lineStyle: {
              normal: {
                  color: color[i],
                  width: 1,
                  opacity: 0.4,
                  curveness: 0.2
              }
          },
          data: convertData(item[1])
      }, { //省份圆点
          name: item[0],
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 2,
          rippleEffect: {
              brushType: 'stroke'
          },
          label: {
              normal: {
                  show: true,
                  position: 'right',
                  formatter: '{b}'
              }
          },
          symbolSize: function(val) {
              return val[2] / 4;
          },
          itemStyle: {
              normal: {
                  color: color[i]
              }
          },
          data: item[1].map(function(dataItem) {
              return {
                  name: dataItem[1].name,
                  value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
              };
          })
      });
  });

  option = {
//    backgroundColor: '#404a59',
      title: {
          text: '',
          subtext: '',
          left: 'center',
          textStyle: {
              color: '#fff'
          }
      },
      tooltip: {
          trigger: 'item',
          formatter: function(params) {
              if (params.seriesIndex == 2 || params.seriesIndex == 5 || params.seriesIndex == 8) {
                  return params.name + '<br>' + params.seriesName + ':' + params.data.value[2] + ' 人次';
              } else if (params.seriesIndex == 1 || params.seriesIndex == 4 || params.seriesIndex == 7) {
                  return params.data.fromName + '→' + params.data.toName;
              }
          }
      },
      legend: {
          orient: 'vertical',
          top: 'bottom',
          left: 'right',
          data: ['北京', '上海', '广州'],
          textStyle: {
              color: '#fff'
          },
          selectedMode: 'single'
      },
      geo: {
          map: 'china',
          label: {
              emphasis: {
                  show: false
              }
          },
          roam: true,
          itemStyle: {
              normal: {
                  areaColor: '#243232',
                  borderColor: '#404a59'
              },
              emphasis: {
                  areaColor: '#2a333d'
              }
          }
      },
      series: series
  };
  if (option && typeof option === "object") {
      myChart.setOption(option, true);
  };
myChart.setOption(option);
})();

(function() {
//	var myChart = echarts.init(document.getElementById('all'));
//	var option = {
//		tooltip: {
//			trigger: 'item',
//			formatter: "{a} <br/>{b} : {c} ({d}%)"
//		},
//		calculable: true,
//		series: [{
//			name: '面积模式',
//			type: 'pie',
//			radius: [50, 110],
//			center: ['50%', '50%'],
//			roseType: 'area',
//			data: [{
//				value: 50,
//				name: '已完成维修'
//			}, {
//				value: 25,
//				name: '正在维修中'
//			}, {
//				value: 15,
//				name: '未处理维修'
//			}, {
//				value: 5,
//				name: '已处理还未维修'
//			}]
//		}]
//	};
//	myChart.setOption(option);
var myChart = echarts.init(document.getElementById('all'));
var option = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show:true,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show:true
                }
            },
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
};
myChart.setOption(option);
})();

(function(){
	var myChart = echarts.init(document.getElementById('rate'));
	var option = {
	    tooltip : {
	        formatter: "{a} <br/>{b} : {c}"
	    },
	    toolbox: {
	        feature: {
	            restore: {},
	            saveAsImage: {}
	        }
	    },
	    series: [
	        {
	            name: '维修速度',
	            type: 'gauge',
	            startAngle: 180,
	            endAngle: 0,
	            min: 0,
	            max: 24,
	            
	            detail: {formatter:'{value}'},
	            data: [{
	            	value: 18, 
	            	name: '维修速度',
	            	textStyle: {
	            		color: '#66FFFB'
	            	}
	            }],
	            axisLine:{
	                show: true,
	                lineStyle : {
	                    width : 1,
	                    color:[[0, '#D1F6F6'],[0.35,'#B1D3D7'],[0.75,'#607D89'],[1,'#405B69']]
	                }
	            },
	            axisTick:{
	                show: false,
		        },
		        axisLabel:{
		            show:false,
		        }
	        }
	    ]
	};
	
	setInterval(function () {
	    option.series[0].data[0].value = (Math.random() * 24).toFixed(2) - 0;
	    myChart.setOption(option, true);
	},2000);

})();
