# anki-puyo

Anki でぷよ譜を表示するためのテンプレートです。実行のたびにランダムな配色で表示することができます。

## 使い方

### ノートタイプの作成

`ツール -> ノートタイプを管理` からノートタイプ管理画面を開きます。

`追加` をクリックして新しいノートタイプを作成します。テンプレートには `追加: 基本` を選択してください。

#### フィールドの編集

新しく作成されたノートタイプが選択された状態で、`フィールド...` をクリックしフィールドを編集します。既存のフィールドをすべて削除し、以下のフィールドを追加してください。

1. `FrontBoard`: 等幅フォントがオススメ
2. `FrontNext`: 等幅フォントがオススメ
3. `FrontMsg`
4. `BackBoard`: 等幅フォントがオススメ
5. `BackNext`: 等幅フォントがオススメ
6. `BackMsg`

`保存` をクリックします。

#### テンプレートの編集

`カード...` をクリックしテンプレートを編集します。それぞれファイルの中身をコピペしてください。

- `表面のテンプレート`: [front.html](https://github.com/noriapi/anki-puyo/releases/latest/download/front.html)
- `裏面のテンプレート`: [back.html](https://github.com/noriapi/anki-puyo/releases/latest/download/back.html)
- `書式`: [styles.css](https://github.com/noriapi/anki-puyo/releases/latest/download/style.css)

`保存` をクリックします。

### 各フィールドの書き方

#### `FrontBoard`, `BackBoard`

それぞれのマスを一文字で表現し、盤面を記述します。デフォルトでは、` `（半角スペース）と `_` が空のマスに、`X` がおじゃまぷよに、それ以外の文字は色ぷよとして解釈されます。

例

```
BAC A
BBACCA
AACAAX
```

### `FrontNext`, `BackNext`

ネクストを記述します。

```
AABA
```

改行は単純に無視されるため、複数行にわけて書くこともできます。

```
AA
BA
```

### `FrontMsg`, `BackMsg`

メッセージを記述します。`{{A}}` のように `{{}}` で一文字囲むと、ぷよと同じように変換、表示されます。
