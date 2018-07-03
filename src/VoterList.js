// src/VoterList.js

import React, { Component } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import download from 'js-file-download';

class VoterRecord extends Component {
  constructor(props) {
    super(props)

    this.state = { signedUrl: ''}
    this.getSignedUrl = this.getSignedUrl.bind(this);
  }

  getSignedUrl(rawUrl) {
    axios({
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/voter/signed-letter-url`,
      params: { url: rawUrl }
    })
    .then(res => {
      this.setState({ signedUrl: res.data });
    })
    .catch(err => {
      console.error(err);
    });
  }

  componentWillMount() {
    // This is a kludge, a lame way of checking whether the url is signed
    // yet. On initial adoption, it comes back already signed, but on
    // subsequent page loads, it does not currently, so, check.
    // TODO: change `getAdoptedVotersForUser` in voter service
    // to always send back signed Urls.
    if ( !this.props.voter.plea_letter_url ) {
      return;
    }
    else if (this.props.voter.plea_letter_url.length > 150) {
      this.setState({ signedUrl: this.props.voter.plea_letter_url })
    }
    else {
      this.getSignedUrl(this.props.voter.plea_letter_url);
    }
  }

  render() {
    let voter = this.props.voter;
    let filename = "VoteForward_PleaLetter_" + voter.last_name + '.pdf';
    let voterDisplay = (<p>hi</p>);
    if (!voter.confirmed_prepped_at) {
      voterDisplay = (
        <div className="text-right">
          <a className="btn btn-light btn-sm mb-1"
            download={filename}
            href={this.state.signedUrl}>
              <i className="icon-arrow-down-circle icons"></i> Download
          </a>
          <button className="btn btn-success btn-sm" onClick={() => {this.props.confirmPrepped(voter)}}>
            <i className="icon-check icons"></i> Ready
          </button>
        </div>
      )
    }
    else if (voter.confirmed_prepped_at && !voter.confirmed_sent_at) {
      voterDisplay = (
        <div className="text-success small mt-2">
          <span>Ready:</span> <Moment format="M/DD/YY">{voter.confirmed_prepped_at}</Moment>
          <button className="btn btn-success btn-sm" onClick={() => {this.props.confirmSent(voter)}}>Sent</button>
        </div>
      )
    }
    else {
      voterDisplay = (
        <div className="text-success small mt-2">
          <span>Confirmed sent:</span> <Moment format="M/DD/YY">{voter.confirmed_sent_at}</Moment>
        </div>
      )
    }

    return (
      <li className="list-group-item" key={voter.id}>
        <div className="d-flex w-100 mb-1">
          <h6>{voter.first_name} {voter.last_name} <small>in {voter.city}, {voter.state}</small></h6>
          {voterDisplay}
        </div>
      </li>
    )
  }
}

export class VoterList extends Component {
  constructor(props) {
    super(props)

    this.downloadBundle = this.downloadBundle.bind(this);
    this.state= { downloadingBundle: false };
  }

  downloadBundle() {
    this.setState({downloadingBundle: true});
    axios({
     method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/voters/downloadAllLetters`,
      params: { user_id: localStorage.getItem('user_id')},
      responseType: "blob"
    })
    .then(res => {
      download(res.data, res.headers.filename);
      this.setState({downloadingBundle: false});
    })
    .catch(err => {
      console.error(err);
    });
  }

  render() {
    let toPrep = this.props.voters.filter(voter => !voter.confirmed_prepped_at);
    let toSend = this.props.voters.filter(voter => voter.confirmed_prepped_at && !voter.confirmed_sent_at);
    let alreadySent = this.props.voters.filter(voter => voter.confirmed_sent_at);
    let alertContent;
    if (this.state.downloadingBundle) {
      alertContent = (
        <div className="alert alert-warning mt-3 mb-3 center" role="alert">Preparing batch to download...this may take a minute.</div>
      );
    }
    return (
      <div className="row">
        <div className="col mr-2">
          <div className="row">
            <div className="col">
              <h6><strong>Letters to prep</strong> ({toPrep.length})</h6>
            </div>
            <div className="col text-right mb-2">
              <div className="btn-group" role="group">
                {toPrep.length > 1 &&
                <div>
                  <button className="btn btn-light btn-sm" onClick={this.downloadBundle}>
                    <i className="icon-arrow-down-circle icons"></i> Download all
                  </button>
                </div>
                }
              </div>
            </div>
            {alertContent}
          </div>
          <ul className="list-group">
            {toPrep.map(voter =>
              <VoterRecord
                key={voter.id}
                voter={voter}
                confirmPrepped={this.props.confirmPrepped}
              />)}
          </ul>
        </div>
        <div className="col">
          <h6><strong>Letters to send</strong> ({toSend.length}) <span className="badge badge-warning ml-2">Mail by Tuesday, July 31!</span></h6>
          <ul className="list-group">
            {toSend.map(voter =>
              <VoterRecord
                key={voter.id}
                voter={voter}
                confirmSent={this.props.confirmSent}
              />)}
          </ul>
        </div>
        <div className="col">
          <h6><strong>Letters sent</strong> ({alreadySent.length})</h6>
            {alreadySent.map(voter =>
              <VoterRecord
                key={voter.id}
                voter={voter}
              />)}
        </div>
      </div>
    );
  }
}
