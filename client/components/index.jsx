var React = require('react');
var ReactDOM = require('react-dom');
var css = require('../style/index.scss');

var ajax = new (require('../js/ajax-functions.js'));
var appUrl = window.location.origin;

var ListEntry = require('./list_entry.jsx');
var Navbar = require('./navbar.jsx');
var Footer = require('./footer.jsx');

var h = require('./index_helpers.js');

var App = React.createClass({
  waitstate: false,
  search: function() {
    var location = this.refs.search.value;
    if (location && !this.waitstate) {
      this.waitstate = true;
      this.setState({searching: true, bars: undefined});
      var self = this;
      if(self.state.loggedIn) {
        h.searchAuth(function(bars){
          self.setState({bars: bars, searching: undefined});
          self.waitstate = false;
        }, location)
      } else {
        h.search(function(bars) {
          self.setState({bars: bars, searching: undefined});
          self.waitstate = false;
        }, location);
      }
    }
  },
  getInitialState: function() {
    return {
      user: {twitter: {username: 'guest'}}
    }
  },
  componentDidMount: function () {
    var self = this;
    ajax.ajaxRequest('get', appUrl + '/api/user', function(user) {
      user = JSON.parse(user);
      if (!(user.status && user.status === 'guest')) {
        self.setState({loggedIn: true, user: user});
        if(user.location !== '') {
        h.searchAuth(function(bars){
          self.refs.search.value = user.location;
          self.setState({bars: bars, searching: undefined});
          })
        }
      }
    })
  },
  logHandler: function() {
    this.setState({logging: true})
    this.waitstate = true;
  },
  clickHandler: function(index) {
    if(!this.waitstate) {
      var bar = this.state.bars[index];
      var newBar = h.copy(bar);
      var self = this;
      this.setState({updating: index});
      if(bar.amIGoing) {
        h.removeMe(function(update) {
          newBar.nGoing = update.nGoing;
          newBar.amIGoing = update.amIGoing;
          var bars = self.state.bars;
          bars[index] = newBar;
          self.setState({bars: bars, updating: undefined});
          self.waitstate = false;
        }, bar.barId);
      } else {
        h.addMe(function(update) {
          newBar.nGoing = update.nGoing;
          newBar.amIGoing = update.amIGoing;
          var bars = self.state.bars;
          bars[index] = newBar;
          self.setState({bars: bars, updating: undefined});
          self.waitstate = false;
        }, bar.barId);
      }
    }
  },
  keyHandle: function(e) {
    if(e.keyCode === 13)
      this.search();
  },
  render: function() {
    var bars;
    if(this.state.bars) {
      var self = this;
      bars = this.state.bars.map(function(bar, i){
        return (
          <ListEntry
            loggedIn={self.state.loggedIn}
            appUrl={appUrl}
            bar={bar}
            key={i}
            index={i}
            clickHandler={self.clickHandler}
            loading={self.state.updating}/>
        )
      })
    } else {
      bars = [];
    };

    var searchText, searchClass;
    if (this.state.searching) {
      searchText = 'Searching...';
      searchClass = 'disabled btn'
    } else {
      searchText = 'SEARCH';
      searchClass = 'btn'
    }
    return (
      <div>
        <Navbar
          loggedIn={this.state.loggedIn}
          logHandler={this.logHandler}
          logging={this.state.logging}
          username={this.state.user.twitter.username}
          />
        <div className="container">
          <div className="mainsearch">
            <div className="col w75">
              <div className="inputwrap">
                <input
                  ref="search"
                  placeholder="find bars in your city..."
                  onKeyDown={this.keyHandle}/>
              </div>
            </div>
            <div className="col w25 center">
              <div className={searchClass} onClick={this.search}>{searchText}</div>
            </div>
          </div>
          <ul>
            {bars}
          </ul>
        </div>
        <Footer/>
       </div>

    )
  }
});

ReactDOM.render(<App/>, document.getElementById('appView'));
