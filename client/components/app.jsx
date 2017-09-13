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
      }]
    };
  }


  componentDidMount() {
    var options = {
      type: 'data',
      url: '/qeeg/data'
    };
    this.props.getGraphData(options, (data) => {
      console.log('graphData callback');
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
      console.log('FFT data callback');
      this.setState({
        datumFFT: [{
          key: 'first epoch FFT',
          values: data
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
        <div class="qeeg-chart"><QEEGChart datum={this.state.datumFFT} /></div>
        <div class="qeeg-chart"><QEEGChart datum={this.state.datum} /></div>
      </div>
    );
  }
}



ReactDOM.render(
  <App getGraphData={window.graphData} />, document.getElementById('app')
);