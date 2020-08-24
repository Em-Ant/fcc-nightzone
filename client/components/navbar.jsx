import React from 'react';

const appUrl = window.location.origin;

const Nav = function (props) {
  const href = props.loggedIn ? appUrl + '/logout' : appUrl + '/auth/twitter';
  let button = (
    <a href={href}>
      <div className="btn" onClick={props.logHandler}>
        {props.loggedIn ? (
          'logout'
        ) : (
          <>
            <span>
              <img src="/img/twitter_w_32.png"></img>
            </span>
            login
          </>
        )}
      </div>
    </a>
  );

  if (props.logging) {
    button = (
      <a href={href} className="disabled">
        <div className="btn disabled" onClick={props.logHandler}>
          wait...
        </div>
      </a>
    );
  }
  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="brand nav">nightzone</h1>
        <div className="nav right buttons">{button}</div>
        <div className="nav right user">@{props.username}</div>
      </div>
    </nav>
  );
};

export default Nav;
