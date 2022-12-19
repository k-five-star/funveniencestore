const { Builder, By, Key, until, Listener } = require('selenium-webdriver');
const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://<암호삭제>@cluster0.tvgexad.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);


class Prod {
    constructor(name, price, sale, img, store) {
        this.name = name;
        this.price = price;
        this.sale = sale;
        this.img = img;
        this.store = store;
    }
}

let list = [];

(async function example() {
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://cu.bgfretail.com/event/plus.do?category=event&depth2=1&sf=N');
    await driver.wait(until.elementLocated(By.className('prod_list')), 5000);


    for(var i = 0; i < 10; i++) {
        await driver.executeScript("javascript:nextPage(1)");
        await driver.sleep(15000);
    }


    //각각의 element 요소들을 추출
    let names = await driver.findElements(By.css('#contents > div.relCon > div > ul > li > a > div.prod_wrap > div.prod_text > div.name'));
    let prices = await driver.findElements(By.css('#contents > div.relCon > div > ul > li > a > div.prod_wrap > div.prod_text > div.price > strong'));
    let plus1 = await driver.findElements(By.css('#contents > div.relCon > div > ul > li > a > div.badge > span'));
    let images = await driver.findElements(By.css('#contents > div.relCon > div > ul > li > a > div.prod_wrap > div.prod_img > img'));
    let plus = plus1

    const database = client.db('project');
    const db = database.collection('productData');
    await db.deleteMany({});

    // 검색 결과의 text를 가져와서 콘솔에 출력한다.
    console.log('== Search results ==')
    for (var i = 0; i < names.length; i++) {
        var name = await names[i].getText();
        var price = await prices[i].getText();
        var sale = await plus[i].getText();
        var img = await images[i].getAttribute("src");

        if (img && price && name && sale)
            db.insertOne(new Prod(name, price, sale, img, 'CU'))
    }

    await client.close();

    driver.quit();
})();