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
        callback(dataPoints);
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
        console.log('success callback, # datapoints: ', dataPoints.length, dataPoints);
        dataPoints.FFTData = Object.keys(dataPoints.FFTData).map((curKey) => {
          return {
            x: parseFloat(curKey),
            y: parseFloat(dataPoints.FFTData[curKey])
          };
        });
        dataPoints.fullAreas = Object.keys(dataPoints.fullAreas).map((curKey, i) => {
          return {
            x: i * (2048 / (200*60)),
            y: parseFloat(dataPoints.fullAreas[curKey])
          };
        });
        dataPoints.preAlphaAreas = Object.keys(dataPoints.preAlphaAreas).map((curKey, i) => {
          return {
            x: i * (2048 / (200*60)),
            y: parseFloat(dataPoints.preAlphaAreas[curKey])
          };
        });
        dataPoints.alphaAreas = Object.keys(dataPoints.alphaAreas).map((curKey, i) => {
          return {
            x: i * (2048 / (200*60)),
            y: parseFloat(dataPoints.alphaAreas[curKey])
          };
        });
        callback(dataPoints);
        console.log('FFT data loaded', dataPoints);
      }.bind(this),
      error: function (err) {
        console.log('problem fetching FFT data ', err);
      }
    });
  }
};

window.graphData = graphData;