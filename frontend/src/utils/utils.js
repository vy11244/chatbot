export function formatErrorResponse(error) {
    return {
      detail: `${error}`,
    };
  }

export function getAliasByName(name, id) {
return name.replace(/ /g, "-").toLowerCase() + "-" + id.slice(0, 5);
}

export function formatDate(isoString, withDateOfWeek = false) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const date = new Date(isoString);
    const month = months[date.getMonth()];
    const day = date.getDate();
  
    if (withDateOfWeek) {
      const dayOfWeek = days[date.getDay()];
      return `${dayOfWeek}, ${month}, ${day}`;
    }
    return `${month}, ${day}`;
  }
  
  export function removeWhiteSpace(str) {
    return str.replace(/\s/g, "");
  }