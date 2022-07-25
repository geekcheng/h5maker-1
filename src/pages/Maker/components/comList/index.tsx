import React, { useCallback } from 'react'
import update from 'immutability-helper'
import { ICardProps } from '../preview'
import './index.less'
import { Card } from './Card'

const index = (props: ICardProps) => {
  const { cards, setCards } = props
  const findCard = useCallback(
    (id: string) => {
      const card = cards.filter((c) => `${c.id}` === id)[0] as {
        id: number
        text: string
      }
      return {
        card,
        index: cards.indexOf(card),
      }
    },
    [cards],
  )

  const moveCard = useCallback(
    (id: string, atIndex: number) => {
      const { card, index } = findCard(id)
      setCards(
        update(cards, {
          $splice: [
            [index, 1],
            [atIndex, 0, card],
          ],
        }),
      )
    },
    [findCard, cards, setCards],
  )

  return (
    <div className="com-list">
      <div className="com-item">
        <Card
          key={8}
          id={'8'}
          text={'test'}
          moveCard={moveCard}
          findCard={findCard}
        />
      </div>
    </div>
  )
}
export default index