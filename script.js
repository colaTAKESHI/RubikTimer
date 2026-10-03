let startTime;
let timerId;
let records = JSON.parse(localStorage.getItem("recordsV2")) || [];

const timer = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");

const resultArea = document.getElementById("resultArea");
const resultText = document.getElementById("resultText");
const saveButton = document.getElementById("saveButton");
const discardButton = document.getElementById("discardButton");

const todayRecordList = document.getElementById("todayRecordList");
const allRecordList = document.getElementById("allRecordList");
const pastRecordList = document.getElementById("pastRecordList");
const calendar = document.getElementById("calendar");
const deleteAllButton = document.getElementById("deleteAllButton");
const previousMonthButton = document.getElementById("previousMonthButton");
const currentMonthButton = document.getElementById("currentMonthButton");
const nextMonthButton = document.getElementById("nextMonthButton");

let isRunning = false;


// 保存するかまだ決まっていない記録
let pendingRecord = null;


// カレンダーで表示する年月
const today = new Date();

let calendarYear = today.getFullYear();
let calendarMonth = today.getMonth();


// タイマーを更新する
function updateTimer() {
    const now = Date.now();
    const elapsed = now - startTime;

    const seconds = elapsed / 1000;

    timer.textContent = seconds.toFixed(2);
}


// TOP5を表示する
function displayTop5() {

    const now = new Date();

    const today =
        now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0");


    // 今日のTOP5
    todayRecordList.innerHTML = "";

    const todayRecords = records.filter(function(recordData) {
        return recordData.date === today;
    });

    todayRecords.sort(function(a, b) {
        return a.time - b.time;
    });

    const todayTop5 = todayRecords.slice(0, 5);

    todayTop5.forEach(function(recordData, index) {

        const record = document.createElement("li");

        record.textContent =
            (index + 1) + "位　" +
            recordData.time.toFixed(2) + "秒　" +
            recordData.clockTime;

        todayRecordList.appendChild(record);
    });


    // 全期間のTOP5
    allRecordList.innerHTML = "";

    const sortedRecords = [...records].sort(function(a, b) {
        return a.time - b.time;
    });

    const allTop5 = sortedRecords.slice(0, 5);

    allTop5.forEach(function(recordData, index) {

        const record = document.createElement("li");

        record.textContent =
            (index + 1) + "位　" +
            recordData.time.toFixed(2) + "秒　" +
            recordData.date;

        allRecordList.appendChild(record);
    });
}


// スタート
startButton.addEventListener("click", function() {

    if (isRunning) {
        return;
    }

    resultArea.style.display = "none";

    startTime = Date.now();

    timerId = setInterval(updateTimer, 10);

    isRunning = true;
});


// ストップ
stopButton.addEventListener("click", function() {

    if (!isRunning) {
        return;
    }

    clearInterval(timerId);

    const time = (Date.now() - startTime) / 1000;

    const now = new Date();


    // 日付を作る
    const dateString =
        now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0");


    // 時刻を作る
    const timeString =
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0") + ":" +
        String(now.getSeconds()).padStart(2, "0");


    // 記録を作る
    pendingRecord = {
        time: time,
        date: dateString,
        clockTime: timeString
    };


    isRunning = false;

    resultText.textContent =
        time.toFixed(2) + "秒";

    resultArea.style.display = "block";
});


// タイマーをタップして開始・停止
timer.addEventListener("click", function() {

    if (isRunning) {
        stopButton.click();
    } else {
        startButton.click();
    }

});


// 保存
saveButton.addEventListener("click", function() {

    if (pendingRecord === null) {
        return;
    }

    records.push(pendingRecord);

    localStorage.setItem(
        "recordsV2",
        JSON.stringify(records)
    );

    pendingRecord = null;

    resultArea.style.display = "none";

    displayTop5();
    displayCalendar();
});


// 削除
discardButton.addEventListener("click", function() {

    pendingRecord = null;

    resultArea.style.display = "none";
});


// リセット
resetButton.addEventListener("click", function() {

    clearInterval(timerId);

    isRunning = false;

    pendingRecord = null;

    resultArea.style.display = "none";

    timer.textContent = "0.00";
});


// スペースキー
document.addEventListener("keydown", function(event) {

    if (event.code === "Space") {

        event.preventDefault();

        if (isRunning === false) {
            startButton.click();
        } else {
            stopButton.click();
        }
    }
});


// ページを開いたときにランキングを表示
displayTop5();


// 過去の日付のTOP5を表示
function displayPastTop5(selectedDate) {

    pastRecordList.innerHTML = "";

    const pastRecords = records.filter(function(recordData) {
        return recordData.date === selectedDate;
    });

    pastRecords.sort(function(a, b) {
        return a.time - b.time;
    });

    const top5 = pastRecords.slice(0, 5);

    const title = document.createElement("h3");

    title.textContent =
        selectedDate + " のTOP5";

    pastRecordList.appendChild(title);

    top5.forEach(function(recordData, index) {

        const record = document.createElement("li");

        record.textContent =
            (index + 1) + "位　" +
            recordData.time.toFixed(2) +
            "秒　" +
            recordData.clockTime;

        pastRecordList.appendChild(record);
    });
}


// カレンダーを表示する
function displayCalendar() {

    const calendarBody = document.getElementById("calendarBody");

    calendarBody.innerHTML = "";


    // 年月を表示
    const title = document.createElement("h3");

    title.textContent =
        calendarYear + "年" +
        (calendarMonth + 1) + "月";

    calendarBody.appendChild(title);


    // 曜日を表示
    const weekNames = [
        "日", "月", "火", "水", "木", "金", "土"
    ];

    const week = document.createElement("div");

    week.className = "calendar-week";

    weekNames.forEach(function(day) {

        const cell = document.createElement("div");

        cell.textContent = day;

        week.appendChild(cell);
    });

    calendarBody.appendChild(week);


    // その月の1日が何曜日か調べる
    const firstDay =
        new Date(calendarYear, calendarMonth, 1);

    const firstDayOfWeek =
        firstDay.getDay();


    // その月の日数を調べる
    const lastDay =
        new Date(calendarYear, calendarMonth + 1, 0);

    const daysInMonth =
        lastDay.getDate();


    // 日付を入れる場所
    const days = document.createElement("div");

    days.className = "calendar-days";


    // 1日の前の空白を作る
    for (let i = 0; i < firstDayOfWeek; i++) {

        const emptyCell = document.createElement("div");

        days.appendChild(emptyCell);
    }


    // 1日～月末まで表示する
    for (let day = 1; day <= daysInMonth; day++) {

        const cell = document.createElement("div");

        cell.textContent = day;

        cell.className = "calendar-day";


        // この日の年月日を作る
        const dateString =
            calendarYear + "-" +
            String(calendarMonth + 1).padStart(2, "0") + "-" +
            String(day).padStart(2, "0");


        // この日に記録があるか調べる
        const hasRecord = records.some(function(recordData) {
            return recordData.date === dateString;
        });


        // 記録があれば色を付ける
        if (hasRecord) {
            cell.classList.add("has-record");
        }


        // 日付をクリックしたとき
        cell.addEventListener("click", function() {

            displayPastTop5(dateString);

        });


        days.appendChild(cell);
    }


    calendarBody.appendChild(days);
}


// 前の月
previousMonthButton.addEventListener("click", function() {

    calendarMonth--;

    if (calendarMonth < 0) {
        calendarMonth = 11;
        calendarYear--;
    }

    displayCalendar();
});


// 今月
currentMonthButton.addEventListener("click", function() {

    const today = new Date();

    calendarYear = today.getFullYear();
    calendarMonth = today.getMonth();

    displayCalendar();
});


// 次の月
nextMonthButton.addEventListener("click", function() {

    calendarMonth++;

    if (calendarMonth > 11) {
        calendarMonth = 0;
        calendarYear++;
    }

    displayCalendar();
});


// カレンダーを表示
displayCalendar();


// 全記録を削除する
deleteAllButton.addEventListener("click", function() {

    const answer = confirm(
        "本当にすべての記録を削除しますか？"
    );

    if (answer === false) {
        return;
    }

    records = [];

    localStorage.removeItem("recordsV2");

    displayTop5();
    displayCalendar();

    pastRecordList.innerHTML = "";
});
