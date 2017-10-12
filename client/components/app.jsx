class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rawData: [],
      datum: [{
        key: "",
        values: []
      }],
      datumFFT: [{
        key: "",
        values: []
      }],
      datumFulllAUC: [{
        key: "",
        values: []
      }],
      datumPreAlphaAUC: [{
        key: "",
        values: []
      }],
      datumAlphaAUC: [{
        key: "",
        values: []
      }]
    };
  }


  componentDidMount() {
    var options = {
      type: 'data',
      url: '/qeeg/data'
    };
    this.props.getGraphData(options, (data) => {
      //console.log('graphData callback');
      this.setState({
        datum: [{
          key: "data from EEG",
          values: data
        }]
      });
    });

    options = {
      type: 'fft',
      url: '/qeeg/fft'
    };
    this.props.getGraphData(options, (data) => {
      //data = JSON.parse(data);
      //console.log('FFT data callback', data);
      this.setState({
        datumFFT: [{
          key: 'first epoch FFT',
          values: data.FFTData
        }],
        datumFullAUC: [{
          key: 'Over 3.5 Hz AUC',
          values: data.fullAreas
        }],
        datumPreAlphaAUC: [{
          key: 'Pre-Alpha (5.5 Hz - 8 Hz) AUC',
          values: data.preAlphaAreas
        }],
        datumAlphaAUC: [{
          key: 'Alpha (8 Hz - 12 Hz) AUC',
          values: data.alphaAreas
        }],
        datumStackedAreas: data.stackedAreas
      });
    });
  }

  render() {
    return (
      /*
        <NVD3Chart
          id="lineChart"
          type="lineChart"
          datum={this.state.datum}
          x="time"
          y="data"
          height={400}gi t
          yDomain={[-50,50]}
        />
      */
      <div id="appContainer">
        {/*
        <h2>FFT</h2>
        <div class="qeeg-chart"><QEEGChart datum={this.state.datumFFT} /></div>
                <div class="qeeg-chart"><QEEGChart type="lineChart" datum={this.state.datumFullAUC} /></div>
        */}
        <h1> qEEG V0.7-z</h1>
        <div class="qeeg-chart">
          <NVD3Chart
            type="stackedAreaChart"
            datum={this.state.datumStackedAreas}
            height={650}
          />
        </div>
        {/*

        <h3> Over 3 HZ AUC</h3>
        <div className="qeeg-chart">
          <NVD3Chart
            type="lineChart"
            datum={this.state.datumFullAUC}
            x="time"
            y="data"
            height={200}
          />
        </div>
        <h3> Pre-Alpha (5.5 Hz - 8 Hz) AUC</h3>
        <div className="qeeg-chart">
          <NVD3Chart
            type="lineChart"
            datum={this.state.datumPreAlphaAUC}
            x="time"
            y="data"
            height={200}
          />
        </div>
        <h3> Alpha (8 Hz - 12 Hz) AUC</h3>
        <div className="qeeg-chart">
          <NVD3Chart
            type="lineChart"
            datum={this.state.datumAlphaAUC}
            x="time"
            y="data"
            height={200}
          />
        </div>
        */}
        <h3>Raw EEG Waveform</h3>
        <div className="qeeg-chart">
          <NVD3Chart
            type="lineChart"
            datum={this.state.datum}
            x="time"
            y="data"
            height={400}
          />
        </div>
      </div>
    );
  }
}



ReactDOM.render(
  <App getGraphData={window.graphData} />, document.getElementById('app')
);