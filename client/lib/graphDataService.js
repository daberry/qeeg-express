var graphData = ({type, url}, callback) => {
  if (type === "data") {
    $.ajax({
      type: 'GET',
      url: url,
      success: function (dataPoints) {
        console.log('success callback, # datapoints: ', dataPoints.length);
        dataPoints = dataPoints.split('\n').map((cur, i) => {
          return {
            x: i / 200,
            y: parseFloat(cur.replace('[', '').replace(']', ''))
          };
        });

        console.log('qeeg data loaded', dataPoints);
        return dataPoints;
      }.bind(this),
      error: function (err) {
        console.log('problem fetching qeeg data ', err);
      }
    });
  } else if (type === 'fft') {
    $.ajax({
      type: 'GET',
      url: '/qeeg/fft',
      success: function (dataPoints) {
        console.log('success callback, # datapoints: ', dataPoints.length);
        this.setState({
          rawDataFFT: dataPoints
        });
        dataPoints = Object.keys(dataPoints).map((curKey) => {
          return {
            x: parseFloat(curKey),
            y: parseFloat(dataPoints[curKey])
          };
        });


        this.setState({
          datumFFT: [{
            key: "FFT of first epoch",
            values: dataPoints
          }]
        });
        console.log('FFT data loaded', dataPoints);
      }.bind(this),
      error: function (err) {
        console.log('problem fetching FFT data ', err);
      }
    });
  }



};

window.graphData = graphData;