import { expect } from 'chai';
import { viem } from 'hardhat';
import { getAddress, keccak256, stringToBytes, PublicClient, decodeEventLog, TransactionReceipt } from 'viem';

import {
  SECONDS_IN_DAY,
  User,
  ZERO_ADDRESS,
  challengeHelper,
  deployRegistry,
  deployRegistryFactory,
  fastForwardToTimestamp,
  getChallengeParse,
  getContractEventsFromHash,
  getTimestamp,
  personCidHelper,
  registryFrom,
  shouldFail,
  voteHelper,
  vouchHelper,
} from './support';
import { deriveEntity } from '@app/utils/cid-hash';
import { Entity, HexStr, PAP, PersonDetails } from '@app/types';
import { EventType, Registry, RegistryCreatedEvent, RegistryFactory, Signer, TransferEventType, VouchEventType } from './viem.types';

const WRONG_TOKEN_ID = 9999999999n;
const FOUNDERS_VOUCHER = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;

describe('Registry', () => {
  let client: PublicClient;
  let registry: Registry;
  let factory: RegistryFactory;
  let counter = 0;
  let deployTxHash: string;

  let deployer: Signer;

  let f0: User;
  let f1: User;
  let f2: User;
  let f3: User;
  const N0 = 4n;

  let v11: User;
  let v12: User;
  let v13: User;
  const N1 = 3n;

  let v111: User;
  let v112: User;
  let v113: User;
  const N11 = 3n;

  let v1131: User;
  let v1132: User;
  const N113 = 2n;

  let v31: User;
  let v32: User;
  let v33: User;
  let v34: User;
  let v35: User;
  const N4 = 5n;

  let c1: User;

  let founders: User[];

  let NCUM: bigint;

  before(async () => {
    client = await viem.getPublicClient();
    let signers = await viem.getWalletClients();
    deployer = signers[signers.length - 1];

    [f0, f1, f2, f3, v11, v12, v13, v111, v112, v113, v1131, v1132, c1, v31, v32, v33, v34, v35] = await Promise.all(
      signers.map(async (s: Signer, ix: number): Promise<{ s: Signer; tokenId: bigint; person: Entity<PAP> }> => {
        const pap: PAP = { person: { personal: { firstName: `personOfSigner${ix}` } }, account: s.account.address };
        const personEntity = await deriveEntity(pap);
        s.account.address = getAddress(s.account.address);
        return { s, tokenId: WRONG_TOKEN_ID, person: personEntity };
      })
    );

    /** */
    const master = await deployRegistry(deployer);
    factory = await deployRegistryFactory(master.address, deployer);
  });

  it('was deployed with founders', async () => {
    founders = [f0, f1, f2, f3];

    const addresses = founders.map((f) => (f.person && f.person.object.account) as HexStr);
    const personCids = founders.map((f) => (f.person && f.person.cid) as string);

    const hash = await factory.write.create(['ABC', 'Test Community', addresses, personCids, keccak256(stringToBytes(counter.toString()))]);
    const factoryEvents = await getContractEventsFromHash('RegistryFactory', hash);

    const createdEvent = factoryEvents?.find((e) => e.eventName === 'RegistryCreated') as RegistryCreatedEvent;
    expect(createdEvent).to.exist;
    if (!createdEvent || !createdEvent.args) throw new Error('Event not found');
    const address = createdEvent?.args.newRegistry;

    const regitryEvents = await getContractEventsFromHash('Registry', hash);

    const vouchEvents = regitryEvents.filter((e) => e.eventName === 'VouchEvent') as VouchEventType[];
    const transferEvents = regitryEvents.filter((e) => e.eventName === 'Transfer') as TransferEventType[];

    expect(vouchEvents).to.have.length(Number(N0));
    expect(transferEvents).to.have.length(Number(N0));

    transferEvents.forEach((e, ix) => {
      const tokenId = BigInt(ix) + 1n;
      expect(e.args.from).to.eq(ZERO_ADDRESS);
      expect(e.args.to).to.eq(founders[ix].s.account.address);
      expect(e.args.tokenId).to.eq(tokenId);
    });

    f0.tokenId = transferEvents.find((e) => e.args.to === f0.s.account.address)?.args.tokenId as bigint;
    f1.tokenId = transferEvents.find((e) => e.args.to === f1.s.account.address)?.args.tokenId as bigint;
    f2.tokenId = transferEvents.find((e) => e.args.to === f2.s.account.address)?.args.tokenId as bigint;
    f3.tokenId = transferEvents.find((e) => e.args.to === f3.s.account.address)?.args.tokenId as bigint;

    vouchEvents.forEach((e, ix) => {
      const tokenId = BigInt(ix) + 1n;
      expect(e.args.from).to.eq(FOUNDERS_VOUCHER);
      expect(e.args.to).to.eq(tokenId);
      expect(e.args.personCid).to.eq(founders[ix].person?.cid);
    });

    registry = await registryFrom(address, deployer);

    expect(await registry.read.VOTING_PERIOD()).to.eq(BigInt(15 * SECONDS_IN_DAY));
    expect(await registry.read.PENDING_PERIOD()).to.eq(BigInt(180 * SECONDS_IN_DAY));

    expect(await registry.read.balanceOf([f0.s.account.address])).to.eq(1n);
    expect(await registry.read.balanceOf([f1.s.account.address])).to.eq(1n);
    expect(await registry.read.balanceOf([f2.s.account.address])).to.eq(1n);
    expect(await registry.read.balanceOf([f3.s.account.address])).to.eq(1n);

    expect(await registry.read.balanceOf([deployer.account.address])).to.eq(0n);

    expect(await registry.read.ownerOf([f0.tokenId])).to.eq(f0.s.account.address);
    expect(await registry.read.ownerOf([f1.tokenId])).to.eq(f1.s.account.address);
    expect(await registry.read.ownerOf([f2.tokenId])).to.eq(f2.s.account.address);
    expect(await registry.read.ownerOf([f3.tokenId])).to.eq(f3.s.account.address);

    await Promise.all(
      [f0, f1, f2, f3].map(async (f) => {
        const account = await registry.read.getAccount([f0.tokenId]);
        expect(account.account).to.eq(f0.s.account.address);
        expect(account.voucher).to.eq(FOUNDERS_VOUCHER);
        expect(account.valid).to.be.true;
        expect(account.timesChallenged).to.eq(0n);
      })
    );

    expect(await personCidHelper(registry, f0.tokenId)).to.eq(founders[0].person?.cid);
    expect(await personCidHelper(registry, f1.tokenId)).to.eq(founders[1].person?.cid);
    expect(await personCidHelper(registry, f2.tokenId)).to.eq(founders[2].person?.cid);
    expect(await personCidHelper(registry, f3.tokenId)).to.eq(founders[3].person?.cid);

    expect(await registry.read.getVoucherVouchesNumber([FOUNDERS_VOUCHER])).eq(N0);
    expect(await registry.read.getTotalVoters([f0.tokenId])).eq(N0 - 1n);
    expect(await registry.read.totalSupply()).eq(N0);

    expect(await registry.read.canVote([0n, f0.tokenId])).to.be.false;
    expect(await registry.read.canVote([FOUNDERS_VOUCHER, f0.tokenId])).to.be.true;
    expect(await registry.read.canVote([f0.tokenId, f0.tokenId])).to.be.false;
    expect(await registry.read.canVote([f1.tokenId, f0.tokenId])).to.be.true;
    expect(await registry.read.canVote([f2.tokenId, f0.tokenId])).to.be.true;
    expect(await registry.read.canVote([f3.tokenId, f0.tokenId])).to.be.true;
    expect(await registry.read.canVote([v11.tokenId, f0.tokenId])).to.be.false;

    expect(await registry.read.isSolidified([0n])).to.be.false;
    expect(await registry.read.isSolidified([f0.tokenId])).to.be.false;
    expect(await registry.read.isSolidified([f1.tokenId])).to.be.false;
    expect(await registry.read.isSolidified([f2.tokenId])).to.be.false;
    expect(await registry.read.isSolidified([f3.tokenId])).to.be.false;
    expect(await registry.read.isSolidified([v11.tokenId])).to.be.false;
  });

  describe('Founders', () => {
    it('non vouched cant vouch', async () => {
      expect(await registry.read.balanceOf([v11.s.account.address])).to.eq(0n);

      await shouldFail(async () => {
        await vouchHelper(registry.address, v11, v111);
      }, 'ErrorVoucherNotValid()');

      expect(await registry.read.balanceOf([f0.s.account.address])).to.eq(1n);
      expect(await registry.read.balanceOf([v111.s.account.address])).to.eq(0n);
      expect(await registry.read.balanceOf([f3.s.account.address])).to.eq(1n);

      expect(await registry.read.getTotalVoters([v111.tokenId])).eq(0n);

      expect(await registry.read.getVoucherVouchesNumber([FOUNDERS_VOUCHER])).eq(N0);
      expect(await registry.read.getTotalVoters([f0.tokenId])).eq(N0 - 1n);

      expect(await registry.read.totalSupply()).eq(N0);

      expect(await registry.read.canVote([0n, f0.tokenId])).to.be.false;
      expect(await registry.read.canVote([f0.tokenId, f0.tokenId])).to.be.false;
      expect(await registry.read.canVote([f1.tokenId, f0.tokenId])).to.be.true;
      expect(await registry.read.canVote([f2.tokenId, f0.tokenId])).to.be.true;
      expect(await registry.read.canVote([f3.tokenId, f0.tokenId])).to.be.true;
      expect(await registry.read.canVote([v11.tokenId, f0.tokenId])).to.be.false;

      expect(await registry.read.isSolidified([FOUNDERS_VOUCHER])).to.be.false;
      expect(await registry.read.isSolidified([0n])).to.be.false;
      expect(await registry.read.isSolidified([f0.tokenId])).to.be.false;
      expect(await registry.read.isSolidified([f1.tokenId])).to.be.false;
      expect(await registry.read.isSolidified([f2.tokenId])).to.be.false;
      expect(await registry.read.isSolidified([f3.tokenId])).to.be.false;
      expect(await registry.read.isSolidified([v11.tokenId])).to.be.false;
    });

    it('founder can vouch', async () => {
      const { vouchEvent, transferEvent } = await vouchHelper(registry.address, f0, v11);
      expect(vouchEvent).to.exist;
      expect(transferEvent).to.exist;

      expect(await registry.read.balanceOf([f0.s.account.address])).to.eq(1n);
      expect(await registry.read.balanceOf([v11.s.account.address])).to.eq(1n);
      expect(await registry.read.balanceOf([v111.s.account.address])).to.eq(0n);
      expect(await registry.read.balanceOf([f3.s.account.address])).to.eq(1n);

      expect(await registry.read.tokenIdOf([v11.s.account.address])).to.eq(v11.tokenId);

      expect(await registry.read.getVoucherVouchesNumber([f0.tokenId])).eq(1n);
      expect(await registry.read.getTotalVoters([v11.tokenId])).eq(1n);

      expect(await registry.read.getVoucherVouchesNumber([FOUNDERS_VOUCHER])).eq(N0);
      expect(await registry.read.getTotalVoters([f0.tokenId])).eq(N0 - 1n);

      expect(await registry.read.totalSupply()).eq(N0 + 1n);

      expect(await registry.read.canVote([0n, f0.tokenId])).to.be.false;
      expect(await registry.read.canVote([f0.tokenId, f0.tokenId])).to.be.false;
      expect(await registry.read.canVote([f1.tokenId, f0.tokenId])).to.be.true;
      expect(await registry.read.canVote([f2.tokenId, f0.tokenId])).to.be.true;
      expect(await registry.read.canVote([f3.tokenId, f0.tokenId])).to.be.true;
      expect(await registry.read.canVote([v11.tokenId, f0.tokenId])).to.be.false;
      expect(await registry.read.canVote([v111.tokenId, f0.tokenId])).to.be.false;

      expect(await registry.read.canVote([f0.tokenId, v11.tokenId])).to.be.true;
      expect(await registry.read.canVote([v11.tokenId, v11.tokenId])).to.be.false;
      expect(await registry.read.canVote([v12.tokenId, v11.tokenId])).to.be.false;
      expect(await registry.read.canVote([v111.tokenId, v11.tokenId])).to.be.false;

      expect(await registry.read.isSolidified([0n])).to.be.false;
      expect(await registry.read.isSolidified([f0.tokenId])).to.be.false;
      expect(await registry.read.isSolidified([f1.tokenId])).to.be.false;
      expect(await registry.read.isSolidified([f2.tokenId])).to.be.false;
      expect(await registry.read.isSolidified([f3.tokenId])).to.be.false;
      expect(await registry.read.isSolidified([v11.tokenId])).to.be.false;

      await vouchHelper(registry.address, f0, v12);

      await vouchHelper(registry.address, f0, v13);

      expect(await registry.read.balanceOf([v11.s.account.address])).to.eq(1n);
      expect(await registry.read.balanceOf([v12.s.account.address])).to.eq(1n);
      expect(await registry.read.balanceOf([v13.s.account.address])).to.eq(1n);

      expect(await registry.read.getVoucherVouchesNumber([f0.tokenId])).eq(N1);
      expect(await registry.read.getTotalVoters([v11.tokenId])).eq(N1);
    });

    describe('After founder vouched', () => {
      it('vouched can vouch', async () => {
        const event = await vouchHelper(registry.address, v11, v111);

        expect(event).to.exist;

        expect(await registry.read.balanceOf([f0.s.account.address])).to.eq(1n);
        expect(await registry.read.balanceOf([v11.s.account.address])).to.eq(1n);
        expect(await registry.read.balanceOf([v111.s.account.address])).to.eq(1n);
        expect(await registry.read.balanceOf([v112.s.account.address])).to.eq(0n);
        expect(await registry.read.balanceOf([v113.s.account.address])).to.eq(0n);
        expect(await registry.read.balanceOf([f3.s.account.address])).to.eq(1n);

        expect(await registry.read.getVoucherVouchesNumber([v11.tokenId])).eq(1n);
        expect(await registry.read.getTotalVoters([v111.tokenId])).eq(1n);

        expect(await registry.read.getVoucherVouchesNumber([FOUNDERS_VOUCHER])).eq(N0);
        expect(await registry.read.getTotalVoters([v11.tokenId])).eq(N0 - 1n);

        expect(await registry.read.totalSupply()).eq(N0 + N1 + 1n);

        expect(await registry.read.canVote([f0.tokenId, f0.tokenId])).to.be.false;
        expect(await registry.read.canVote([f1.tokenId, f0.tokenId])).to.be.true;
        expect(await registry.read.canVote([f2.tokenId, f0.tokenId])).to.be.true;
        expect(await registry.read.canVote([f3.tokenId, f0.tokenId])).to.be.true;
        expect(await registry.read.canVote([v11.tokenId, f0.tokenId])).to.be.false;
        expect(await registry.read.canVote([v111.tokenId, f0.tokenId])).to.be.false;

        expect(await registry.read.canVote([f1.tokenId, v11.tokenId])).to.be.false;
        expect(await registry.read.canVote([f0.tokenId, v11.tokenId])).to.be.true;
        expect(await registry.read.canVote([v12.tokenId, v11.tokenId])).to.be.true;
        expect(await registry.read.canVote([v111.tokenId, v11.tokenId])).to.be.false;

        expect(await registry.read.canVote([f0.tokenId, v111.tokenId])).to.be.false;
        expect(await registry.read.canVote([v11.tokenId, v111.tokenId])).to.be.true;
        expect(await registry.read.canVote([v111.tokenId, v111.tokenId])).to.be.false;

        expect(await registry.read.isSolidified([0n])).to.be.false;
        expect(await registry.read.isSolidified([f0.tokenId])).to.be.false;
        expect(await registry.read.isSolidified([f1.tokenId])).to.be.false;
        expect(await registry.read.isSolidified([f2.tokenId])).to.be.false;
        expect(await registry.read.isSolidified([f3.tokenId])).to.be.false;
        expect(await registry.read.isSolidified([v11.tokenId])).to.be.false;
      });

      it('vouched can vouch again', async () => {
        await vouchHelper(registry.address, v11, v112);

        expect(await registry.read.totalSupply()).to.eq(N0 + N1 + 2n);
        expect(await registry.read.getVoucherVouchesNumber([v11.tokenId])).to.eq(2n);
        expect(await registry.read.getTotalVoters([v112.tokenId])).to.eq(2n);

        await vouchHelper(registry.address, v11, v113);

        expect(await registry.read.totalSupply()).to.eq(N0 + N1 + N11);
        expect(await registry.read.getVoucherVouchesNumber([v11.tokenId])).to.eq(3n);
        expect(await registry.read.getTotalVoters([v112.tokenId])).to.eq(3n);

        expect(await registry.read.balanceOf([f0.s.account.address])).to.eq(1n);
        expect(await registry.read.balanceOf([v11.s.account.address])).to.eq(1n);
        expect(await registry.read.balanceOf([v111.s.account.address])).to.eq(1n);
        expect(await registry.read.balanceOf([v112.s.account.address])).to.eq(1n);
        expect(await registry.read.balanceOf([v113.s.account.address])).to.eq(1n);
        expect(await registry.read.balanceOf([f3.s.account.address])).to.eq(1n);
      });

      it('voched by vouched can vouch (3rd level now)', async () => {
        await vouchHelper(registry.address, v113, v1131);

        expect(await registry.read.totalSupply()).eq(N0 + N1 + N11 + 1n);
        expect(await registry.read.getVoucherVouchesNumber([v113.tokenId])).eq(1n);
        expect(await registry.read.getTotalVoters([v1131.tokenId])).eq(1n);

        await vouchHelper(registry.address, v113, v1132);

        expect(await registry.read.totalSupply()).eq(N0 + N1 + N11 + N113);
        expect(await registry.read.getVoucherVouchesNumber([v113.tokenId])).eq(2n);
        expect(await registry.read.getTotalVoters([v1131.tokenId])).eq(N113);

        expect(await registry.read.balanceOf([f0.s.account.address])).to.eq(1n);
        expect(await registry.read.balanceOf([v11.s.account.address])).to.eq(1n);
        expect(await registry.read.balanceOf([v111.s.account.address])).to.eq(1n);
        expect(await registry.read.balanceOf([v112.s.account.address])).to.eq(1n);
        expect(await registry.read.balanceOf([v113.s.account.address])).to.eq(1n);
        expect(await registry.read.balanceOf([f3.s.account.address])).to.eq(1n);
      });

      describe('Challenging', () => {
        it('cant challenge invalid account', async () => {
          /** just in case check challenging an invalid account */
          await shouldFail(async () => {
            await challengeHelper(registry.address, c1, v32.tokenId);
          }, 'CantChallengeInvalidAccount()');
        });

        it('can challenge valid account', async () => {
          const event = await challengeHelper(registry.address, c1, v11.tokenId);
          const { creationDate, nVoted, nFor } = getChallengeParse(await registry.read.getChallenge([v11.tokenId]));

          expect(event).to.exist;
          expect(creationDate > 0n).to.be.true;
          expect(nFor).to.eq(0n);
          expect(nVoted).to.eq(0n);

          expect(await registry.read.getTotalVoters([v11.tokenId])).to.eq(N1);
        });

        it('other founders not the voucher of v11 cant vote', async () => {
          await shouldFail(async () => {
            await voteHelper(registry.address, f2, v11.tokenId, 1);
          }, 'ErrorVoterCantVote()');
        });

        it('challenged user cant vote', async () => {
          await shouldFail(async () => {
            await voteHelper(registry.address, v11, v11.tokenId, 1);
          }, 'ErrorVoterCantVote()');
        });

        it('founder 1 can vote', async () => {
          expect(await registry.read.totalSupply()).eq(N0 + N1 + N11 + N113);
          expect(await registry.read.getTotalVoters([v11.tokenId])).to.eq(N1);

          /** founder 0 vote (33%) */
          const voteEvent = await voteHelper(registry.address, f0, v11.tokenId, 1);
          const { creationDate, nVoted, nFor } = getChallengeParse(await registry.read.getChallenge([v11.tokenId]));

          expect(voteEvent).to.exist;
          expect(creationDate > 0).to.be.true;
          expect(nFor).to.eq(1n);
          expect(nVoted).to.eq(1n);

          /** v11 should still be valid */
          expect(await registry.read.totalSupply()).eq(N0 + N1 + N11 + N113);
          expect(await registry.read.balanceOf([v11.s.account.address])).eq(1n);
        });

        it('derived from v11 cant be invalidated just yet', async () => {
          shouldFail(async () => {
            await registry.write.invalidateInvalidVoucher([v111.tokenId]);
          }, 'ErrorVoucherIsValid()');
        });

        it('v12 can vote and settle challenge', async () => {
          expect(await registry.read.totalSupply()).eq(N0 + N1 + N11 + N113);
          expect(await registry.read.getTotalVoters([v11.tokenId])).to.eq(N1);

          /** v12 vote (66%) */
          const { voteEvent, invalidatedByChallengeEvent, invalidatedAccountEvent } = await voteHelper(registry.address, v12, v11.tokenId, 1);
          const [_creationDate, _endDate, _lastOutcome, nVoted, nFor, _executed] = await registry.read.getSpecificChallenge([v11.tokenId, 0n]);

          expect(voteEvent).to.exist;
          expect(nFor).to.eq(2n);
          expect(nVoted).to.eq(2n);

          expect(voteEvent).to.exist;
          expect(invalidatedByChallengeEvent).to.exist;
          expect(invalidatedAccountEvent).to.exist;

          expect(await registry.read.totalSupply()).eq(N0 + N1 + N11 + N113 - 1n);
          expect(await registry.read.balanceOf([v11.s.account.address])).eq(0n);
        });

        it('all those derived from v11 can be invalidated', async () => {
          expect(await registry.read.totalSupply()).eq(N0 + N1 + N11 + N113 - 1n);

          for (const account of [v111, v112, v113, v1131, v1132]) {
            const tx1 = await registry.write.invalidateInvalidVoucher([account.tokenId]);
            const events = await getContractEventsFromHash('Registry', tx1);

            const InvalidatedByInvalidVoucherEvent = events.find((e: EventType) => e.eventName === 'InvalidatedByInvalidVoucher');
            const InvalidatedAccountEvent = events.find((e: EventType) => e.eventName === 'InvalidatedAccountEvent');

            expect(InvalidatedByInvalidVoucherEvent).to.exist;
            expect(InvalidatedAccountEvent).to.exist;
            expect(await registry.read.balanceOf([account.s.account.address])).to.eq(0n);
          }

          expect(await registry.read.totalSupply()).eq(N0 + N1 - 1n);
        });
      });
    });

    describe('Revouch', async () => {
      it('can revouch', async () => {
        expect(await registry.read.totalSupply()).eq(N0 + N1 - 1n);

        for (const vouchPair of [
          [f0, v11],
          [v11, v111],
          [v11, v112],
          [v11, v113],
          [v113, v1131],
          [v113, v1132],
        ]) {
          const voucher = vouchPair[0];
          const vouched = vouchPair[1];

          await vouchHelper(registry.address, voucher, vouched);
          expect(await registry.read.balanceOf([vouched.s.account.address])).to.eq(1n);
        }

        NCUM = N0 + N1 + N11 + N113;
        expect(await registry.read.totalSupply()).eq(NCUM);
      });
    });

    describe('New vouches', async () => {
      it('new vouches', async () => {
        expect(await registry.read.totalSupply()).eq(NCUM);

        for (const vouchPair of [
          [f3, v31],
          [f3, v32],
          [f3, v33],
          [f3, v34],
          [f3, v35],
        ]) {
          const voucher = vouchPair[0];
          const vouched = vouchPair[1];

          const event = await vouchHelper(registry.address, voucher, vouched);

          expect(event).to.exist;
          expect(await registry.read.balanceOf([vouched.s.account.address])).to.eq(1n);
        }

        expect(await registry.read.totalSupply()).eq(NCUM + N4);
        NCUM = NCUM + N4;
      });
    });

    describe('Challenge outside of voting period', () => {
      before(async () => {
        const event = await challengeHelper(registry.address, c1, v31.tokenId);

        expect(event).to.exist;
      });

      it('is still valid', async () => {
        expect(await registry.read.balanceOf([v31.s.account.address])).to.eq(1n);
      });

      it('challenge fails if no one vote', async () => {
        const last = await getTimestamp();
        await fastForwardToTimestamp(last + BigInt(15 * SECONDS_IN_DAY + 1));

        /** cant vote anymore */
        await shouldFail(async () => {
          await voteHelper(registry.address, f3, v31.tokenId, 1);
        }, 'ErrorVotingPeriodEnded()');

        expect(await registry.read.balanceOf([v31.s.account.address])).to.eq(1n);

        const tx = await registry.write.executeVote([v31.tokenId]);

        expect(await registry.read.balanceOf([v31.s.account.address])).to.eq(1n);
      });

      it('can re-challenge unsucessful challenge', async () => {
        expect(await registry.read.totalSupply()).eq(NCUM);
        const event = await challengeHelper(registry.address, c1, v31.tokenId);

        expect(event).to.exist;
        expect(await registry.read.getTotalVoters([v31.tokenId])).to.eq(N4);

        /** previous challenge data */

        const account = await registry.read.getAccount([v31.tokenId]);

        expect(account.account).to.eq(v31.s.account.address);
        expect(account.voucher).to.eq(f3.tokenId);
        expect(account.valid).to.be.true;
        expect(account.timesChallenged).to.eq(1n);

        expect(await registry.read.getChallengeVote([v31.tokenId, v32.tokenId])).to.eq(0);

        const { creationDate, nVoted, nFor } = getChallengeParse(await registry.read.getChallenge([v31.tokenId]));
        expect(nFor).to.eq(0n);
        expect(nVoted).to.eq(0n);
      });

      it('challenge passes with relative majority', async () => {
        expect(await registry.read.totalSupply()).eq(NCUM);
        const event = await challengeHelper(registry.address, c1, v32.tokenId);

        expect(event).to.exist;
        expect(await registry.read.getTotalVoters([v31.tokenId])).to.eq(N4);

        const { voteEvent, invalidatedAccountEvent, challengeExecuted } = await voteHelper(registry.address, v33, v32.tokenId, 1);
        expect(voteEvent).to.exist;
        expect(invalidatedAccountEvent).to.not.exist;
        expect(challengeExecuted).to.not.exist;
        expect(await registry.read.totalSupply()).eq(NCUM);

        /** only 1 of 4 votes */
        const [creationDate, _endDate, _lastOutcome, nVoted, nFor, _executed] = await registry.read.getChallenge([v32.tokenId]);
        expect(nFor).to.eq(1n);
        expect(nVoted).to.eq(1n);

        /** nothing happens if execute vote */
        expect(await registry.read.balanceOf([v32.s.account.address])).to.eq(1n);

        const tx = await registry.write.executeVote([v32.tokenId]);
        await client.waitForTransactionReceipt({ hash: tx });

        expect(await registry.read.balanceOf([v32.s.account.address])).to.eq(1n);

        /** fastForwardToTimestamp */
        await fastForwardToTimestamp(creationDate + BigInt(15 * SECONDS_IN_DAY + 1));

        const tx2 = await registry.write.executeVote([v32.tokenId]);
        const events2 = await getContractEventsFromHash('Registry', tx2);

        const invalidatedAccountEvent2 = events2.find((e: EventType) => e.eventName === 'InvalidatedAccountEvent');
        const invalidatedByChallenge2 = events2.find((e: EventType) => e.eventName === 'InvalidatedByChallenge');
        const challengeExecuted2 = events2.find((e: EventType) => e.eventName === 'ChallengeExecuted');

        expect(invalidatedAccountEvent2).to.exist;
        expect(invalidatedByChallenge2).to.exist;
        expect(challengeExecuted2).to.exist;

        expect(await registry.read.balanceOf([v32.s.account.address])).to.eq(0n);
        expect(await registry.read.totalSupply()).eq(NCUM - 1n);

        NCUM = NCUM - 1n;
      });

      it('challenge period extended if outcome swaps just before endDate', async () => {
        /** revouch v32, it gets a different tokenId */
        const { vouchEvent } = await vouchHelper(registry.address, f3, v32);
        expect(vouchEvent).to.exist;

        expect(await registry.read.totalSupply()).eq(NCUM + 1n);
        NCUM = NCUM + 1n;

        const event = await challengeHelper(registry.address, c1, v32.tokenId);
        const details0 = getChallengeParse(await registry.read.getChallenge([v32.tokenId]));
        expect(details0.nFor).to.eq(0n);
        expect(details0.nVoted).to.eq(0n);
        expect(details0.endDate).to.eq(details0.creationDate + BigInt(15 * SECONDS_IN_DAY));
        expect(details0.lastOutcome).to.eq(-1);

        expect(event).to.exist;
        expect(await registry.read.getTotalVoters([v31.tokenId])).to.eq(N4);

        const voteRes1 = await voteHelper(registry.address, f3, v32.tokenId, -1);
        expect(voteRes1.voteEvent).to.exist;
        expect(voteRes1.invalidatedAccountEvent).to.not.exist;
        expect(await registry.read.totalSupply()).eq(NCUM);

        /** only 1 of 4 votes */
        const details1 = getChallengeParse(await registry.read.getChallenge([v32.tokenId]));
        expect(details1.nFor).to.eq(0n);
        expect(details1.nVoted).to.eq(1n);
        expect(details1.endDate).to.eq(details1.creationDate + BigInt(15 * SECONDS_IN_DAY));
        expect(details1.lastOutcome).to.eq(-1);

        /** nothing happens if execute vote */
        expect(await registry.read.balanceOf([v32.s.account.address])).to.eq(1n);

        const tx = await registry.write.executeVote([v32.tokenId]);
        await client.waitForTransactionReceipt({ hash: tx });

        expect(await registry.read.balanceOf([v32.s.account.address])).to.eq(1n);

        /** fastForward to 1 day before endDate */
        await fastForwardToTimestamp(details1.endDate - BigInt(1 * SECONDS_IN_DAY));

        const voteRes2 = await voteHelper(registry.address, v31, v32.tokenId, 1);

        expect(voteRes2.voteEvent).to.exist;
        expect(voteRes2.invalidatedAccountEvent).to.not.exist;
        expect(voteRes2.votingPeriodExtendedEvent).to.exist;

        const block = await client.getBlock({ blockNumber: voteRes2.receipt.blockNumber });
        const lastVoteDate = block.timestamp;
        const newEndDate = lastVoteDate + BigInt(2 * SECONDS_IN_DAY);

        expect(await registry.read.balanceOf([v32.s.account.address])).to.eq(1n);

        const details3 = getChallengeParse(await registry.read.getChallenge([v32.tokenId]));
        expect(details3.nFor).to.eq(1n);
        expect(details3.nVoted).to.eq(2n);
        expect(details3.endDate).to.eq(newEndDate);

        /** forward time to passed the original endDate */
        await fastForwardToTimestamp(details1.endDate + 1n);

        /** try to execute the vote, but nothing should happen */
        const tx2 = await registry.write.executeVote([v32.tokenId]);
        const events2 = await getContractEventsFromHash('Registry', tx2);

        const invalidatedAccountEvent = events2.find((e: EventType) => e.eventName === 'InvalidatedAccountEvent');
        const invalidatedByChallenge = events2.find((e: EventType) => e.eventName === 'InvalidatedByChallenge');
        const challengeExecuted = events2.find((e: EventType) => e.eventName === 'ChallengeExecuted');

        expect(invalidatedAccountEvent).to.not.exist;
        expect(invalidatedByChallenge).to.not.exist;
        expect(challengeExecuted).to.not.exist;

        expect(await registry.read.balanceOf([v32.s.account.address])).to.eq(1n);
        expect(await registry.read.totalSupply()).eq(NCUM);

        /** fastForward time to passed the new endDate */
        await fastForwardToTimestamp(newEndDate + 1n);

        const tx3 = await registry.write.executeVote([v32.tokenId]);
        const events3 = await getContractEventsFromHash('Registry', tx3);

        const invalidatedAccountEvent2 = events3.find((e: EventType) => e.eventName === 'InvalidatedAccountEvent');
        const invalidatedByChallenge2 = events3.find((e: EventType) => e.eventName === 'InvalidatedByChallenge');
        const challengeExecuted2 = events3.find((e: EventType) => e.eventName === 'ChallengeExecuted');

        expect(invalidatedAccountEvent2).to.exist;
        expect(invalidatedByChallenge2).to.exist;
        expect(challengeExecuted2).to.exist;

        expect(await registry.read.balanceOf([v32.s.account.address])).to.eq(0n);
        expect(await registry.read.totalSupply()).eq(NCUM - 1n);

        NCUM = NCUM - 1n;
      });

      it('cant re-challenge invalid account', async () => {
        await shouldFail(async () => {
          await challengeHelper(registry.address, c1, v32.tokenId);
        }, 'CantChallengeInvalidAccount()');
      });
    });

    describe('Challenge founder', async () => {
      before(async () => {
        const event = await challengeHelper(registry.address, c1, f3.tokenId);
        expect(event).to.exist;

        const { creationDate, nFor, nVoted } = getChallengeParse(await registry.read.getChallenge([f3.tokenId]));

        expect(creationDate > 0n).to.be.true;
        expect(nFor === 0n).to.be.true;
        expect(nVoted === 0n).to.be.true;

        expect(await registry.read.getTotalVoters([v11.tokenId])).to.eq(N0 - 1n);
      });

      it('challenged founder cant vote', async () => {
        await shouldFail(async () => {
          await voteHelper(registry.address, f3, f3.tokenId, 1);
        }, 'ErrorVoterCantVote()');
      });

      it('other founders can vote', async () => {
        expect(await registry.read.totalSupply()).eq(NCUM);
        expect(await registry.read.getTotalVoters([v11.tokenId])).to.eq(N0 - 1n);

        /** founder 0 vote (33%) */
        const { voteEvent: voteEvent1 } = await voteHelper(registry.address, f0, f3.tokenId, 1);
        const { nFor: nFor1, nVoted: nVoted1 } = getChallengeParse(await registry.read.getChallenge([f3.tokenId]));

        expect(voteEvent1).to.exist;
        expect(nFor1).to.eq(1n);
        expect(nVoted1).to.eq(1n);

        /** founder 0 cant vote again */
        await shouldFail(async () => {
          await voteHelper(registry.address, f0, f3.tokenId, 1);
        }, 'ErrorAlreadyVoted()');

        const { nFor: nFor2, nVoted: nVoted2 } = getChallengeParse(await registry.read.getChallenge([f3.tokenId]));
        expect(nFor2).to.eq(1n);
        expect(nVoted2).to.eq(1n);

        /** founder 1 can vote, and reach 66%, the challenge should close */
        const { voteEvent: voteEvent2, invalidatedAccountEvent, invalidatedByChallengeEvent } = await voteHelper(registry.address, f1, f3.tokenId, 1);

        const { nFor: nFor3, nVoted: nVoted3 } = getChallengeParse(await registry.read.getSpecificChallenge([f3.tokenId, 0n]));
        expect(nFor3).to.eq(2n);
        expect(nVoted3).to.eq(2n);

        expect(voteEvent2).to.exist;
        expect(invalidatedAccountEvent).to.exist;
        expect(invalidatedByChallengeEvent).to.exist;

        /** One less entry in the registry */
        expect(await registry.read.totalSupply()).eq(NCUM - 1n);

        /** Founder 4 should not be valid */
        expect(await registry.read.balanceOf([f3.s.account.address])).eq(0n);
      });

      it('invalid founder cant vouch anymore', async () => {
        await shouldFail(async () => {
          await vouchHelper(registry.address, f3, v112);
        }, 'ErrorVoucherNotValid()');
      });
    });
  });
});
