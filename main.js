/*
* <TODO>----------------------------------------
* ちゃんと動くかデプロイしてテスト
* 当番のプッシュメッセージのフォーマットの修正
* ----------------------------------------------
*/

const sheet = SpreadsheetApp.getActiveSheet();
const TOKEN = sheet.getRange("A1").getValue();
const USERID = sheet.getRange("A2").getValue();
const ONOFF = sheet.getRange("B1").getValue();
const DAY = 0;
var TOBAN_ALL = []
for (var i = 1; !sheet.getRange(3, i).isBlank(); i++) {
  TOBAN_ALL.push(sheet.getRange(3, i).getValue());
}
var TOBAN_NOW = sheet.getRange("A3").getValue();


function main() {
  revolveDonutEveryWeek(DAY);
}


function revolveDonutEveryWeek(day) {
  if (ONOFF === "OFF") {
    // 何もしない
  } else if (TOBAN_ALL.length === 0) {
    postMessage(
      { type: "text", text: "当番が指定されていません。"}
    );
  } else {
    let date = new Date();
    if (date.getDay() === day) {
      const temp = TOBAN_ALL.shift();
      TOBAN_ALL.push(temp);
      createTobanSS(TOBAN_ALL);
      TOBAN_NOW = sheet.getRange("A3").getValue();
      postMessage(
        { type: 'text', text: `今週の当番は\n${TOBAN_NOW}\nです。` }
      );
    }
  }
}


function doPost(e) {
  const event = JSON.parse(e.postData.contents).events[0];
  
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
  const humans = elems.slice(1);

  if (command === "!set") {
    if (TOBAN_ALL.length !== 0) {
      deleteTobanSS(TOBAN_ALL);
    }
    createTobanSS(humans);
    postMessage(
      { type: "text", text: "セットしました。"}
    );

  } else if (command === "!on") {
    sheet.getRange("B1").setValue("ON");
    postMessage(
      { type: "text", text: "ON!"}
    );

  } else if (command === "!off") {
    sheet.getRange("B1").setValue("OFF");
    postMessage(
      { type: "text", text: "OFF!"}
    );

  } else if (command === "!status") {
    postMessage(
      { type: "text", text: `OnOffStatus: ${ONOFF}\n現在の当番: ${TOBAN_NOW}\n\n↓当番リスト↓\n${TOBAN_ALL.join("\n")}`}
    );
  }
}


function createTobanSS(contents) {
  sheet.getRange(3,1,1,contents.length).setValues([contents]);
}


function deleteTobanSS(contents) {
  sheet.getRange(3,1,1,contents.length).clear();
}


function postMessage(message) {
  const url = 'https://api.line.me/v2/bot/message/push';

  const payload = {
    to: USERID,
    messages: [message]
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
