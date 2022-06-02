
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import stylesPaper from '../styles/Paper.module.scss'
import format from 'date-fns/format';
import Typography from '@mui/material/Typography';

const Bottom = ({ place, userMap }) => {
  return (
    <div>
      <Typography sx={{ fontSize: 13 }} color="text.secondary">
        {place && place.modified &&
          <>
            <span>{ `modified by ${userMap ? userMap[place.modifier].name : ''} ${formatDistanceToNow(new Date(place.modified.seconds * 1000), { addSuffix: true })}` }</span>
            <br />
          </>
        }
        {place && place.created &&
          `created ${format(new Date(place.created.seconds * 1000), "yyyy-MM-dd")}`
        }
      </Typography>
    </div>
  )
}

export default Bottom;