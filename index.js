const { MongoClient } = require("mongodb");
const express = require("express");
const http = require("http");
const path = require("path");
const { response, query } = require("express");
app = express();

var data = []

//view 엔진 set
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

//mongoDB연결
const client = new MongoClient("mongodb+srv://<암호삭제>@cluster0.tvgexad.mongodb.net/?retryWrites=true&w=majority");
const db = client.db('project').collection('productData');


//public을 설정
app.use(express.static(__dirname + '/public'));

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));


//라우팅 만들기
//루트 -> index.html보여주기
app.get('/', (request, response) => {
    response.sendFile(path.resolve(__dirname + "/public/index.html"));
})
//루트에서 post방식으로 쿼리 입력 받으면 -> 보여주기
app.post('/', async (request, response) => {
    var query = {}

    if(request.body.name)
        query.name = {$regex : request.body.name}

    if(request.body.sale)
        query.sale = request.body.sale

    if(request.body.store)
        query.store = request.body.store

    data = await db.find(query).toArray()

    response.redirect('/list')
})

app.get('/list', async (request, response) => {
    response.render('list', {items : data})
})




//list보여주기 -> EJS처리 어떻게 할지.., + DB에서 검색하는 거 + 숫자 개수 제한도 걸어야 함

//listen
app.listen(3000, () => {
    console.log("3000번지에서 서버가 시작합니다.");
})