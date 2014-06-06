# AngularJSハンズオン (AngularJS勉強会 by GDG神戸)

このドキュメントは2014年6月8日開催のAngularJS勉強会 by GDG神戸でのハンズオン用のものです。

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

# Step1 Viewにデータを表示しよう

さて、あなたはやんごとなき事情からGuestbookアプリを作ることになりました。Guestbookアプリとは、Webサイトの来訪者が挨拶を書いたり、他の来訪者が書いた挨拶を見ることができるアプリです。

共同開発者のデザイナーさんから以下のようなHTMLを受け取りました。このHTMLファイルをベースに、JavaScriptでアプリケーションとしての機能を吹き込んでいきましょう。

必要なファイル一式は https://github.com/likr/gdgkobe20140608/releases/tag/step1 からダウンロードできます。

**index.html**
```html
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

## Step1.1 Controllerを書こう

Guestbookアプリが扱うデータは来訪者が書き込んだ挨拶(Greeting)です。デザイナーさんが用意したHTMLファイルには4つの挨拶が含まれています。この挨拶を、JavaScriptのControllerで作って、Viewに表示してみましょう。

### ModuleとControllerの作成

ModuleとControllerを作成します。`$scope.greetings`にはあなたの好きなテストデータを設定してみてください。挨拶は匿名で書き込むことができるようにしますので、`author`は省略できます。

**guestbook.js**
```javascript
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
```html:index.html
    <script src="bower_components/angular/angular.min.js"></script>
    <script src="guestbook.js"></script>
```

### ngApp
```html:index.html
<html ng-app="guestbook">
```

### ngController
```html:index.html
  <body>
    <div class="container">
      <h1>Guestbook</h1>
      <div ng-controller="MainController">
```

### 受け取った値の表示
`{{}}`の中では、`$scope`にセットされた値を参照することができます。

```html:index.html
          <div>
            <span>
              <b>{{greetings[0].author}}</b> wrote:
            </span>
            <blockquote>{{greetings[0].content}}</blockquote>
          </div>
```

## Step1.2 Viewでのループと条件分岐
`{{greetings[0].author}}`のように、一件ずつViewを書くのはめんどうですし、greetingsのサイズが変わった時にも対応しなければ行けません。AngularJSのViewではループを使うことができます。また、匿名の来訪者の場合には表示を変える必要があります。AngularJSのViewでは条件分岐を使うこともできます。

### ngRepeat
```html:index.html
          <div ng-repeat="greeting in greetings">
            <span>
              <b>{{greeting.author}}</b> wrote:
            </span>
            <blockquote>{{greeting.content}}</blockquote>
          </div>
```

### ngIf
```html:index.html
      <span ng-if="greeting.author">
        <b>{{greeting.author}}</b> wrote:
      </span>
      <span ng-if="!greeting.author">
        An anonymous person wrote:
      </span>
```

# Step2 Viewからデータを受け取ろう
さて、Controllerであらかじめ用意した挨拶をViewで表示することができました。今度は、Formで挨拶を入力できるようにしてみましょう。

ここまで進めてきたソースは https://github.com/likr/gdgkobe20140608/releases/tag/step2 のような感じになっていると思います。途中から始める方はこれをダウンロードしてください。

## Step2.1 Greetingを追加する

### Submit処理
```js:guestbook.js
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
```html:guestbook.js
          <form ng-submit="submit()">
```

### ngModel
```html:index.html
          <div class="form-group">
              <label>Name</label>
              <input class="form-control" ng-model="newGreeting.author">
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea class="form-control" rows="3" ng-model="newGreeting.content"></textarea>
            </div>
```

## Step2.2 FormのValidation

### contentを必須に
```html:index.html
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
上の状態だと、Submitした瞬間フォームがクリアされて、contentが必須だというエラーが出ると思います。`$setPristine`でフォームの状態をリセットしましょう。

```js:guestbook.js
  $scope.submit = function() {
    $scope.greetings.unshift($scope.newGreeting);
    $scope.newGreeting = {};
    $scope.form.$setPristine(true);
  };
```

# Step3 サーバーと通信しよう
Step2でフォームから挨拶を入力できるようになりました。ですが、まだJavaScriptの値をやり取りしているだけなので、ページをリロードすると当然入力した挨拶は消えてしまいます。

さて、共同開発者のサーバーサイドエンジニアさんから、挨拶の書き込みとみんなの書き込んだ挨拶の取得ができるAPIサーバーが完成したという報告を受けたので、APIサーバーから挨拶の読み書きをできるようにしましょう。

APIサーバーのURLは http://gdgkobe-ng-guestbook.appspot.com/greetings で、GETリクエストをすると挨拶の一覧を取得でき、POSTリクエストをすると新たな挨拶を書き込むことができます。

## Step3.1 ngResourceの導入
今回のAPIサーバーはREST APIになっています。AngularJSには、REST APIへのアクセスを便利にする仕組みとしてngResourceがあります。

### scriptタグの追加
ngResouceはAngularJS本体とは別jsファイルで提供されているので、scriptタグを追加する必要があります。

```html:index.html
    <script src="bower_components/angular-resource/angular-resource.min.js"></script>
```

### 依存モジュールの指定
```js:guestbook.js
var app = angular.module('guestbook', ['ngResource']);
```

### Greetingモデルの作成
```js:guestbook.js
app.factory('Greeting', function($resource) {
  return $resource('http://gdgkobe-ng-guestbook.appspot.com/greetings');
});
```

### コントローラーへの依存性注入
```js:guestbook.js
app.controller('MainController', function($scope, Greeting) {
```


## Step3.2 サーバーとのデータ送受

### Greetingモデルによるデータ取得
```js:guestbook.js
  $scope.greetings = Greeting.query();
```

### Greetingインスタンスの作成
```js:guestbook.js
  $scope.newGreeting = new Greeting();
```

### Greetingインスタンスの保存
```js:guestbook.js
  $scope.submit = function() {
    $scope.newGreeting.$save(function(greeting) {
      $scope.greetings.unshift(greeting);
      $scope.newGreeting = new Greeting();
      $scope.form.$setPristine(true);
    });
  };
```

# Step4 複数ビューに対応しよう
これで、サーバーから挨拶を取得したり新たな挨拶を投稿することができるようになりました。今度は、このアプリのメイン画面の前にトップページをつけてみましょう。

## Step4.1 ngRouteの導入
AngularJSのアプリで複数ビューの対応をするにはngRouteが便利です。(慣れてきたら入れ子ビューにも対応して[uiRouter](https://github.com/angular-ui/ui-router)もオススメです。)

### ngRouteの読み込み
ngRouteも、ngResourceと同様に本体とは別に提供されているのでscriptタグで読み込みをします。

```html:index.html
    <script src="bower_components/angular-route/angular-route.min.js"></script>
```

### ビューの分割
アプリのメイン部分を`index.html`から`partials/main.html`に切り出します。

```html:index.html
<!DOCTYPE html>
<html ng-app="guestbook">
  <head>
    <meta charset="utf-8">
    <title>Guestbook</title>
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
  </head>
  <body>
    <div class="container">
      <h1>Guestbook</h1>
      <div ng-view></div>
    <script src="bower_components/angular/angular.min.js"></script>
    <script src="bower_components/angular-resource/angular-resource.min.js"></script>
    <script src="bower_components/angular-route/angular-route.min.js"></script>
    <script src="guestbook.js"></script>
  </body>
</html>
```

```html:partials/main.html
<div>
  <div>
    <h2>Post Greeting</h2>
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
      <div class="form-group">
        <input type="submit" class="btn btn-default" value="Submit">
      </div>
    </form>
  </div>
  <div>
    <h2>Greetings</h2>
    <div ng-repeat="greeting in greetings">
      <span ng-if="greeting.author">
        <b>{{greeting.author}}</b> wrote:
      </span>
      <span ng-if="!greeting.author">
        An anonymous person wrote:
      </span>
      <blockquote>{{greeting.content}}</blockquote>
    </div>
  </div>
</div>
```

### 依存モジュールの指定
```js:guestbook.js
var app = angular.module('guestbook', ['ngResource', 'ngRoute']);
```

### ルーティングの設定
```js:guestbook.js
app.config(function($routeProvider) {
  $routeProvider
    .when('/greetings', {
      controller: 'MainController',
      templateUrl: 'partials/main.html'
    });
});
```
`index.html#/greetings`にアクセスするとこれまでのアプリの画面を見ることができます。

## Step4.2 ビューの分割と遷移

### トップページの追加
```html:partials/top.html
<div>
  <p>Welcome</p>
  <a href="#/greetings">Show Greetings</a>
</div>
```

### トップページのルーティング
トップページへのルートを加えて、デフォルトのルートをトップページにします。

```js:guestbook.js
  $routeProvider
    .when('/', {
      templateUrl: 'partials/top.html'
    })
    .when('/greetings', {
      controller: 'MainController',
      templateUrl: 'partials/main.html'
    })
    .otherwise('/');
```

### トップへのリンク
```html:partials/main.html
  <div>
    <a href="#/">Back</a>
  </div>
```

### resolve
今は、コントローラーで非同期処理をしているので、メインのビューが一度表示されてから遅れて挨拶が表示されていると思います。ngRouteを使えば、非同期処理による依存性が全て解決されてからコントローラーの処理に入ることができます。

```js:guestbook.js
    .when('/greetings', {
      controller: 'MainController',
      templateUrl: 'partials/main.html',
      resolve: {
        greetings: function(Greeting) {
          return Greeting.query().$promise;
        }
      }
    })
```

```js:guestbook.js
app.controller('MainController', function($scope, Greeting, greetings) {
  $scope.greetings = greetings;
```
