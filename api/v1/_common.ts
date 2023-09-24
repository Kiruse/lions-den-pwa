export type InData<T> = { data: T };

//#region Standard Types
/** u64 timestamp since 1970 in nanoseconds */
export type CWTimestamp = string;
export const fromCWTimestamp = (ts: CWTimestamp) => new Date(Number(BigInt(ts) / 1000000n));
export const toCWTimestamp = (date: Date): CWTimestamp => (BigInt(date.getTime()) * 1000000n).toString();

// see https://docs.rs/cw-utils/latest/src/cw_utils/expiration.rs.html#12-19
export type CWExpiration =
  | {
      // u64 block height
      at_height: string;
    }
  | {
      at_time: CWTimestamp;
    }
  | { never: {} }
export type Expiration =
  | {
      at_height: bigint;
    }
  | {
      at_time: Date;
    }
  | { never: {} }

export function fromCWExpiration(exp: CWExpiration): Expiration {
  if ('at_height' in exp) {
    return { at_height: BigInt(exp.at_height) };
  } else if ('at_time' in exp) {
    return { at_time: fromCWTimestamp(exp.at_time) };
  } else {
    return { never: {} };
  }
}
export function toCWExpiration(exp: Expiration): CWExpiration {
  if ('at_height' in exp) {
    return { at_height: exp.at_height.toString() };
  } else if ('at_time' in exp) {
    return { at_time: toCWTimestamp(exp.at_time) };
  } else {
    return { never: {} };
  }
}
//#endregion Standard Types

//#region Proposals
export type Proposal = {
  id: number;
  type: ProposalType;
  proposer: string;
  title: string;
  description: string;
  status: ProposalStatus;
  startedAt: Date;
  expires: Expiration;
  results: VoteResult;
  totalVotes: bigint;
}

export function fromProposalQueryResponse(res: ProposalQueryResponse): Proposal {
  const expires = fromCWExpiration(res.proposal.expires);
  const results = Object.fromEntries(res.results.map(([type, count]) => [type, BigInt(count)]));
  const _prop = res.proposal;
  return {
    id: _prop.id,
    type: _prop.proposal_type,
    proposer: _prop.proposer,
    title: _prop.title,
    description: _prop.description,
    status: _prop.status,
    startedAt: fromCWTimestamp(_prop.started_at),
    expires,
    results,
    totalVotes: BigInt(res.total_votes_available),
  };
}

export type ProposalsQueryResponse = {
  proposals: ProposalQueryResponse[];
}
export type ProposalQueryResponse = {
  proposal: {
    proposal_type: ProposalType;
    id: number;
    /** Address of the proposer. */
    proposer: string;
    title: string;
    description: string;
    status: ProposalStatus;
    started_at: CWTimestamp;
    expires: CWExpiration;
  };
  proposal_status: ProposalStatus;
  results: CWVoteResult[];
  // u128 total vote count. for token DAOs, this is the raw count w/o decimals
  total_votes_available: number;
}

// see https://github.com/terra-money/enterprise-contracts/blob/6d736c0bbc1a6ac52d862c8b80d63be6bb43d419/packages/enterprise-protocol/src/api.rs#L530
export type ProposalType = 'general' | 'council';

// see https://github.com/terra-money/enterprise-contracts/blob/6d736c0bbc1a6ac52d862c8b80d63be6bb43d419/packages/enterprise-protocol/src/api.rs#L470
export type ProposalStatus = 'in_progress' | 'passed' | 'executed' | 'rejected';

export enum VoteResultType {
  Yes = 0,
  No = 1,
  Abstain = 2,
  Veto = 3,
}
/** 2-tuples of vote result types & u128 counts */
export type CWVoteResult = [VoteResultType, string];
export type VoteResult = Partial<Record<VoteResultType, bigint>>;
//#endregion Proposals
