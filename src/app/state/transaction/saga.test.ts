import { OasisTransaction, signerFromPrivateKey } from 'app/lib/transaction'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { EffectProviders, StaticProvider } from 'redux-saga-test-plan/providers'
import { DeepPartialRootState } from 'types/RootState'
import { WalletErrors } from 'types/errors'

import { transactionActions as actions } from '.'
import { selectAddress, selectActiveWallet } from '../wallet/selectors'
import { Wallet, WalletType } from '../wallet/types'
import { doTransaction } from './saga'

const makeState = (wallet: Partial<Wallet>): DeepPartialRootState => {
  return {
    wallet: {
      wallets: { [wallet.address!]: wallet },
      selectedWallet: wallet.address,
      isOpen: true,
    },
  }
}

describe('Transaction Sagas', () => {
  const validPrivateKeyHex =
    '5f48e5a6fb243f5abc13aac7c56449afbc93be90ae38f10a0465bc82db954f17e75624c8d2cd9f062ce0331373a3be50ef0eccc5d257b4e2dea83a05506c7132'
  const matchingAddress = 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'
  const validAddress = 'oasis1qqty93azxp4qeft3krvv23ljyj57g3tzk56tqhqe'

  const badKeyWallet = {
    balance: { available: '100000000000' },
    privateKey: '00',
    address: 'oasis1aa',
    type: WalletType.PrivateKey,
  } as Partial<Wallet>

  const validKeyWallet = {
    balance: { available: '100000000000' },
    privateKey: validPrivateKeyHex,
    address: matchingAddress,
    type: WalletType.PrivateKey,
  } as Partial<Wallet>

  const sendProviders: (EffectProviders | StaticProvider)[] = [
    [matchers.call.fn(signerFromPrivateKey), {}],
    [
      matchers.call.fn(OasisTransaction.buildTransfer),
      { transaction: { fee: { amount: new Uint8Array(0), gas: BigInt(0) } } },
    ],
    [matchers.call.fn(OasisTransaction.sign), {}],
    [matchers.call.fn(OasisTransaction.submit), {}],
  ]

  const providers: (EffectProviders | StaticProvider)[] = [
    [
      matchers.select.selector(selectActiveWallet),
      { privateKey: validPrivateKeyHex, balance: { available: '500000000000' }, type: WalletType.PrivateKey },
    ],
    [matchers.select.selector(selectAddress), matchingAddress],
  ]

  describe('Send transaction', () => {
    it('Should send transactions from a mnemonic', () => {
      const wallet = badKeyWallet

      return expectSaga(
        doTransaction,
        actions.sendTransaction({ type: 'transfer', amount: '10000000000', to: validAddress }),
      )
        .withState(makeState(wallet))
        .provide(providers)
        .provide(sendProviders)
        .dispatch(actions.sendTransaction({ type: 'transfer', amount: '123000000000', to: 'testaddress' }))
        .dispatch(actions.confirmTransaction())
        .put.actionType(actions.transactionSent.type)
        .run()
    })

    it('Should send transactions from a private key', () => {
      const wallet = badKeyWallet

      return expectSaga(
        doTransaction,
        actions.sendTransaction({ type: 'transfer', amount: '10000000000', to: validAddress }),
      )
        .withState(makeState(wallet))
        .provide(providers)
        .provide(sendProviders)
        .dispatch(actions.sendTransaction({ type: 'transfer', amount: '123000000000', to: 'testaddress' }))
        .dispatch(actions.confirmTransaction())
        .put.actionType(actions.transactionSent.type)
        .run()
    })

    it('Should allow aborting transactions', () => {
      const wallet = badKeyWallet

      return expectSaga(
        doTransaction,
        actions.sendTransaction({ type: 'transfer', amount: '10000000000', to: validAddress }),
      )
        .withState(makeState(wallet))
        .provide(providers)
        .provide(sendProviders)
        .dispatch(actions.sendTransaction({ type: 'transfer', amount: '123000000000', to: 'testaddress' }))
        .dispatch(actions.abortTransaction())
        .not.put.actionType(actions.transactionSent.type)
        .put.actionType(actions.clearTransaction.type)
        .run()
    })

    it('Should error without sufficient balance', () => {
      const wallet = validKeyWallet

      return expectSaga(
        doTransaction,
        actions.sendTransaction({ type: 'transfer', amount: '200000000000', to: validAddress }),
      )
        .withState(makeState(wallet))
        .put(
          actions.transactionFailed({
            code: WalletErrors.InsufficientBalance,
            message: 'Insufficient balance',
          }),
        )
        .run()
    })

    it('Should error with invalid private key', () => {
      const wallet = badKeyWallet

      return expectSaga(
        doTransaction,
        actions.sendTransaction({ type: 'transfer', amount: '10000000000', to: validAddress }),
      )
        .withState(makeState(wallet))
        .put(
          actions.transactionFailed({
            code: WalletErrors.UnknownError,
            message: 'bad secret key size',
          }),
        )
        .run()
    })

    it('Should error when sending to an invalid address', () => {
      const wallet = validKeyWallet

      return expectSaga(
        doTransaction,
        actions.sendTransaction({ type: 'transfer', amount: '10000000000', to: 'oasis1notvalid' }),
      )
        .withState(makeState(wallet))
        .put(
          actions.transactionFailed({
            code: WalletErrors.InvalidAddress,
            message: 'Invalid address',
          }),
        )
        .run()
    })

    it('Should error when trying to send to self', () => {
      const wallet = validKeyWallet

      return expectSaga(
        doTransaction,
        actions.sendTransaction({ type: 'transfer', amount: '10000000000', to: matchingAddress }),
      )
        .withState(makeState(wallet))
        .put(
          actions.transactionFailed({
            code: WalletErrors.CannotSendToSelf,
            message: 'Cannot send to your own account',
          }),
        )
        .run()
    })
  })
})
