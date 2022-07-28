import { Button } from 'antd'
import React from 'react'
import { Card } from './Card'
import './index.less'

export interface ICardProps {
  cards: {
    id: number;
    text: string;
  }[]
  setCards: React.Dispatch<React.SetStateAction<{
    id: number;
    text: string;
  }[]>>
  showIframe: boolean
  compActiveIndex: number | null
}

const index = (props: ICardProps) => {
  const { cards, setCards, showIframe = true, compActiveIndex } = props
  return (
    <div className='preview-wrap'>
      <div className='tool-bar'>
        <div className='btn'>页面设置</div>
        <div className='btn'>组件管理</div>
        <div className='btn'>历史记录</div>
      </div>
      <iframe
        className='preview-iframe'
        src="http://localhost:3007/#/preview"
        scrolling="yes"
        frameBorder="0"
        id="previewIframe"
        style={{ visibility: showIframe ? 'visible' : 'hidden' }}
      />
      <div 
        className='preview'  
        style={{ visibility: !showIframe ? 'visible' : 'hidden' }}
      >
        <div className="content">
          {cards.map((card, index) => (
            <Card
              key={card.id + '-' + index}
              IDkey={card.id + '-' + index}
              item={card}
              index={index}
              cards={cards}
              setCards={setCards}
              compActiveIndex={compActiveIndex}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
export default index