/*
* <TODO>----------------------------------------
* イベントを受け取れるかのテスト
* テスト勉強しろ
* ----------------------------------------------
*/


//今は直書きしているけれども、まあなんとかして避けたほうが良いとは思うよ。しゃーないけど。
const TOKEN = 'Y1CQZL9Ger42ZpnTNVIJuyocShFylSQWDpI4KPoX2y12NsTFKHANvl5MevawFyJ+8N6KJy6wMrs7iVlsKpuQBOhHiFFelQ6djKgj+t9hDtPWv3vfy5ztVhW4b743TX1uBBnk199SVhyKuLGtYOInaQdB04t89/1O/w1cDnyilFU='
const USERID = 'U2343bb5925201db9a812443839edec52'


class Donut {
  constructor(...args) {
    this.donut = args;
    this.length = args.length;
  }

  get() {
    const elem = this.donut.shift();
    this.donut.push(elem);
    return elem;
  }

  add(elem) {
    this.donut.push(elem)
  }
}


//donutのテストコード
function donutTest() {
  a = new Donut("hogehoge", "apple", "foo", "bar");
  for (let i = 0; i < a.length; i++) {
    console.log(a);
    console.log(a.get());
  }
}


function someTest() {
  let toban = createTobanDonut(["apple,ringo", "あいうえお", "おっぱい"]);
  console.log(toban);
  revolveDonutEveryWeek(false, 3, toban);
}


function main() {
  //GAS側でこいつを実行する
}


//なんかイベントが受け取れるらしい。仕組みがよくわからん。
function doPost(e) {
  const event = JSON.parse(e.postData.contents).events[0];
  const replyToken = event.replyToken;

  if (typeof replyToken === "undefined") {
    return;
  }

  if(event.type === "message") {
    if(event.message.type === "text") {
      execute(event.message.text);
    }
  }
}


function execute(text) {
  if (text === undefined) {
    return;
  }

  const elems = text.split("\n");
  const command = elems[0];
  const contents = elems.slice(1);

  if (command === "!set") {
    createTobanDonut(contents)
  }
}


function revolveDonutEveryWeek(off, day, toban) {
  if (off === true || toban === undefined) {
    console.log("error");
    return;
  }

  let date = new Date();
  let toban_of_the_week = toban.get()
  console.log(date.getDay(), day, toban_of_the_week);
  if (date.getDay() === day) {
    postMessage(toban_of_the_week);
  }
}


function createTobanDonut(contents) {
  let donut = new Donut();
  for (const names of contents) {
    const toban = names.split(",");
    donut.add(toban);
  }
  return donut;
}


function postMessage(toban) {
  const url = 'https://api.line.me/v2/bot/message/push';

  const payload = {
    to: USERID,
    messages: [
      { type: 'text', text: `今週の当番は\n${toban.join("\n")}\nです。` }
    ]
  };

  const params = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + TOKEN
    },
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, params);
}
