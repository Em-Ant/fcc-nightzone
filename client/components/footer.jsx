import React from 'react';

const Footer = function () {
  return (
    <footer>
      <div className="container">
        <div>
          <p>
            by{' '}
            <a href="http://www.emant.altervista.org" target="_blank">
              em-ant
            </a>{' '}
            |&nbsp;
            <a href="https://github.com/Em-Ant" target="_blank">
              github
            </a>{' '}
            |&nbsp;
            <a href="http://codepen.io/Em-Ant/" target="_blank">
              codepen
            </a>{' '}
            |&nbsp;
            <a href="http://www.freecodecamp.com/em-ant" target="_blank">
              freeCodeCamp
            </a>
          </p>
          <p>
            Powered by{' '}
            <a className="yelp" href="https://www.yelp.com/" target="_blank">
              Yelp
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
