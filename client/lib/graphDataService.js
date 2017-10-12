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
        let timeStep = (2048 / (200*60));
        let getFixed = (val) => {
          return parseFloat((val * timeStep).toFixed(2));
        };



        dataPoints.FFTData = Object.keys(dataPoints.FFTData).map((curKey) => {
          return {
            x: parseFloat(curKey),
            y: parseFloat(dataPoints.FFTData[curKey])
          };
        });
        dataPoints.fullAreas = Object.keys(dataPoints.fullAreas).map((curKey, i) => {
          return {
            x: getFixed(i),
            y: parseFloat(dataPoints.fullAreas[curKey])
          };
        });
        dataPoints.preAlphaAreas = Object.keys(dataPoints.preAlphaAreas).map((curKey, i) => {
          return {
            x: getFixed(i),
            y: parseFloat(dataPoints.preAlphaAreas[curKey])
          };
        });
        dataPoints.alphaAreas = Object.keys(dataPoints.alphaAreas).map((curKey, i) => {
          return {
            x: getFixed(i),
            y: parseFloat(dataPoints.alphaAreas[curKey])
          };
        });
        dataPoints.restOfAreas = dataPoints.fullAreas.map((curPair, index) => {
          return {
            x: curPair.x,
            y: curPair.y - dataPoints.preAlphaAreas[index].y - dataPoints.alphaAreas[index].y
          };
        });
        dataPoints.stackedAreas = [
          {
            key: 'Other Activity (3 Hz - 5.5 Hz + 12+ Hz) AUC',
            values: dataPoints.restOfAreas
          },
          {
            key: 'Pre-Alpha (5.5 Hz - 8 Hz) AUC',
            values: dataPoints.preAlphaAreas
          },
          {
            key: 'Alpha (8 Hz - 12 Hz) AUC',
            values: dataPoints.alphaAreas
          }
        ];
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