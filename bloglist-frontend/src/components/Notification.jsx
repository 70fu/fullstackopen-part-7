import PropTypes from 'prop-types';

const Notification = ({ message, typeClass }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`notification ${typeClass}`}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message:PropTypes.string.isRequired,
  typeClass:PropTypes.string.isRequired
}

export default Notification