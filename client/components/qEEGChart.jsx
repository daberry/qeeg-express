var qEEGChart = (props) => {
  <NVD3Chart
    id="lineChart"
    type="lineChart"
    datum={this.props.datum}
    x="time"
    y="data"
    height={400}
    yDomain={[-50,50]}
  />
};

window.qEEGChart = qeegChart;

