
import './CalendarDetails.scss'


export interface CalendarDetailsProps {
   title: string
}


const CalendarDetails = (props: CalendarDetailsProps) => {
    return (
        <div className={'calendar-details'}>
          {props.title}
        </div>
    )
}

export default CalendarDetails