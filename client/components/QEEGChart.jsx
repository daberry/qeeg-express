var QEEGChart = (props) => (
  <div className="qeeg-chart">
    <NVD3Chart
      id="lineChart"
      type="lineChart"
      datum={props.datum}
      x="time"
      y="data"
      height={400}
    />
  </div>
);

QEEGChart.propTypes = {
  datum: React.PropTypes.array.isRequired
};

window.QEEGChart = QEEGChart;

/*

*/