class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rawData: [],
      rawDataFFT: [],
      datum: [{
        key: "",
        values: []
      }],
      datumFFT: [{
        key: "FFT of first epoch",
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
      this.setState({
        datum: [{
          key: "data from EEG",
          values: data
        }]
      })
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
      <qEEGChart datum={this.state.datum}/>

    );
  }
}



ReactDOM.render(
  <App getGraphData={window.graphData} />, document.getElementById('app')
);