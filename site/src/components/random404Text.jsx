
const sayings = [
  "The page you requested could not be found.",
  "It's not here.",
  "That page doesn't exist.",
  "Sorry, but it's somewhere else.",
  "Not found.",
  "This website is under construction...",
  "Hmm... I thought something was here yesterday!", 
  "There was definatly something here yesterday."
]

export default function RandomText() {
  return(
    <p>{ sayings[Math.floor(Math.random() * sayings.length)] }, {Math.random()}</p>
  )
}
