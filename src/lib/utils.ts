import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
export function transformMonth(month: number, type: number) {
  if (type === 1) {
    switch (month) {
      case 1:
        return "January"
      case 2:
        return "February"
      case 3:
        return "March"
      case 4:
        return "April"
      case 5:
        return "May"
      case 6:
        return "June"
      case 7:
        return "July"
      case 8:
        return "August"
      case 9:
        return "September"
      case 10:
        return "October"
      case 11:
        return "November"
      case 12:
        return "December"
      default:
        return ''
    }
  }
  else {
    switch (month) {
      case 1:
        return "一月"
      case 2:
        return "二月"
      case 3:
        return "三月"
      case 4:
        return "四月"
      case 5:
        return "五月"
      case 6:
        return "六月"
      case 7:
        return "七月"
      case 8:
        return "八月"
      case 9:
        return "九月"
      case 10:
        return "十月"
      case 11:
        return "十一月"
      case 12:
        return "十二月"
      default:
        return ''
    }
  }
}
