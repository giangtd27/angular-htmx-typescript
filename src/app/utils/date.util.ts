import moment from 'moment'

/**
 * Formats a date to the format: MM/DD/YYYY, H:MM AM/PM
 * Uses the user's local timezone
 */
export function formatDateTime(date: Date | string | number): string {
  const momentDate = moment(date)
  
  if (!momentDate.isValid()) {
    return ''
  }

  // Format: MM/DD/YYYY, H:MM AM/PM
  return momentDate.format('MM/DD/YYYY, h:mm A')
}

