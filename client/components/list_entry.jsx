
var React = require('react');

module.exports = React.createClass({
  render: function () {
    var bar = this.props.bar;
    var loggedIn = this.props.loggedIn;
    var loading = this.props.loading;
    var index = this.props.index;
    var snippet = bar.snippet ? <p className="snippet">{bar.snippet}</p> : undefined;
    var going;
    var barClass = bar.nGoing
      ? (bar.amIGoing ? ' gobtn active imgoing' : ' gobtn active')
      : 'gobtn'
    if(loading !== undefined) {
      barClass += ' disabled';
    }
    if (loggedIn) {
      going =
        <div
          className={barClass}
          onClick={this.props.clickHandler.bind(null, index)}>
          { bar.nGoing ? bar.nGoing + ' going'  : 'Go'}
        </div>
      if (loading === index){
      going =
        <div
          className={barClass}>
          Updating...
        </div>
      }
    } else {
      going = undefined;
    }

    return(
      <li>
        <div >
          <img className="img-responsive" src={bar.imageUrl || this.props.appUrl + '/img/bar.png'}></img>
        </div>
        <div className="main">
          <a href={bar.url}>{bar.name}</a>
          <p>{bar.address}</p>
          {going}
        </div>
      </li>
  )
  }
});
