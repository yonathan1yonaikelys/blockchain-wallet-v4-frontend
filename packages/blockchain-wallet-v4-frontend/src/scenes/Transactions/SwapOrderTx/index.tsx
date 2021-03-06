import { bindActionCreators, Dispatch } from 'redux'
import { Button, Text } from 'blockchain-info-components'
import {
  CoinType,
  ProcessedSwapOrderType,
  SupportedWalletCurrenciesType
} from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import {
  Addresses,
  Col,
  DetailsColumn,
  DetailsRow,
  Row,
  RowHeader,
  RowValue,
  StatusAndType,
  StyledCoinDisplay,
  StyledFiatDisplay,
  TxRow,
  TxRowContainer
} from '../components'
import { coinToString, fiatToString } from 'core/exchange/currency'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getDestination, getOrigin, IconTx, Status, Timestamp } from './model'
import { getInput, getOutput } from 'data/components/swap/model'
import { RootState } from 'data/rootReducer'

const LastCol = styled(Col)`
  display: flex;
  justify-content: flex-end;
`
class SwapOrderTx extends PureComponent<Props, State> {
  state: State = { isToggled: false }

  handleToggle = () => {
    this.setState({ isToggled: !this.state.isToggled })
  }

  showModal = (order: ProcessedSwapOrderType) => {
    this.props.modalActions.showModal('SWAP_MODAL', {
      origin: 'TransactionList'
    })
    this.props.swapActions.setStep({
      step: 'ORDER_DETAILS',
      options: {
        order
      }
    })
  }

  render () {
    const { order, coin } = this.props
    const base = getInput(this.props.order)
    const counter = getOutput(this.props.order)
    const { outputMoney } = this.props.order.priceFunnel

    return (
      <TxRowContainer
        className={this.state.isToggled ? 'active' : ''}
        data-e2e='transactionRow'
      >
        <TxRow onClick={this.handleToggle}>
          <Row width='30%' data-e2e='orderStatusColumn'>
            <IconTx {...this.props} />
            <StatusAndType>
              <Text
                size='16px'
                color='grey800'
                weight={600}
                data-e2e='txTypeText'
              >
                Swap {this.props.order.pair}
              </Text>
              <Timestamp {...this.props} />
            </StatusAndType>
          </Row>
          <Col width='50%' data-e2e='orderToAndFrom'>
            <Addresses
              from={<>{getOrigin(this.props)}</>}
              to={<>{getDestination(this.props)}</>}
            />
          </Col>
          {order.state === 'PENDING_DEPOSIT' ? (
            <LastCol
              width='20%'
              style={{ textAlign: 'right', alignItems: 'flex-end' }}
              data-e2e='orderAmountColumn'
            >
              <Button
                data-e2e='viewInfoButton'
                size='14px'
                height='35px'
                nature='light'
                // @ts-ignore
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  return this.showModal(order)
                }}
              >
                <FormattedMessage
                  id='modals.simplebuy.transactionlist.viewdetails'
                  defaultMessage='View Details'
                />
              </Button>
            </LastCol>
          ) : (
            <Col width='20%' data-e2e='orderAmountColumn'>
              <StyledCoinDisplay coin={coin} data-e2e='orderCoinAmt'>
                {outputMoney}
              </StyledCoinDisplay>
              <StyledFiatDisplay
                size='14px'
                weight={500}
                color='grey600'
                coin={coin}
                data-e2e='orderFiatAmt'
              >
                {outputMoney}
              </StyledFiatDisplay>
            </Col>
          )}
        </TxRow>
        {this.state.isToggled && (
          <DetailsRow>
            <DetailsColumn>
              <RowHeader>
                <FormattedMessage
                  defaultMessage='Transaction ID'
                  id='modals.simplebuy.summary.txid'
                />
              </RowHeader>
              <RowValue>{order.id}</RowValue>
              <RowHeader>
                <FormattedMessage
                  id='modals.simplebuy.summary.rate'
                  defaultMessage='Exchange Rate'
                />
              </RowHeader>
              <RowValue data-e2e='swapRate'>
                1 {base} ={' '}
                {coinToString({
                  unit: { symbol: counter },
                  value: order.priceFunnel.price
                })}
              </RowValue>
              <RowHeader>
                <FormattedMessage
                  id='copy.outgoing_fee'
                  defaultMessage='Outgoing Fee'
                />
              </RowHeader>
              <RowValue data-e2e='swapOutFee'>
                {coinToString({
                  unit: { symbol: counter },
                  value: convertBaseToStandard(
                    counter,
                    this.props.order.priceFunnel.networkFee
                  )
                })}
              </RowValue>
              <RowHeader>
                <FormattedMessage
                  id='copy.incoming_fee'
                  defaultMessage='Incoming Fee'
                />
              </RowHeader>
              <RowValue data-e2e='swapInFee'>
                {coinToString({
                  unit: { symbol: counter },
                  value: convertBaseToStandard(
                    counter,
                    this.props.order.priceFunnel.staticFee
                  )
                })}
              </RowValue>
            </DetailsColumn>
            <DetailsColumn />
            <DetailsColumn>
              <RowHeader>
                <FormattedMessage
                  defaultMessage='Status'
                  id='components.txlistitem.status'
                />
              </RowHeader>
              <RowValue>
                <Status {...this.props} />
              </RowValue>
              <RowHeader>
                <FormattedMessage
                  id='copy.amount_sent'
                  defaultMessage='Amount Sent'
                />
              </RowHeader>
              <RowValue data-e2e='swapPurchasing'>
                {fiatToString({
                  unit: this.props.order.fiatCurrency,
                  value: convertBaseToStandard(
                    'FIAT',
                    this.props.order.fiatValue
                  )
                })}
              </RowValue>
            </DetailsColumn>
          </DetailsRow>
        )}
      </TxRowContainer>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const mapStateToProps = (state: RootState) => ({
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  coin: CoinType
  order: ProcessedSwapOrderType
}
export type Props = OwnProps & ConnectedProps<typeof connector>
type State = { isToggled: boolean }

export default connector(SwapOrderTx)
