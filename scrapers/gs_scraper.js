const { Builder, By, Key, until } = require('selenium-webdriver');
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

async function gsScraper() {
    const driver = await new Builder().forBrowser('chrome').build();

    await driver.get('http://gs25.gsretail.com/gscvs/ko/products/event-goods#;');
    await driver.wait(until.elementsLocated(By.className('prod_box')));

    await driver.sleep(5000);

    const database = client.db('project');
    const db = database.collection('productData');

    for (var page = 1; page <= 15; page++) {
        let list = []

        await driver.executeScript('goodsPageController.movePage(' + page + ')');
        await driver.sleep(2000);

        let names = await driver.findElements(By.css('.eventtab .tit'));
        let prices = await driver.findElements(By.css('.eventtab .price'));
        let sales = await driver.findElements(By.css('.eventtab .flg01'));
        let imgs = await driver.findElements(By.css('.eventtab p.img img'));


        for (var i = 0; i < names.length; i++) {
            var name = await names[i].getText();
            var price = await prices[i].getText();
            var sale = await sales[i].getText();
            var img = await imgs[i].getAttribute('src');

            if (name && price && sale && img)
                await db.insertOne(new Prod(name, price, sale, img, 'GS25'));
        }
    }

    await client.close();
    driver.quit();
    // for (element of list)
    //     console.log(element);

    // console.log(list.length);
};

gsScraper();