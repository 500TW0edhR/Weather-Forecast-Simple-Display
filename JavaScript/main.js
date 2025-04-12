window.addEventListener("DOMContentLoaded", () => {

    // APIキーとAPIのベースURLを定義
    const apiKey = "6dcb450532b5bf65a780a1381b0cac06";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

    // 要素の取得
    const searchBox = document.querySelector(".search input");
    const searchBtn = document.querySelector(".search button");
    const weatherIcon = document.querySelector(".weather-icon");
    const errorElement = document.querySelector(".error"); // ★ 要素を取得
    const weatherElement = document.querySelector(".weather"); // ★ 要素を取得

    // 非同期関数: 天気APIを呼び出し、結果に基づいてUIを更新する
    async function checkWeather(city) {
        if (!city.trim()) { // 空欄だったら
            errorElement.style.display = "block";
            errorElement.textContent = "都市名を入力してください。"; // エラーメッセージも設定
            weatherElement.style.display = "none";
            return; // 空欄の場合はここで処理を終了し、APIリクエストを行わない
        }

        try {
            // OpenWeatherMap APIに都市名とAPIキーを指定してリクエストを送信
            const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

            // APIからのレスポンスが成功orエラーをチェック
            if (!response.ok) {
                let errorMessage = "エラーが発生しました。";
                if (response.status === 404) {
                    errorMessage = "指定された都市が見つかりませんでした。";
                } else {
                    errorMessage = `HTTPエラー: ${response.status}`;
                }
                errorElement.style.display = "block";
                errorElement.textContent = errorMessage;
                weatherElement.style.display = "none";
                return;
            }

            // エラーメッセージを非表示にする (成功した場合)
            errorElement.style.display = "none";
            // JSONデータを解析 / 変数に格納
            const data = await response.json();

            // 取得した天気データに基づいてDOM要素を更新
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
            document.querySelector(".humidity").innerHTML = data.main.humidity + " %";
            document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

            // 天気とアイコンを紐づけ
            if (data.weather[0].main == "Clouds") {
                weatherIcon.src = "images/kumori.png";
            } else if (data.weather[0].main == "Clear") {
                weatherIcon.src = "images/hare.png";
            } else if (data.weather[0].main == "Rain") {
                weatherIcon.src = "images/ame.png";
            } else if (data.weather[0].main == "Drizzle") {
                weatherIcon.src = "images/ame.png";
            } else if (data.weather[0].main == "Thunderstorm") {
                weatherIcon.src = "images/ame.png";
            } else if (data.weather[0].main == "Snow") {
                weatherIcon.src = "images/snow.png";
            }

            // 天気情報を表示
            weatherElement.style.display = "block";

            // APIの呼び出しでエラーが発生した場合
        } catch (error) {
            console.error("Fetchエラー:", error);
            errorElement.style.display = "block";
            errorElement.textContent = "ネットワークエラーが発生しました。インターネット接続を確認してください。";
            weatherElement.style.display = "none";
        }
    }

    // .searchBtnのクリックイベント
    searchBtn.addEventListener("click", () => {
        checkWeather(searchBox.value);
    });

    // 初期表示時に何らかの都市の天気を表示したい場合は、ここで checkWeather("都市名"); を呼び出す
    // checkWeather("Tokyo");
});