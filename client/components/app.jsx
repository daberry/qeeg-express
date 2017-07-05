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