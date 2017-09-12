class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datum: [{
        key: "qEEG test data",
        values: []
      }]
    };
  }


  componentDidMount() {
    console.log('app component mounted');
    $.ajax({
      type: 'GET',
      url: '/qeeg/data',
      success: function (dataPoints) {
        alert(dataPoints.length, 'top of success callback');
        dataPoints = dataPoints.split('\n').map((cur) => {
          return parseFloat(cur.replace('[','').replace(']',''));
        });
        console.log(dataPoints.length, 'parsed dem points');
        this.setState({
          datum: [{
            key: "qEEG test data",
            values: dataPoints
          }]
        });
        console.log('qeeg data loaded');
      }.bind(this),
      error: function (err) {
        console.log('problem fetching qeeg data ', err);
      }
    });
  }

  render() {
    return (

      <NVD3Chart id="lineChart" type="lineChart" datum={this.state.datum} x="time" y="data" />
    );
  }
}



ReactDOM.render(
  <App />, document.getElementById('app')
);