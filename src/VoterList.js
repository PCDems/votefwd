// src/VoterList.js

import React, { Component } from 'react';
import Avatar from 'react-avatar';

export class VoterList extends Component {
  render() {
    return (
      <div>
        <h2 className="title tc">Your Voters</h2>
        <ul className="list pl0 mt0 measure center">
        {this.props.voters.map(voter =>
          <li className="flex items-center lh-copy pa3 ph0-l bb b--black-10" key={voter.id}>
            <Avatar size={50} round={true} name={voter.first_name + ' ' + voter.last_name}/>
            <div className="pl3 flex-auto">
              <span className="f6 db black-70">{voter.first_name} {voter.last_name}
                <br/>
                {voter.address}
                <br/>
                {voter.city}, {voter.state} {voter.zip}
              </span>
            </div>
          </li>
        )}
        </ul>
      </div>
    );
  }
}
