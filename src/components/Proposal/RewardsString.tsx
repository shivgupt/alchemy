import BN = require("bn.js");
import * as React from "react";

import { IDAOState, IProposalState } from "@daostack/client";
import { formatTokens, tokenDetails } from "lib/util";

import Reputation from "components/Account/Reputation";

interface IProps {
  dao: IDAOState;
  proposal: IProposalState;
  separator?: string;
}

export default class RewardsString extends React.Component<IProps, null> {
  public render(): RenderOutput {
    const { dao, proposal, separator } = this.props;

    const contributionReward = proposal.contributionReward;
    const rewards = [];
    if (contributionReward.ethReward.gt(new BN(0))) {
      rewards.push(formatTokens(contributionReward.ethReward, "ETH"));
    }
    if (contributionReward.externalToken && contributionReward.externalTokenReward.gt(new BN(0))) {
      const tokenData = tokenDetails(contributionReward.externalToken);
      rewards.push(formatTokens(contributionReward.externalTokenReward, tokenData ? tokenData["symbol"] : "?", tokenData ? tokenData["decimals"] : 18));
    }
    if (contributionReward.nativeTokenReward.gt(new BN(0))) {
      rewards.push(formatTokens(contributionReward.nativeTokenReward, dao.tokenSymbol));
    }
    if (!contributionReward.reputationReward.isZero()) {
      rewards.push(
        <Reputation daoName={dao.name} totalReputation={dao.reputationTotalSupply} reputation={contributionReward.reputationReward}/>
      );
    }
    return <strong>
      {rewards.reduce((acc, v) => {
        return acc === null ? <React.Fragment>{v}</React.Fragment> : <React.Fragment>{acc} <em>{separator || "+"}</em> {v}</React.Fragment>;
      }, null)}
    </strong>;
  }
}
