import { buildings } from "./buildings.js"
const clicker = document.querySelector(".Dollar")
const counter = document.getElementById("Counter")
const shopBuildings = document.getElementById("ShopBuildings")
const mpsDisplay = document.getElementById("MPS")
const title = document.getElementById("Title")
const body = document.querySelector("body")
let buildingsFromLS =
  JSON.parse(localStorage.getItem("GameInfo")) != null
    ? JSON.parse(localStorage.getItem("GameInfo"))[1]
    : buildings
// let buildingsFromLS = JSON.parse(localStorage.getItem("GameInfo"))[1]
let buildingArray =
  buildingsFromLS.length < buildings.length ? buildings : buildingsFromLS
let money =
  JSON.parse(localStorage.getItem("GameInfo")) != null
    ? JSON.parse(localStorage.getItem("GameInfo"))[0]
    : 0
let boughtUpgrades = []
let moneyPerSecondObject = {}
let clickingPower = 1
body.style.display = "none"
setTimeout(function () {
  body.style.display = "flex"
}, 10)
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
function moneyIncrese(moneyIncrese) {
  money += moneyIncrese
  counter.innerText = `Money: ${Math.floor(money)}`
}
counter.innerText = `Money: ${Math.floor(money)}`
for (let b in buildingArray) {
  const building = document.createElement("div")
  const image = document.createElement("img")
  image.src = buildingArray[b].img
  const buildingName = document.createElement("div")
  buildingName.innerHTML = buildingArray[b].name
  buildingName.classList.add("BuildingInfoName")
  const buildingPrice = document.createElement("div")
  buildingPrice.innerHTML = `${buildingArray[b].price}$`
  buildingPrice.classList.add("BuildingInfoPrice")
  const buildingInfo = document.createElement("div")
  buildingInfo.classList.add("BuildingInfo")
  const mps = document.createElement("div")
  mps.innerHTML = `MPS: ${buildingArray[b].mps}`
  mps.classList.add("BuildingInfoMps")
  const buildingCount = document.createElement("div")
  buildingCount.classList.add("BuildingCount")
  buildingCount.innerHTML = buildingArray[b].count
  building.classList.add("building")
  buildingInfo.append(buildingName, buildingPrice, mps)
  building.append(image, buildingInfo, buildingCount)
  shopBuildings.append(building)
  moneyPerSecondObject[buildingArray[b].name] = [
    buildingArray[b].count,
    buildingArray[b].mps,
  ]
  setInterval(function () {
    if (b > 0 && buildingArray[b - 1].count > 0) {
      building.style.display = "flex"
    } else if (b == 0) {
      building.style.display = "flex"
    } else {
      building.style.display = "none"
    }
    if (money < buildingArray[b].price) {
      building.style.opacity = "0.5"
      building.style.pointerEvents = "none"
    } else {
      building.style.opacity = "1"
      building.style.pointerEvents = "auto"
    }
  }, 100)
  building.addEventListener("click", (event) => {
    if (money >= buildingArray[b].price) {
      money -= buildingArray[b].price
      counter.innerText = `Money: ${Math.floor(money)}`
      buildingArray[b].count++
      buildingCount.innerHTML = buildingArray[b].count
      buildingArray[b].price += Math.round(buildingArray[b].price * 0.15)
      buildingPrice.innerHTML = `${buildingArray[b].price}$`
      moneyPerSecondObject[buildingArray[b].name] = [
        buildingArray[b].count,
        buildingArray[b].mps,
      ]
    }
  })
}
clicker.addEventListener("click", (event) => {
  money += clickingPower
  counter.innerText = `Money: ${Math.floor(money)}`
  let floatingNumber = document.createElement("div")
  floatingNumber.classList.add("FloatingNumber")
  floatingNumber.setAttribute("data-befor", `+${clickingPower}`)
  body.appendChild(floatingNumber)
  floatingNumber.style.left = `${event.pageX}px`
  floatingNumber.style.top = `${event.pageY - 20}px`
  new Audio("./Audio/Click.mp3").play()
  setTimeout(function () {
    floatingNumber.remove()
  }, 900)
})
setInterval(function () {
  let moneyPerSecond = 0
  for (let i in moneyPerSecondObject) {
    moneyPerSecond += moneyPerSecondObject[i][0] * moneyPerSecondObject[i][1]
  }
  Math.floor((money += moneyPerSecond) * 10) / 10
  counter.innerText = `Money: ${Math.floor(money)}`
  mpsDisplay.innerText = `MPS: ${Math.floor(moneyPerSecond * 10) / 10}`
}, 1000)
setInterval(function () {
  title.innerText = `${Math.floor(money)} Money - Money Clicker`
  let gameInfo = [Math.floor(money), buildingArray]
  localStorage.setItem("GameInfo", JSON.stringify(gameInfo))
}, 3000)
