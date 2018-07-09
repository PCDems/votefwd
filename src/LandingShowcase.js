// src/LandingShowcase.js
// Landing Page Showcase Blocks

import React, { Component } from 'react';
class LandingIcons extends Component {
	render() {
		return (
      <section className="landing--icons text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="mx-auto mb-5 mb-lg-0 mb-lg-3">
                <img
                  src="/images/icon-chart.png"
                  className="col-8 mx-auto mb-4"
                  alt="Chart graphic of a line pointing up"
                />
                <h3>Proven Effective</h3>
                <p className="lead mb-0 px-4">In our first test in Alabama in 2017, voters who received a letter were significantly more likely to vote (3.9 percentage point increase in turnout vs. control group).</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mx-auto mb-5 mb-lg-0 mb-lg-3">
                <img
                  src="/images/icon-paper.png"
                  className="col-8 mx-auto mb-4"
                  alt="A piece of paper and a pencil"
                />
                <h3>Easy and Fast</h3>
                <p className="lead mb-0 px-4">We give you a template. Just print, complete, and sign. Then mail all your letters 10 days before the election. (We’ll remind you).</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mx-auto mb-0 mb-lg-3">
                <img
                  src="/images/icon-usa.png"
                  className="col-8 mx-auto mb-4"
                  alt="Two dots connecting over a map of the USA"
                />
                <h3>Take Action Anywhere</h3>
                <p className="lead mb-0 px-4">Send letters even if you live far from one of the competitive House districts, or if you can’t or don’t want to canvas or phone bank.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
		);
	}
}
class LandingCallouts extends Component {
  render() {
    return (
      <section className="landing--showcase">
        <div className="container-fluid p-0">
          <div className="row no-gutters">
            <div
              className="col-lg-6 order-lg-2 text-white showcase-img"
              style= {{
                backgroundImage: 'url("/images/bg-showcase-1.jpg")'
              }}
            />
            <div className="col-lg-6 order-lg-1 showcase-text bg-danger">
              <div className="bg-dark p-5">
                <h2>The Country is in Peril</h2>
                <p className="lead mb-0">
                  The mid-term election on November 6, 2018 will determine the fate of the country. We need Congress to fight the chaos and corruption of the Trump presidency. If Democrats flip <strong>23 seats</strong>, we’ll win the House, and the power to hold Trump accountable. But to win, we need everyone to vote!
                </p>
              </div>
            </div>
          </div>
          <div className="row no-gutters">
            <div
              className="col-lg-6 text-white showcase-img"
              style= {{
                backgroundImage: 'url("/images/bg-showcase-2.jpg")'
              }}
            />
            <div className="col-lg-6 my-auto showcase-text">
              <h2>You Can Help!</h2>
              <p className="lead mb-0">
                Sending a Vote Forward letter is one of the easiest things you can do. It takes two minutes and one stamp, and meaningfully increases the odds that the recipient will vote. A concrete action you can take, no matter where you live, to get unlikely-to-vote registered Democrats to the polls in November.
              </p>
            </div>
          </div>
          <div className="row no-gutters bg-dark">
            <div
              className="col-lg-6 order-lg-2 text-white showcase-img"
              style= {{
                backgroundImage: 'url("/images/bg-showcase-3.jpg")'
              }}
            />
            <div className="col-lg-6 order-lg-1 my-auto showcase-text">
              <h2>Proven in Alabama</h2>
              <p className="lead mb-0">
                In a randomized controlled trial in the special election for U.S. Senate in Alabama in 2017, turnout among letter recipients was 3.9 percentage points higher than turnout in the control group. (3.4 percentage points after controlling for gender, age, and other factors). This is big! It appears to be one of the most effective known tactics to boost turnout.
              </p>
            </div>
          </div>
          <div className="row no-gutters">
            <div
              className="col-lg-6 text-white showcase-img"
              style= {{
                backgroundImage: 'url("/images/bg-showcase-4.jpg")',
                backgroundPosition: '0 0'
              }}
            />
            <div className="col-lg-6 my-auto showcase-text">
              <h2>Next Stop: Ohio</h2>
              <p className="lead mb-0">
                We‘re currently writing letters to Ohio to boost turnout in the special election for the House of Representatives in the 12th district on August 7. A Democratic win will bring us one seat closer to winning the House. We need your help! Will you send some letters?
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

class LandingTestimonials extends Component {
	render() {
		return (
      <section className="landing--testimonials text-center bg-light">
        <div className="container">
          <h2 className="mb-5">About Us</h2>
          <div className="row">
            <div className="col-8 mx-auto">
              <p className="lead mb-4">
                Vote Forward was started in 2017 by a group of <a href="https://en.wikipedia.org/wiki/Opower">Opower</a> alumni. We believe our democracy depends on electing a Democratic congress in 2018, so we’re volunteering our time and expertise to achieve this goal. The most important thing you can do to help is to <strong>send letters</strong>, but you can also make a donation to help us build the campaign at <a href="https://secure.actblue.com/donate/vote-forward">secure.actblue.com/donate/vote-forward</a>. Thank you!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export class LandingShowcase extends Component {
	render() {
		return (
      <div>
        <LandingIcons />
        <LandingCallouts />
        <LandingTestimonials />
      </div>
    );
  }
}
