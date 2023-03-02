function isDateInArray(dateArray: Array<string>, value: Date) {
  let foundMatch = false;
  dateArray.forEach((date) => {
    if (new Date(date).getTime() === value.getTime()) {
      foundMatch = true;
    }
  });

  return foundMatch;
}

export default isDateInArray;
