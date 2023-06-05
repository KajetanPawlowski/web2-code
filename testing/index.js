export function capitalise(text){
    return text.toLowerCase().charAt(0).toUpperCase() + text.slice(1)
}

export function reverse(text){
   return [...text].reverse().join("")
}
