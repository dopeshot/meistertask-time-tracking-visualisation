export const formatDate = (date) => {
    return [
      date.getMonth() + 1,
      date.getDate(),
      date.getYear().toString().slice(-2),
    ].join('/');
  }

export const millisToDays = (date) => {
    return date / (1000*60*60*24)
}

export const randomColor = () => {
    return Math.floor(Math.random()*14777215+ 1000000).toString(16);
}