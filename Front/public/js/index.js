ZC.LICENSE = ['7b185ca19b4be2cba68fdcd369c663a9'];

var myConfig = {
 	type: 'line',
  globals: {
    fontFamily: 'Josefin Sans'
  },
  plot: {
    aspect: 'spline',

  },
  plotarea: {
    margin: 'dynamic'
  },
  scaleX: {
    values: ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"]
  },
  scaleY: {
    visible: false
  },
	series: [
		{
			values: [350,220,370,190,250,340,170,350],
      marker: {
        backgroundColor: '#e91e63',
        size: '3'
      },
      lineColor: '#e91e63'
		}
	]
};

zingchart.render({ 
	id: 'myChart', 
	data: myConfig,
  height: '100%',
  width: '100%'
});