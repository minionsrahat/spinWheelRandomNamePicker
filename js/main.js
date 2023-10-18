// Get DOM elements
const wheel = document.getElementById("spinner");
const spinBtn = document.getElementById("spin-button");
const refreshBtn = document.getElementById("refresh-button");
const finalValue = document.getElementById("winner-name");
const inputValue = document.getElementById("name-input");
var inputNames = inputValue.value.split(",");

// Data for the wheel
var rotationValues = [

];


// Create the pie chart
const myChart = createPieChart(wheel, [], [], []);

// Function to create a pie chart
function createPieChart(element, labels, data, colors) {
  return new Chart(element, {
    plugins: [ChartDataLabels],
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          backgroundColor: colors,
          data: data,
        },
      ],
    },
    options: {
      responsive: true,
      animation: { duration: 0 },
      plugins: {
        tooltip: false,
        legend: { display: false },
        datalabels: {
          color: "#ffffff",
          formatter: (_, context) => context.chart.data.labels[context.dataIndex],
          font: { size: 14 },
        },
      },
    },
  });
}

// Function to display a value based on the random angle
function displayValue(angleValue) {
  for (let i of rotationValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>Value: ${i.value}</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
}

// Spinner count
let count = 0;
let resultValue = 101;

// Event listener for the spin button
spinBtn.addEventListener("click", () => {

  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Good Luck!`;

  const randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  // console.log(randomDegree)
  let rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update();
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15  && myChart.options.rotation==233) {
      console.log(myChart.options.rotation)
      displayValue(myChart.options.rotation);
      updateRotationValues(inputNames)
      myChart.data.labels = inputNames;
      console.log(rotationValues)
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});

const updateRotationValues=(names)=>{
  shuffleArray(names);
  rotationValues=[]
  for (let i = 0; i < names.length; i++) {
    const minDegree = (i / names.length) * 360;
    const maxDegree = ((i + 1) / names.length) * 360;
    const value = names[i];
    rotationValues.push({ minDegree, maxDegree, value });
}
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const updateChartData = () => {
  // Split the input value by commas to get an array of names
  const cleanedNames = inputValue.value.split(",")
    .map((name) => name.trim())
    .filter((name) => name !== "");

  if (cleanedNames.length != inputNames.length) {
    inputNames =[...cleanedNames]
    const randomColors = generateRandomColors(inputNames.length);
    myChart.data.datasets[0].backgroundColor = randomColors;
    myChart.data.datasets[0].data = new Array(cleanedNames.length).fill(10);
  }
  // Update the labels , data for the pie chart
  myChart.data.labels = cleanedNames;
  updateRotationValues(cleanedNames)
  console.log(rotationValues)
  // Update the chart
  myChart.update();
}


// Function to generate random colors
const generateRandomColors = (count) => {
  const randomColors = [];
  for (let i = 0; i < count; i++) {
    const randomColor = getRandomColor();
    randomColors.push(randomColor);
  }
  return randomColors;
}


const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


// Add an input event listener
refreshBtn.addEventListener('click',()=>{
  inputValue.value=""
  updateChartData()
})
inputValue.addEventListener("blur",()=>{
  updateChartData()
  
} );

inputValue.value = "Rahat, Saifin, Azad, Amirul, Khair, Mujib"
updateChartData()