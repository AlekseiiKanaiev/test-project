window.onload = ()=>{
    // var apiKey = "AIzaSyC5mcWMqSMxtaecdQx-wsq6cgoZSKqZd0I"
    document.getElementById('btn-search').addEventListener('click', ()=>{
        // event.preventDefault();
        removeAlert();
        let query = document.getElementById('book_search').value;
        let alertInfo = '<div id = "alert-info" class="alert alert-warning" role="alert">'+
                        'Please, enter name of the book!</div>';
        if (!query){
            document.getElementById('search-form').insertAdjacentHTML("beforeend", alertInfo);
            console.log("no query");
        }
        else{
            console.log(query);
            const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${query}`;
            getJSONBooks(url).then((result)=>{
                let items = result.items;
                let content = '<div class = "row">';
                content += '<div class="col-md-4"><h4>Name</h4></div>'+
                            '<div class="col-md-4"><h4>Author</h4></div>'+
                            '<div class="col-md-1"><h4>Price</h4></div>'+
                            '<div class="col-md-3"></div></div>';
                for (let i = 0; i < items.length; i++){
                    let title = items[i].volumeInfo.title;
                    let authors = (items[i].volumeInfo.authors)? items[i].volumeInfo.authors.join():"None";
                    let price = (items[i].saleInfo)? items[i].saleInfo.retailPrice.amount:"None";
                    content +=  '<div class = "row">'+
                                `<div class="col-md-4">${title}</div>`+
                                `<div class="col-md-4">${authors}</div>`+
                                `<div class="col-md-1">${price}</div>`+
                                '<div class="col-md-3"><div class="book-info d-flex flex-column justify-content-center align-items-center">'+
                                `<button class="btn btn-info btn-sm" type="button" data-toggle="modal" data-target="#bookinfo" data-book = "${i}">View details</button></div></div></div>`;
                }   
                document.getElementById('content').innerHTML = content;

                $('.modal').on('show.bs.modal', (event)=>{
                    let button = $(event.relatedTarget) // Button that triggered the modal
                    let book = button.data('book') // Extract info from data-* attributes
                    let ch_book = items[book];
                    // console.log(ch_book);
                    if (ch_book){
                        let img = (ch_book.volumeInfo.imageLinks)?
                            `<img src = '${ch_book.volumeInfo.imageLinks.smallThumbnail}' alt = '${ch_book.volumeInfo.title}' >`
                            :'There is no image';
                        let description = (ch_book.volumeInfo.description)?
                            ch_book.volumeInfo.description
                            :'There is no description';
                        document.querySelector('.modal-title').innerHTML = ch_book.volumeInfo.title;
                        document.querySelector('.modal-body').innerHTML = img+'<br/>'+description;
                    }
                })
            })
            .catch((err)=>{
                console.log("Err: "+err);
                alertInfo = `<div id = "alert-info" class="alert alert-danger" role="alert">${err}!</div>`;
                document.getElementById('search-form').insertAdjacentHTML("beforeend", alertInfo);
            })
        }
    })
}
function removeAlert(){
    if(document.getElementById('alert-info'))
        document.getElementById('search-form').removeChild(document.getElementById('alert-info'))
}

function getJSONBooks(url) {
    return getBooks(url).then(JSON.parse);
  }

function getBooks(url){
    return new Promise((resolve, reject)=>{
        const request = new XMLHttpRequest();
        let fields = 'items(saleInfo(retailPrice),volumeInfo(description,title,authors,imageLinks/smallThumbnail))'
        
        request.open('GET', `${url}&fields=${fields}&maxResults=10`)
        request.onload = ()=>{
            if (request.status === 200){
                resolve(request.response)
            }
            else{
                reject(Error(request.statusText))
            }
        }
        request.onerror = ()=>{
            reject(Error('Network Error'))
        }
        request.send();
        console.log('submit');
    })
}