const jobitem = document.querySelector('.main__results');
const dataArray = [];
let page = 1; // Number of pages with results
let counter = 0; // count to 4 then move to next page
let currentPage = 1;

class JobElement{
    constructor(company,company_logo,company_url,created_at,description,how_to_apply,id,location,title,type,url,page) {
        this.company = company;
        this.company_logo = company_logo;
        this.company_url = company_url;
        this.created_at = created_at;
        this.description = description;
        this.how_to_apply = how_to_apply;
        this.id = id;
        this.location = location;
        this.title = title;
        this.type = type;
        this.url = url;
        this.page = page;   
    };
};

class Form {
    constructor(description, city = 'Berlin', fulltime = false){
        this.city = city;
        this.fulltime = fulltime;
        this.description = description;
    };
};
const form = new Form();
const dataHandler = async () => { // Getting data from GitApi
   await fetch(`https://t0m3k-fc4e7-default-rtdb.europe-west1.firebasedatabase.app/job.json`)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return console.error(`Http error: ${response.status}`);
        }
    })
    .then(response => {
        const arr = [];
        for(let [key, value] of Object.entries(response)){
            console.log(response)
            arr.push({key,...value});
        }
        saveData(arr);
        console.log(arr)
    })
    .catch(error => {
        console.error(error);
    });
};
const saveData = (data) => { // Saving data to dataArray ;
    console.log(data)
    for(let i=0;i<data.length;i++) {
        if(counter >= 4){ // Sort data and add page number to single record. Posible to change for display more results per page.
            page++;
            counter=0;
        }
        const dataElement = new JobElement(data[i].company,data[i].company_logo,data[i].company_url,data[i].created_at,data[i].description,data[i].how_to_apply,data[i].id,data[i].location,data[i].title,data[i].type,data[i].url,page);
        dataArray.push(dataElement);
        counter++;
    }
    printResults(dataArray);
};
const displayPages = (pageNumber) => { // Printing  switch pages buttons
    const pages = document.createElement('div');
    pages.setAttribute('class','Pages');
    jobitem.appendChild(pages);
    // Mobile load pages  button 
    const pageitem = document.createElement('span');
    pageitem.setAttribute('class','Jobitem__mobile');
    pageitem.setAttribute('id','mobile');
    pageitem.innerText = 'Load More!';
    jobitem.appendChild(pageitem);

    for(let i=0;i<= pageNumber+1;i++){
        const pageitem = document.createElement('span');
        switch(i){ // arrow left
            case 0:
                pageitem.setAttribute('class','Pages__page');
                pageitem.setAttribute('id','previous');
                pageitem.innerText = '<';
                pages.appendChild(pageitem);
                continue;
            case 5: // More that 5 pages to display hander
                if(page >= 6){

                    const dots = document.createElement('span');
                    const dots2 = document.createElement('span');
                    const id3 = document.getElementById(3);
                    const flexible =  document.getElementById(4);
                    const nextElement = document.getElementById(currentPage+1);
                    if(!nextElement){ // Logic for middlebutton change
                        if(currentPage !== page){
                            flexible.setAttribute('id', currentPage);
                            flexible.innerText = currentPage;
                        }
                    }
                    if(currentPage === 2 || currentPage === 3){
                        flexible.setAttribute('id', 3);
                        flexible.innerHTML = '3';
                    }
                    flexible.setAttribute('class','Pages__page Flexible');
                    // Tripple Dots
                    pages.insertBefore(dots, flexible);
                    dots2.setAttribute('class','Pages__page--dots');
                    dots2.innerText = '...';
                    pages.appendChild(dots2);
                    pages.replaceChild(dots2,id3);
                    dots.setAttribute('class','Pages__page--dots');
                    dots.innerText = '...';
                    pages.appendChild(dots);    
                    i = page -1;
                    continue;
                }
                else if (page == 5){
                    pageitem.setAttribute('class','Pages__page');
                    pageitem.innerText = i;
                    pageitem.setAttribute('id',i);
                    pages.appendChild(pageitem);
                    continue; 
                }
                pageitem.setAttribute('class','Pages__page');
                pageitem.setAttribute('id','next');
                pageitem.innerText = '>';
                pages.appendChild(pageitem);
                continue;
            case pageNumber+1: // Move right button
                pageitem.setAttribute('class','Pages__page');
                pageitem.setAttribute('id','next');
                pageitem.innerText = '>';
                pages.appendChild(pageitem);
                break;
            default: // rest pages
                pageitem.setAttribute('class','Pages__page');
                pageitem.innerText = i;
                pageitem.setAttribute('id',i);
                pages.appendChild(pageitem);
        }
    
    }
    pagesEventHandler();
};
const pagesEventHandler = () => { // Event handlers for switching pages and display more in mobile
    const pagesBtns = document.querySelectorAll('.Pages__page');
    const mobileBtn = document.getElementById('mobile');
    // Jobitems events listener
    document.querySelectorAll('.Jobitem').forEach(item => {  // City radio boxes
        item.addEventListener('click', event => {
        resultPage(event.target.id);
        });
    });
    mobileBtn.addEventListener('click', event => {
        currentPage += 1;
        printResults(dataArray, true);
        mobileBtn.style.bottom = '0';
        jobitem.appendChild(mobileBtn);
        // Moving footer and button always on bottom
        const footer = document.getElementsByClassName('footer');
        mobileBtn.after(footer[0]);
    });
    const currentElement = document.getElementById(currentPage);
    pagesBtns.forEach(btn => { // Rest buttons listeners
        btn.addEventListener('click', event => {
            if(event.target.id === 'previous'){
                if(currentPage === 1){
                    return;
                }
                currentPage -= 1;
                clearResults();
                printResults(dataArray);
            }else if(event.target.id === 'next'){
                if(currentPage === page){
                    return;
                }
                currentPage += 1;
                clearResults();
                printResults(dataArray);
            }else{

                currentPage = Number(event.target.id);
                clearResults();
                printResults(dataArray);
            }
        });
        currentElement.setAttribute('class', 'Pages__page Pages__page--active'); // Setting up Active button
    });
};
const printResults = (data, mobile = false) => { // display offerts
    for(let i = 0;i<data.length;i++) {
        console.log(data);
        if(currentPage === data[i].page){
            const article = document.createElement('div');
            article.setAttribute('class','Jobitem');
            jobitem.appendChild(article);
            article.setAttribute('id',`i${i}`);
        
            const image = document.createElement('span');
            image.setAttribute('class','Jobitem__image');
            image.style.backgroundImage = `url(${data[i].company_logo})`;
        
            const company = document.createElement('span');
            company.setAttribute('class','Jobitem__company');
            company.innerText = data[i].company;
        
            const occupation = document.createElement('span');
            occupation.setAttribute('class','Jobitem__occupation');
            occupation.innerHTML = `<p>${data[i].title}<p>`;
        
            const type = document.createElement('span');
            type.setAttribute('class','Jobitem__type');
            type.innerText = data[i].type;
         
            const city = document.createElement('span');
            city.setAttribute('class','Jobitem__city');
            city.innerHTML = `<p>${data[i].location}<p>`;
        
            const posted = document.createElement('span');
            posted.setAttribute('class','Jobitem__posted');
            posted.innerHTML = countDaysAge(data[i].created_at);

            article.appendChild(image);
            article.appendChild(company);
            article.appendChild(occupation);
            article.appendChild(type);
            article.appendChild(city);
            article.appendChild(posted);
        }
    }
    if(!mobile){
       displayPages(page); // Display all buttons except mobile
    }
};
const countDaysAge = (date) => { // Counting days from posted
    let today = new Date();
    const dateArray = date.split(' ');
    return `<p>${Number(dateArray[2]) - today.getDate()} days ago</p>`;
};
const clearResults = () =>{ // Cleaner for results and buttons
    while (jobitem.firstChild) {
        jobitem.firstChild.remove();
    }
};
const submitButtonHandler = () => { // Sumbit form listener
    dataHandler(form.description, form.city, form.fulltime);
    clearResults();
};
const resultPage = (targetId) => {
    const id = Number(targetId.substr(1, targetId.length));
    const header = document.querySelector('.header__search');
    const mainfilter = document.querySelector('.main__filter');
    const resultPage = document.querySelector('.ResultPage');
    header.style.visibility = 'hidden';
    mainfilter.style.visibility = 'hidden';
    jobitem.style.visibility = 'hidden';
    resultPage.style.visibility = 'visible';

    const howto = document.querySelector('.ResultPage__sidebar--howto');
    howto.innerHTML = dataArray[id].how_to_apply;
    const jobheader = document.querySelector('.ResultPage__maincontent--header');
    jobheader.inneHTML = `<h2>${dataArray[id].title}</h2><p>${dataArray[id].type}</p>`;
    
};
/////////////////// Event Listeners \\\\\\\\\\\\\\\\\\\\\\\
document.querySelectorAll('.checkbox__city').forEach(item => {  // City radio boxes
    item.addEventListener('click', event => {
      form.city = item.id;
    });
  });
document.getElementById('Fulltime').addEventListener('click', event => {  // Fultime checbox
    if(form.fulltime === false) {
        form.fulltime = true;
    }else {form.fulltime = false;}
});
document.querySelector('.main__filter--input').addEventListener('change', event => { // City input listener
 form.city = event.target.value;
});
document.querySelector('.header__search--input').addEventListener('change', event => { // Description input listener
 form.description = event.target.value;
});
// Return to main site button
document.querySelector('.ResultPage__sidebar--Returnbtn').addEventListener('click', event => {
    const header = document.querySelector('.header__search');
    const mainfilter = document.querySelector('.main__filter');
    const resultPage = document.querySelector('.ResultPage');
    header.style.visibility = 'visible';
    mainfilter.style.visibility = 'visible';
    jobitem.style.visibility = 'visible';
    resultPage.style.visibility = 'hidden';
});
// Submit Listeners 
document.querySelector('.header__search--button').addEventListener('click', submitButtonHandler, false); 
document.querySelector('.header__search--form').addEventListener('keypress',(e) => {
    if (e.key === 'Enter') {
        return submitButtonHandler();
    }
});
submitButtonHandler();