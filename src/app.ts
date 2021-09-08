


const dataHandler = () => {
    fetch('https://jobs.github.com/positions.json?utf8=%E2%9C%93&description=java&location=Munich&full_time=on')
    .then(res => res.json)
    .then(data => console.log(data))
    .catch(err => console.error(err))
}

dataHandler();