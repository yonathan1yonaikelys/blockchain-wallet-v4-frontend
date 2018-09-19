import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Badge, Text } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import Settings from './Settings'

const BadgesContainer = styled.div`
  display: block;
  padding-top: 10px;
  & > * {
    display: inline;
    margin-right: 5px;
  }
`

const PairingCode = () => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.general.pairingcode.title'
            defaultMessage='Mobile App Pairing Code'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.general.pairingcode.description'
            defaultMessage="Scan the code (click on 'Show Pairing Code') with your Blockchain Wallet (iOS or Android) for a seamless connection to your wallet."
            altFont
            light
          />
          <FormattedMessage
            id='scenes.settings.general.pairingcode.description2'
            defaultMessage='Download our mobile applications below.'
          />
          <Text size='14px' weight={300} color='error'>
            <FormattedMessage
              id='scenes.settings.general.pairingcode.warning'
              defaultMessage='Do not share your Pairing Code with others.'
            />
          </Text>
          <BadgesContainer>
            <Badge type='applestore' />
            <Badge type='googleplay' />
          </BadgesContainer>
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

export default PairingCode
