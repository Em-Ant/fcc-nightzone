React = require('react');

var appUrl = window.location.origin;

module.exports = React.createClass({

  render: function () {
    var href = this.props.loggedIn
      ? appUrl + '/logout'
      : appUrl + '/auth/twitter'
    var button = this.props.loggedIn
      ? <a href={href}>
          <div className="btn" onClick={this.props.logHandler}>
            logout
          </div>
        </a>
      : <a href={href}>
          <div className="btn" onClick={this.props.logHandler}>
            <span><img src="/img/twitter_w_32.png"></img></span>login
          </div>
        </a>

    if (this.props.logging) {
      button = <a href={href} className="disabled">
                <div className="btn disabled" onClick={this.props.logHandler}>
                  wait...
                </div>
              </a>
    }
    return (
      <nav className="navbar">
        <div className="container">
          <h1 className="brand nav">nightzone</h1>
          <div className="nav right buttons">
            {button}
          </div>
          <div className="nav right user">@{this.props.username}</div>
        </div>
      </nav>
    )
  }
})
