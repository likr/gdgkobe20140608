AngularJSハンズオン (AngularJS勉強会 by GDG神戸)

# 準備

本ハンズオンでは、XMLHttpRequestによる通信ができる環境が必要です。ローカルのHTMLファイルを直接ブラウザで開いた場合にはそれができないので、HTTPサーバーをローカルに用意するか、ブラウザの設定を変更する必要があります。

## ローカルにHTTPサーバーを立てる
Pythonがインストールされていれば、Python組み込みのHTTPサーバーを使うことができます。
コマンドラインから、Python2系だと、

```sh
python -m SimpleHTTPServer
```
Python3系だと、

```sh
python -m http.server
```
というコマンドを、HTTPサーバーで配信したディレクトリに移動して実行してください。

## ブラウザの設定を変更する

### FireFoxの場合

URLに`about:config`を入力して開いてください。警告が表示された場合確認の上進んでください。`security.fileuri.strict_origin_policy`の値を`false`に設定すればOKです。

### Google Chromeの場合

Chromeを`--allow-file-access-from-files`オプションを付けて起動します。オプションを付けて起動する前に、既に立ち上がってるChromeを全て終了させておいてください。

WindowsならChromeのショートカットを編集して、exeファイルのパスが書いてある部分の後ろに付け加えてもらえば大丈夫です。

Macだったらコマンドラインから以下のように実行します。

```sh
open /Applications/Google\ Chrome.app --args --allow-file-access-from-files
```

# Viewにデータを表示しよう

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Guestbook</title>
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
  </head>
  <body>
    <div class="container">
      <h1>Guestbook</h1>
      <div>
        <div>
          <h2>Post Greeting</h2>
          <form>
            <div class="form-group">
              <label>Name</label>
              <input class="form-control">
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group">
              <input type="submit" class="btn btn-default" value="Submit">
            </div>
          </form>
        </div>
        <div>
          <h2>Greetings</h2>
          <div>
            <span>
              <b>おのうえ</b> wrote:
            </span>
            <blockquote>こんにちは</blockquote>
          </div>
          <div>
            <span>
              <b>おのうえ</b> wrote:
            </span>
            <blockquote>はろー</blockquote>
          </div>
          <div>
            <span>
              <b>いまい</b> wrote:
            </span>
            <blockquote>Python最高！</blockquote>
          </div>
          <div>
            <span>
              An anonymous person wrote:
            </span>
            <blockquote>こんにちは</blockquote>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

## Controllerを書こう

### ModuleとControllerの作成
```
var app = angular.module('guestbook', []);

app.controller('MainController', function($scope) {
  $scope.greetings = [
    {author: 'おのうえ', content: 'こんにちは'},
    {author: 'おのうえ', content: 'はろー'},
    {author: 'いまい', content: 'Python最高！'},
    {content: 'こんにちは'}
  ];
});
```

### Scriptの読み込み
```
    <script src="bower_components/angular/angular.min.js"></script>
    <script src="guestbook.js"></script>
```

### ngApp
```
<html ng-app="guestbook">
```

### ngController
```
  <body>
    <div class="container">
      <h1>Guestbook</h1>
      <div ng-controller="MainController">
```

### bind
```
          <div>
            <span>
              <b>{{greetings[0].author}}</b> wrote:
            </span>
            <blockquote>{{greetings[0].content}}</blockquote>
          </div>
```

## Viewでのループと条件分岐

### ngRepeat
```
          <div ng-repeat="greeting in greetings">
            <span>
              <b>{{greeting.author}}</b> wrote:
            </span>
            <blockquote>{{greeting.content}}</blockquote>
          </div>
```

### ngIf
```
      <span ng-if="greeting.author">
        <b>{{greeting.author}}</b> wrote:
      </span>
      <span ng-if="!greeting.author">
        An anonymous person wrote:
      </span>
```

# Viewからデータを受け取ろう

## Greetingを追加する

### Submit処理
```
app.controller('MainController', function($scope) {
  $scope.greetings = [
    {author: 'おのうえ', content: 'こんにちは'},
    {author: 'おのうえ', content: 'はろー'},
    {author: 'いまい', content: 'Python最高！'},
    {content: 'こんにちは'}
  ];

  $scope.newGreeting = {};

  $scope.submit = function() {
    $scope.greetings.unshift($scope.newGreeting);
    $scope.newGreeting = {};
  };
});
```

### ngSubmit
```
          <form ng-submit="submit()">
```

### ngModel
```
          <div class="form-group">
              <label>Name</label>
              <input class="form-control" ng-model="newGreeting.author">
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea class="form-control" rows="3" ng-model="newGreeting.content"></textarea>
            </div>
```

## FormのValidation

### contentを必須に
```
          <form ng-submit="submit()" name="form">
            <div class="form-group">
              <label>Name</label>
              <input class="form-control" ng-model="newGreeting.author">
            </div>
            <div class="form-group" ng-class="{'has-error': form.content.$invalid && form.content.$dirty}">
              <label>Message</label>
              <textarea class="form-control" rows="3" ng-model="newGreeting.content" name="content" required></textarea>
              <p class="help-block" ng-show="form.content.$invalid && form.content.$dirty">Required</p>
            </div>
```

### SubmitされたらFormの状態を初期化する
```
  $scope.submit = function() {
    $scope.greetings.unshift($scope.newGreeting);
    $scope.newGreeting = {};
    $scope.form.$setPristine(true);
  };
```

# サーバーと通信しよう

