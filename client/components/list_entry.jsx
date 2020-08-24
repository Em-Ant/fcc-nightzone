import React from 'react';

const Item = function (props) {
  var bar = props.bar;
  var loggedIn = props.loggedIn;
  var loading = props.loading;
  var index = props.index;
  var snippet = bar.snippet ? (
    <p className="snippet">{bar.snippet}</p>
  ) : undefined;
  var going;
  var barClass = bar.nGoing
    ? bar.amIGoing
      ? ' gobtn active imgoing'
      : ' gobtn active'
    : 'gobtn';
  if (loading !== undefined) {
    barClass += ' disabled';
  }
  if (loggedIn) {
    going = (
      <div className={barClass} onClick={props.clickHandler.bind(null, index)}>
        {bar.nGoing ? bar.nGoing + ' going' : 'Go'}
      </div>
    );
    if (loading === index) {
      going = <div className={barClass}>Updating...</div>;
    }
  } else {
    going = undefined;
  }

  return (
    <li>
      <div className="img-container">
        <img
          className="img-responsive"
          src={bar.imageUrl || props.appUrl + '/img/bar.png'}
        ></img>
      </div>
      <div className="main">
        <a href={bar.url}>{bar.name}</a>
        <p>{bar.address}</p>
        {going}
      </div>
    </li>
  );
};

export default Item;
