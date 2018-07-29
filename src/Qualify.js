 //src/Qualify.js

import React, { Component } from 'react';
import { RecaptchaComponent } from './Recaptcha';
import { ProgressIndicator } from './ProgressIndicator';
import axios from 'axios';

export class Qualify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFormVal: '',
      zipFormVal: '',
      gRecaptchaResponse: '',
      facebookProfileVal: '',
      twitterProfileVal: '',
      linkedInProfileVal: '',
      reasonVal: '',
      reasonError: false,
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);

    this.handleZipChange = this.handleZipChange.bind(this);
    this.handleZipSubmit = this.handleZipSubmit.bind(this);

    this.handleReasonChange = this.handleReasonChange.bind(this);

    this.handleProfileSubmit = this.handleProfileSubmit.bind(this);
  }

  handleCaptcha(response) {
    axios({
      method: 'POST',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/recaptcha`,
      data: {
        recaptchaResponse: response
      }
    })
    .then(res => {
      if (res.status === 200) {
        this.props.updateUser('is_human_at', true);
      } else {
        console.error('Something went wrong with validation of humanness.');
      }
    })
    .catch(err => {
      console.error(err);
    });
  }

  handleNameChange(event) {
    this.setState({ nameFormVal: event.target.value });
  }

  handleNameSubmit(event) {
    this.props.updateUser('full_name', this.state.nameFormVal);
    event.preventDefault();
  }

  handleZipChange(event) {
    this.setState({ zipFormVal: event.target.value });
  }

  handleZipSubmit(event) {
    this.props.updateUser('zip', this.state.zipFormVal);
    event.preventDefault();
  }

  handlePledgedVote() {
    this.props.updateUser('pledged_vote_at', true);
  }

  handleIsResident() {
    this.props.updateUser('is_resident_at', true);
  }

  handleAgreedCode() {
    this.props.updateUser('accepted_code_at', true);
  }

  //////////////////////////////////////////////////////////////////////

  handleReasonChange(event) {
    this.setState({ reasonVal: event.target.value });
  }

  //////////////////////////////////////////////////////////////////////

  handleProfileSubmit(event) {
    event.preventDefault();
    const inputs = event.target.getElementsByClassName('js-profile-input');
    const reasonForParticipation = inputs.profileReason.value;

    if (!reasonForParticipation || reasonForParticipation.length < 25) {
      // Render error if there is no reason or the length is too short
      this.setState({ reasonError: true });
      return false;
    } else {
      // TODO: Combine these into a single API call
      this.props.updateUser('twitter_profile_url', inputs.profileTwitter.value);
      this.props.updateUser('facebook_profile_url', inputs.profileFacebook.value);
      this.props.updateUser('linkedin_profile_url', inputs.profileLinkedin.value);
      this.props.updateUser('why_write_letters', inputs.profileReason.value);
    }

  }

  render() {

    let formMarkup;

    let captchaQ = (
      <div className="px-4">
        <h1 className="px-4 pt-4">Welcome to Vote Forward</h1>
        <p>
          We're so excited you're getting involved! We have a few quick questions before you get started…
        </p>
        <h4>Are you a robot?</h4>
        <div className="mb-3">
          <RecaptchaComponent handleCaptchaResponse={this.handleCaptcha.bind(this)}/>
        </div>
      </div>
    );

    let pledgeQ = (
      <div>
        <div className="p-4">
          <h4 className="mb-3">Do you pledge to vote in every election?</h4>
          <button className="btn btn-primary btn-lg w-100" onClick={this.handlePledgedVote.bind(this)}>Yes</button>
          <p className="small my-3">
            The letters you send will mention <strong>your</strong> commitment to voting, urging the recipient to follow your example.
          </p>
        </div>
        <ProgressIndicator current={1} max={7}></ProgressIndicator>
      </div>
    );

    let nameQ = (
      <form onSubmit={this.handleNameSubmit}>
        <div className="p-4">
          <h4 className="mb-3">What’s your full name?</h4>
          <div className="input-group mb-3">
            <input type="text"
              className="form-control form-control-lg"
              placeholder="First and last name"
              value={this.state.nameFormVal}
              onChange={this.handleNameChange}
              required />
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </div>
        <ProgressIndicator current={2} max={7}></ProgressIndicator>
      </form>
    );

    let residentQ = (
      <div>
        <div className="p-4">
          <h4 className="mb-3">Are you a U.S. citizen or permanent resident?</h4>
          <button className="btn btn-primary btn-lg w-100" onClick={this.handleIsResident.bind(this)}>Yes</button>
          <p className="small my-3">In general, one must be a citizen or permanent resident to participate in election activities. There’s an exception for volunteering, but we’re erring on the side of caution.</p>
        </div>
        <ProgressIndicator current={3} max={7}></ProgressIndicator>
      </div>
    );

    let zipQ = (
      <form onSubmit={this.handleZipSubmit}>
        <div className="p-4">
          <h4 className="mb-3">What's your ZIP code?</h4>
          <div className="input-group mb-3">
            <input type="text"
              className="form-control form-control-lg"
              placeholder="00000"
              value={this.state.ZipFormVal}
              onChange={this.handleZipChange} />
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </div>
        <ProgressIndicator current={4} max={7}></ProgressIndicator>
      </form>
    );

    let codeQ = (
      <div>
        <div className="p-4">
          <h4 className="mb-3">Terms of Service</h4>
          <p>
            Do you agree to the <a href="/terms-of-use" target="_blank">Terms of Use</a> and <a href="privacy-policy" target="_blank">Privacy Policy</a>, and specifically, do you promise to be respectful at all times in your communications with fellow citizens via Vote Forward?
          </p>
          <button className="btn btn-primary w-100" onClick={this.handleAgreedCode.bind(this)}>Yes</button>
        </div>
        <ProgressIndicator current={5} max={7}></ProgressIndicator>
      </div>
    );

    let profileQ = (
      <div>
        <form onSubmit={this.handleProfileSubmit} className="p-4">
          <h3 className="mb-3">One last step</h3>
          <p className="mb-4">
            We need to be sure you're serious about sending letters to boost turnout among Democrats. If you have a public web presence, please share those profiles below.
          </p>

          {/* ///////////////////////////////////////////////////////////////// */}

          <div className="d-block d-sm-flex mb-3">
            <label htmlFor="profileTwitter" className="col-12 col-sm-3 m-0 pl-0 d-flex align-self-center">Twitter:</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text pt-0">@</span>
              </div>
              <input type="text"
                id="profileTwitter"
                className="form-control js-profile-input"
                placeholder="votefwd"
              />
            </div>
          </div>

          {/* ///////////////////////////////////////////////////////////////// */}

          <div className="d-block d-sm-flex mb-3">
            <label htmlFor="profileFacebook" className="col-12 col-sm-3 m-0 pl-0 d-flex align-self-center">Facebook:</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">facebook.com/</span>
              </div>
              <input type="text"
                id="profileFacebook"
                className="form-control js-profile-input"
                placeholder="votefwd"
              />
            </div>
          </div>

          {/* ///////////////////////////////////////////////////////////////// */}

          <div className="d-block d-sm-flex mb-3">
            <label htmlFor="profileLinkedin" className="col-12 col-sm-3 m-0 pl-0 d-flex align-self-center">LinkedIn:</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">linkedin.com/in/</span>
              </div>
              <input type="text"
                id="profileLinkedin"
                className="form-control js-profile-input"
                placeholder="votefwd"
              />
            </div>
          </div>

          <label htmlFor="profileReason" className="w-100 d-block d-sm-flex justify-content-between mt-4">
            <span>Finally, why are you interested in sending letters?</span>
            <span className="small text-danger d-block">&#x2605; Required</span>
          </label>

          <textarea
            id="profileReason"
            rows="4"
            className="form-control js-profile-input"
            placeholder="Please share a sentence or two about why you want to get involved."
            value={this.state.reasonVal}
            onChange={this.handleReasonChange}
            required />

          {this.state.reasonError &&
            <div className="alert alert-danger alert-sm mt-3 mb-3 center" role="alert">
              Please share a  reason for participating - it helps us to verify volunteers.
            </div>
          }

          <div className="py-4">
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100">
              Finish sign-up
            </button>
          </div>

        </form>
        <ProgressIndicator current={6} max={7}></ProgressIndicator>
      </div>
    );

    let thankYou = (
      <div className="p-4">
        <h2>Thank you for signing up</h2>
        <p>
          You should hear back from us shortly with next steps for getting involved. Thank you for volunteering to help -- we won't be able to do this without help from folks like you.
        </p>
        <p><strong>- Scott and the Vote Forward Team</strong></p>
        <div className="text-center p-4">
          <img src="/images/bg-masthead.png" className="w-50" alt=""/>
        </div>
      </div>
    );

    let readyToGo = (
      <div className="p-4">
        <h2>You're all set!</h2>
        <p>We've reviewed your profile and you're ready to start adopting voters.</p>
        <p>
          <a href="/dashboard">Go to the Dashboard</a>
        </p>
      </div>
    );

    if (!this.props.user.is_human_at) {
      formMarkup = captchaQ;
    }
    else if (!this.props.user.pledged_vote_at) {
      formMarkup = pledgeQ;
    }
    else if (!this.props.user.full_name) {
      formMarkup = nameQ;
    }
    else if (!this.props.user.is_resident_at) {
      formMarkup = residentQ;
    }
    else if (!this.props.user.zip) {
      formMarkup = zipQ;
    }
    else if (!this.props.user.accepted_code_at) {
      formMarkup = codeQ;
    }
    else if (!this.props.user.why_write_letters) {
      formMarkup = profileQ;
    }
    else if (this.props.user.qual_state === "qualified" || this.props.user.qual_state === "super_qualified") {
      formMarkup = readyToGo;
    }
    else {
      formMarkup = thankYou;
    }

    return (
      <div>
        { this.props.auth.isAuthenticated() && (
          <React.Fragment>{formMarkup}</React.Fragment>
        )}
      </div>
    );
  }
}
