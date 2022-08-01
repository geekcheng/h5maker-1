import type { Identifier, XYCoord } from 'dnd-core'
import { FC, useMemo } from 'react'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import update from 'immutability-helper'
import classnames from 'classnames'

export interface CardProps {
  item: {
    id: number;
    text: string;
  }
  index: number
  cards: {
    id: number;
    text: string;
  }[]
  setCards: any
  IDkey: string
  compActiveIndex: number | null
}

export interface Item {
  id: number
  text: string
}

interface DragItem {
  originalIndex: number
  comp: Item
}

export const Card: FC<CardProps> = ({ item, IDkey, cards, index, setCards, compActiveIndex }) => {
  const { id, text } = item
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'comp',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.originalIndex
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      if (item.originalIndex !== -1) {
        setCards((prevCards: Item[]) =>
          update(prevCards, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, prevCards[dragIndex] as Item],
            ],
          }),
        )
      } else {
        setCards((prevCards: Item[]) =>
          update(prevCards, {
            $splice: [
              [hoverIndex, 0, item.comp],
            ],
          }),
        )
      }
      item.originalIndex = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'comp',
    item: () => {
      return { comp: item, originalIndex: index }
    },
    isDragging: (monitor) => {
      return monitor.getItem().comp.id + '-' + monitor.getItem().originalIndex === IDkey
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  const titleTextStyle = useMemo(()=>{
    let result = {}

    if(item.name==='titleText'){
      item?.config.forEach((_item:any)=>{
        if(_item.config){
          result[_item.format] = _item.config.style
        }
      })
    }

    return result
  },[item,cards])

  return (
    <div
      ref={ref}
      style={{
        opacity,
        border: '1px solid #blue'
      }}
      className={classnames('card-container', {
        'active': compActiveIndex === index
      })}
      data-handler-id={handlerId}
    >
      {item.name === 'titleText' && item?.config.map((item2, index2) => {
        console.log(2,titleTextStyle['position'])
        return (
          <div 
            key={`titleText-${index2}`} 
            className='title-text-container'
            style={titleTextStyle['position']}
          >
            {item2.type === 'input' && (<span className='titleTextBlonder' style={titleTextStyle['title-size']}>{item2.value}</span>)}
            {item2.type === 'textarea' && (<span style={titleTextStyle['content-size']}>{item2.value}</span>)}
          </div>
        )
      })}
    </div>
  )
}
