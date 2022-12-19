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

let list = [];

async function sevenEleven() {

    let list = [];
    const driver = await new Builder().forBrowser('chrome').build();

    await driver.get('https://www.7-eleven.co.kr/product/presentList.asp');
    await driver.wait(until.elementsLocated(By.className('pic_product')));

    const database = client.db('project');
    const db = database.collection('productData');

    await db.deleteMany({store : '7ELEVEN'});


    for(var sale_info = 1; sale_info <= 2; sale_info++) {
        await driver.executeScript("javascript: fncTab('" + sale_info + "')");
        await driver.sleep(3000);



        for (var page = 0; page < 10 - 1; page++) {
            await driver.executeScript("javascript: fncMore('"+sale_info+"');"); //다음 페이지로 이동
            await driver.sleep(2000);
        }
    

        var names = await driver.findElements(By.css('.pic_product .name'));
        var prices = await driver.findElements(By.css('.pic_product .price'));
        var sales1 = await driver.findElements(By.css('.ico_tag_06'));
        var sales2 = await driver.findElements(By.css('.ico_tag_07'));
        var imgs = await driver.findElements(By.css('.pic_product img'));
        

        var sales = sales1.concat(sales2);
    

        for (var i = 0; i < names.length; i++) {
            var name = await names[i].getText();
            var price = await prices[i].getText();
            var sale = await sales[i].getText();
            var img = await imgs[i].getAttribute('src');
    
            if (name && price && sale && img)
                db.insertOne(new Prod(name, price, sale, img, '7ELEVEN'));
        }       
    }
    

    //         console.log("mmmmmmmmmmmmmmmmmmm");
    // console.log(list.length);
    await client.close();
    driver.quit();
}

sevenEleven();