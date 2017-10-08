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
        }]
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
          height={400}
          yDomain={[-50,50]}
        />
      */
      <div id="appContainer">
        <h2>FFT</h2>
        <div class="qeeg-chart"><QEEGChart datum={this.state.datumFFT} /></div>
        <h2> Over 3 HZ AUC</h2>
        <div class="qeeg-chart"><QEEGChart datum={this.state.datumFullAUC} /></div>
        <h2> Pre-Alpha (5.5 Hz - 8 Hz) AUC</h2>
        <div class="qeeg-chart"><QEEGChart datum={this.state.datumPreAlphaAUC} /></div>
        <h2> Alpha (8 Hz - 12 Hz) AUC</h2>
        <div class="qeeg-chart"><QEEGChart datum={this.state.datumAlphaAUC} /></div>
        <h2>Raw EEG Waveform</h2>
        <div class="qeeg-chart"><QEEGChart datum={this.state.datum} /></div>
      </div>
    );
  }
}



ReactDOM.render(
  <App getGraphData={window.graphData} />, document.getElementById('app')
);