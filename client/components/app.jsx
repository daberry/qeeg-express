class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rawData: [],
      datum: [{
        key: "qEEG test data",
        values: []
      }]
    };
  }


  componentDidMount() {
    $.ajax({
      type: 'GET',
      url: '/qeeg/data',
      success: function (dataPoints) {
        console.log('success callback, # datapoints: ', dataPoints.length);
        this.setState({
          rawData: dataPoints
        });
        dataPoints = dataPoints.split('\n').map((cur, i) => {
          return {
            x: i / 200,
            y: parseFloat(cur.replace('[', '').replace(']', ''))
          };
        });


        this.setState({
          datum: [{
            key: "qEEG test data",
            values: dataPoints
          }]
        });
        console.log('qeeg data loaded', dataPoints);
      }.bind(this),
      error: function (err) {
        console.log('problem fetching qeeg data ', err);
      }
    });
  }

  render() {
    return (
      <NVD3Chart id="lineChart" type="lineChart" datum={this.state.datum} x="time" y="data" height="600" yDomain={[-50,50]} />
    );
  }
}



ReactDOM.render(
  <App />, document.getElementById('app')
);