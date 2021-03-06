import { Address, IDAOState, IProposalStage, Vote, Proposal } from "@daostack/client";
import * as classNames from "classnames";
import AccountPopup from "components/Account/AccountPopup";
import AccountProfileName from "components/Account/AccountProfileName";
import Countdown from "components/Shared/Countdown";
import { humanProposalTitle } from "lib/util";
import * as React from "react";
import { Link } from "react-router-dom";
import { closingTime } from "reducers/arcReducer";
import { proposalEnded } from "reducers/arcReducer";
import ActionButton from "./ActionButton";
import BoostAmount from "./Staking/BoostAmount";
import StakeButtons from "./Staking/StakeButtons";
import StakeGraph from "./Staking/StakeGraph";
import ProposalData from "./ProposalData";
import ProposalSummary from "./ProposalSummary";
import VoteBreakdown from "./Voting/VoteBreakdown";
import VoteButtons from "./Voting/VoteButtons";
import VoteGraph from "./Voting/VoteGraph";

import * as css from "./ProposalCard.scss";

interface IExternalProps {
  currentAccountAddress: Address;
  daoState: IDAOState;
  proposal: Proposal;
}

type IProps = IExternalProps;

export default class ProposalCard extends React.Component<IProps, null> {

  public render(): RenderOutput {

    const {
      currentAccountAddress,
      daoState,
      proposal,
    } = this.props;

    return <ProposalData currentAccountAddress={currentAccountAddress} dao={daoState} proposalId={proposal.id}>
      { props => {
        const {
          beneficiaryProfile,
          creatorProfile,
          currentAccountGenBalance,
          currentAccountGenAllowance,
          daoEthBalance,
          expired,
          member,
          proposal,
          rewards,
          stakes,
          votes,
        } = props;

        let currentAccountVote = 0;

        let currentVote: Vote;
        if (votes.length > 0) {
          currentVote = votes[0];
          currentAccountVote = currentVote.staticState.outcome;
        }

        const proposalClass = classNames({
          [css.proposal]: true,
        });

        const voteWrapperClass = classNames({
          [css.voteBox]: true,
          clearfix: true,
        });

        const voteControls = classNames({
          [css.voteControls]: true,
        });

        return (proposal.stage === IProposalStage.Queued && expired ? null :
          <div className={proposalClass + " clearfix"} data-test-id={"proposal-" + proposal.id}>
            <div className={css.proposalInfo}>
              <div className={css.cardTop + " clearfix"}>
                <div className={css.timer}>
                  {!proposalEnded(proposal) ?
                    <span className={css.content}>
                      {!expired ?
                        <Countdown toDate={closingTime(proposal)} detailView={false} overTime={proposal.stage === IProposalStage.QuietEndingPeriod && !expired} /> :
                        <span className={css.closedTime}>
                          {proposal.stage === IProposalStage.Queued ? "Expired" :
                            proposal.stage === IProposalStage.PreBoosted ? "Ready to Boost" :
                              "Closed"}&nbsp;
                          {closingTime(proposal).format("MMM D, YYYY")}
                        </span>
                      }
                    </span>
                    : " "
                  }
                </div>

                <div className={css.actionButton}>
                  <ActionButton
                    currentAccountAddress={currentAccountAddress}
                    daoState={daoState}
                    daoEthBalance={daoEthBalance}
                    proposalState={proposal}
                    rewards={rewards}
                    expired={expired}
                  />

                  <div className={css.contextMenu} data-test-id="proposalContextMenu">
                    <div className={css.menuIcon}>
                      <img src="/assets/images/Icon/Context-menu.svg"/>
                    </div>
                    <div className={css.menu}>
                      <VoteButtons
                        currentAccountAddress={currentAccountAddress}
                        currentAccountState={member}
                        currentVote={currentAccountVote}
                        dao={daoState}
                        expired={expired}
                        proposal={proposal}
                        contextMenu/>

                      <StakeButtons
                        beneficiaryProfile={beneficiaryProfile}
                        contextMenu
                        currentAccountAddress={currentAccountAddress}
                        currentAccountGens={currentAccountGenBalance}
                        currentAccountGenStakingAllowance={currentAccountGenAllowance}
                        dao={daoState}
                        expired={expired}
                        proposal={proposal}
                        stakes={stakes}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={css.createdBy}>
                <AccountPopup accountAddress={proposal.proposer} daoState={daoState} detailView={false} />
                <AccountProfileName accountAddress={proposal.proposer} accountProfile={creatorProfile} daoAvatarAddress={daoState.address} detailView={false} />
              </div>
              <div className={css.description}>
                {proposal.description}
              </div>

              <h3>
                <Link className={css.detailLink} to={"/dao/" + daoState.address + "/proposal/" + proposal.id} data-test-id="proposal-title">
                  <span>{humanProposalTitle(proposal)}</span>
                  <img src="/assets/images/Icon/Open.svg" />
                </Link>
              </h3>
              <div className={css.summary}>
                <ProposalSummary proposal={proposal} dao={daoState} beneficiaryProfile={beneficiaryProfile} detailView={false} />
              </div>

            </div>

            <div className={css.proposalActions + " clearfix"}>
              <div className={voteWrapperClass}>
                <div className={voteControls + " clearfix"}>
                  <div className={css.voteDivider}>
                    <VoteGraph size={40} proposal={proposal} />
                  </div>

                  <VoteBreakdown
                    currentAccountAddress={currentAccountAddress}
                    currentAccountState={member}
                    currentVote={currentAccountVote}
                    daoState={daoState}
                    proposal={proposal}
                    detailView={false} />
                </div>

                <div className={css.voteButtons}>
                  <VoteButtons
                    currentAccountAddress={currentAccountAddress}
                    currentAccountState={member}
                    currentVote={currentAccountVote}
                    dao={daoState}
                    expired={expired}
                    proposal={proposal} />
                </div>
              </div>

              <div className={css.predictions}>
                <StakeGraph
                  proposal={proposal}
                />
                <BoostAmount proposal={proposal} />

                <div className={css.predictionButtons}>
                  <StakeButtons
                    beneficiaryProfile={beneficiaryProfile}
                    currentAccountAddress={currentAccountAddress}
                    currentAccountGens={currentAccountGenBalance}
                    currentAccountGenStakingAllowance={currentAccountGenAllowance}
                    dao={daoState}
                    expired={expired}
                    proposal={proposal}
                    stakes={stakes}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      }
      }
    </ProposalData>;
  }
}
