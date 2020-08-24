import React from 'react';
import ReactDOM from 'react-dom';

import '../style/index.scss';

var ajax = new (require('../js/ajax-functions.js'))();
var appUrl = window.location.origin;

import ListEntry from './list_entry.jsx';
import Navbar from './navbar.jsx';
import Footer from './footer.jsx';

var h = require('./index_helpers.js');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.waitstate = false;

    this.state = {
      user: { twitter: { username: 'guest' } },
    };

    this.searchRef = React.createRef();

    this.search = this.search.bind(this);
    this.logHandler = this.logHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }
  search(e) {
    e.preventDefault();
    var location = this.searchRef.current.value;
    if (location && !this.waitstate) {
      this.waitstate = true;
      this.setState({ searching: true, bars: undefined });
      var self = this;
      if (self.state.loggedIn) {
        h.searchAuth(function (bars) {
          self.setState({ bars: bars, searching: undefined });
          self.waitstate = false;
        }, location);
      } else {
        h.search(function (bars) {
          self.setState({ bars: bars, searching: undefined });
          self.waitstate = false;
        }, location);
      }
    }
  }
  componentDidMount() {
    var self = this;
    ajax.ajaxRequest('get', appUrl + '/api/user', function (user) {
      user = JSON.parse(user);
      if (!(user.status && user.status === 'guest')) {
        self.setState({ loggedIn: true, user: user });
        if (user.location !== '') {
          h.searchAuth(function (bars) {
            self.searchRef.current.value = user.location;
            self.setState({ bars: bars, searching: undefined });
          });
        }
      }
    });
  }
  logHandler() {
    this.setState({ logging: true });
    this.waitstate = true;
  }
  clickHandler(index) {
    if (!this.waitstate) {
      var bar = this.state.bars[index];
      var newBar = h.copy(bar);
      var self = this;
      this.setState({ updating: index });
      if (bar.amIGoing) {
        h.removeMe(function (update) {
          newBar.nGoing = update.nGoing;
          newBar.amIGoing = update.amIGoing;
          var bars = self.state.bars;
          bars[index] = newBar;
          self.setState({ bars: bars, updating: undefined });
          self.waitstate = false;
        }, bar.barId);
      } else {
        h.addMe(function (update) {
          newBar.nGoing = update.nGoing;
          newBar.amIGoing = update.amIGoing;
          var bars = self.state.bars;
          bars[index] = newBar;
          self.setState({ bars: bars, updating: undefined });
          self.waitstate = false;
        }, bar.barId);
      }
    }
  }
  render() {
    var bars;
    if (this.state.bars) {
      var self = this;
      bars = this.state.bars.map(function (bar, i) {
        return (
          <ListEntry
            loggedIn={self.state.loggedIn}
            appUrl={appUrl}
            bar={bar}
            key={i}
            index={i}
            clickHandler={self.clickHandler}
            loading={self.state.updating}
          />
        );
      });
    } else {
      bars = [];
    }

    var searchText, searchClass;
    if (this.state.searching) {
      searchText = 'Searching...';
      searchClass = 'disabled btn';
    } else {
      searchText = 'SEARCH';
      searchClass = 'btn';
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
            <form onSubmit={this.search}>
              <div className="col w75">
                <input
                  ref={this.searchRef}
                  placeholder="find bars in your city..."
                />
              </div>
              <div className="col w25 center">
                <button className={searchClass}>{searchText}</button>
              </div>
            </form>
          </div>
          <ul>{bars}</ul>
        </div>
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('appView'));
