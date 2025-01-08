
const sayings = [
  "The page you requested could not be found.",
  "It's not here.",
  "That page doesn't exist.",
  "Sorry, but it's somewhere else.",
  "Not found."
]

export default function RandomText() {
  return(
    <p>{ sayings[Math.floor(Math.random() * sayings.length)] }, {Math.random()}</p>
  )
}