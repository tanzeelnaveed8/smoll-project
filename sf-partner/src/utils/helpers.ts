import dayjs from 'dayjs'

export const truncateString = (str: string, num: number) => {
  if (str.length > num) {
    return str.slice(0, num) + '...'
  } else {
    return str
  }
}

function parseTime(timeStr: string) {
  const period = timeStr.slice(-2) // 'AM' or 'PM'
  let hours = parseInt(timeStr.slice(0, -2), 10)

  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0

  return hours * 60 // convert to minutes
}

export function sortByCurrentTime(arr: { id: string; content: string }[]) {
  const now = new Date()
  const currentMinutes = now.getHours() * 60

  const sortedTimeGroup = arr
    .map((obj: { id: string; content: string }) => ({
      ...obj,
      timeInMinutes: parseTime(obj.id)
    }))
    .sort((a: any, b: any) => {
      const diffA = (a.timeInMinutes - currentMinutes + 1440) % 1440
      const diffB = (b.timeInMinutes - currentMinutes + 1440) % 1440
      return diffA - diffB
    })

  return sortedTimeGroup
}

export const convertTimeToUtc = (time: string) => {
  const date = dayjs().format('YYYY-MM-DD')

  return dayjs(date.toString() + 'T' + time)
    .utc()
    .format('HH:mm')
}

export const convertTimeToLocal = (time: string) => {
  const date = dayjs().format('YYYY-MM-DD')

  return dayjs(date.toString() + 'T' + time + 'Z').format('HH:mm')
}

export const requestStatus = (status : string) =>{
 switch(status){
  case 'Approved':{
    return {
      status:'Booked',
      color:'#2196f3' // Blue
    }
  }
  case 'Quotation Submitted':{
    return {
      status,
      color:'#ff9800' // Orange
    }
  }
  case 'New':{
    return {
      status,
      color:'#4caf50' // Green
    }
  }
  default :{
    return{
      status,
      color:'#757575' // Grey

    }
  }
 }
}