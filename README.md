Vue.js transitionデモ
=====================================

概要
----------------------------

- Node.jsやES6など利用せずに、HTMLとCSSとJavascriptの３ファイル構成で作成しています。

- index.html内の **vue.js** の呼び出しを **vue.min.js** に変更すると **production mode** に変わります。  
**vue.js** のままだと、Chrome拡張ツールで情報が閲覧出来てしまうので注意してください。

- debugMode = true にすると、終了時刻が現在時刻より10秒間隔に設定されます。 

- CSSファイルは、transitionの設定を記述しているだけです。  
ボタンを押すと、フェードイン／フェードアウトの効果が確認できます。
